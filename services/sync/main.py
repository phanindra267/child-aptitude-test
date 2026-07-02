"""
AptitudePro Offline Sync Engine
Handles push/pull differential synchronisation using JSON Patch (RFC 6902).
Supports conflict detection and last-write-wins resolution.
"""
import copy
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import jsonpatch
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("sync")

# ---------------------------------------------------------------------------
# In-memory store (replace with DB in production)
# ---------------------------------------------------------------------------
# device_id -> list of versioned operation records
_sync_store: Dict[str, List[Dict[str, Any]]] = {}
# device_id -> latest merged document snapshot
_device_snapshots: Dict[str, Dict[str, Any]] = {}


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class SyncOperation(BaseModel):
    op_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    device_id: str
    timestamp: str = Field(default_factory=_now_iso)
    entity_type: str = Field(..., description="e.g. test_attempt, answer, progress")
    entity_id: str
    patch: List[Dict[str, Any]] = Field(
        ..., description="JSON Patch operations (RFC 6902)"
    )


class PushRequest(BaseModel):
    operations: List[SyncOperation]


class PushResponse(BaseModel):
    accepted: int
    rejected: int
    conflicts: List[str]
    server_timestamp: str


class PullResponse(BaseModel):
    device_id: str
    operations: List[SyncOperation]
    snapshot: Optional[Dict[str, Any]] = None
    server_timestamp: str


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AptitudePro Sync Service",
    description="Offline-first differential sync engine",
    version="1.0.0",
)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "sync", "active_devices": len(_device_snapshots)}


@app.post("/api/sync/push", response_model=PushResponse)
async def push_operations(body: PushRequest):
    """
    Accept an array of offline operations from a client device.
    Applies JSON patches to the server snapshot. Reports conflicts.
    """
    accepted = 0
    rejected = 0
    conflicts: List[str] = []

    for op in body.operations:
        device_id = op.device_id
        logger.info(
            "push  device=%s  entity=%s/%s  patches=%d",
            device_id, op.entity_type, op.entity_id, len(op.patch),
        )

        # Initialise snapshot for new devices
        if device_id not in _device_snapshots:
            _device_snapshots[device_id] = {}
        if device_id not in _sync_store:
            _sync_store[device_id] = []

        snapshot = _device_snapshots[device_id]

        try:
            patch = jsonpatch.JsonPatch(op.patch)
            _device_snapshots[device_id] = patch.apply(snapshot)
            _sync_store[device_id].append(op.model_dump())
            accepted += 1
        except jsonpatch.JsonPatchConflict as exc:
            logger.warning("Conflict on op %s: %s", op.op_id, exc)
            conflicts.append(op.op_id)
            rejected += 1
        except Exception as exc:
            logger.error("Failed to apply patch %s: %s", op.op_id, exc)
            conflicts.append(op.op_id)
            rejected += 1

    return PushResponse(
        accepted=accepted,
        rejected=rejected,
        conflicts=conflicts,
        server_timestamp=_now_iso(),
    )


@app.get("/api/sync/pull", response_model=PullResponse)
async def pull_operations(
    device_id: str = Query(..., description="Client device identifier"),
    last_sync: Optional[str] = Query(
        None, description="ISO timestamp of the last successful sync"
    ),
):
    """
    Return all operations for the device since last_sync (or all if first sync).
    Also returns the current merged snapshot.
    """
    logger.info("pull  device=%s  last_sync=%s", device_id, last_sync)

    stored = _sync_store.get(device_id, [])

    if last_sync:
        ops = [
            SyncOperation(**o)
            for o in stored
            if o.get("timestamp", "") > last_sync
        ]
    else:
        ops = [SyncOperation(**o) for o in stored]

    snapshot = _device_snapshots.get(device_id)

    return PullResponse(
        device_id=device_id,
        operations=ops,
        snapshot=snapshot,
        server_timestamp=_now_iso(),
    )
