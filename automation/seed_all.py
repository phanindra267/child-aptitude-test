import json
import random
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_users():
    logger.info("Seeding users...")
    # TODO: Connect to PostgreSQL and insert mock users

def seed_test_banks():
    logger.info("Seeding test banks...")
    # TODO: Connect to MongoDB and insert mock questions

def seed_game_templates():
    logger.info("Seeding game templates...")
    # TODO: Connect to PostgreSQL and insert game metadata

if __name__ == "__main__":
    logger.info("Starting database seed process...")
    seed_users()
    seed_test_banks()
    seed_game_templates()
    logger.info("Database seeding completed.")
