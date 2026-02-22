from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    res = client.get("/health")
    assert res.status_code < 500

def test_analyze_log():
    res = client.post("/analyze", json={
        "log": "ERROR: Connection refused at port 5000"
    })
    assert res.status_code < 500