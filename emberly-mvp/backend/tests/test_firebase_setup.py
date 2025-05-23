import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_firebase_setup_verification():
    """Test that the Firebase setup verification endpoint works."""
    response = client.get("/api/v1/auth/verify-setup")
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert "Firebase Admin SDK is properly initialized" in response.json()["message"] 