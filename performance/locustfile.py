from locust import HttpUser, task, between

class AptitudeProUser(HttpUser):
    wait_time = between(1, 5)
    
    def on_start(self):
        # Setup: Login to get token
        res = self.client.post("/api/auth/login", json={
            "email": "loadtest@example.com",
            "password": "password123"
        })
        if res.status_code == 200:
            self.token = res.json().get("token")
            self.headers = {"Authorization": f"Bearer {self.token}"}
            
            # Get first child ID
            me_res = self.client.get("/api/auth/me", headers=self.headers)
            if me_res.status_code == 200 and me_res.json()["user"]["children"]:
                self.child_id = me_res.json()["user"]["children"][0]
            else:
                self.child_id = None
        else:
            self.token = None

    @task(3)
    def view_dashboard(self):
        if self.token:
            self.client.get("/api/auth/me", headers=self.headers)
            self.client.get("/api/children", headers=self.headers)

    @task(1)
    def start_test(self):
        if self.token and self.child_id:
            self.client.post(f"/api/tests/{self.child_id}/start", headers=self.headers)
            
    @task(2)
    def check_health(self):
        self.client.get("/api/admin/health")
