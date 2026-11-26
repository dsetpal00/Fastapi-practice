
def register_user(client):
    client.post(
        "/users/",
        json={
            "email": "test@example.com",
            "password": "password123"
        }
    )

def test_login_success(client):
    register_user(client)

    response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_invalid_password(client):
    register_user(client)

    response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 401

def test_current_user(client):
    register_user(client)

    login = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )

    token = login.json()["access_token"]

    response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_current_user_without_token(client):
    response = client.get("/users/me")

    assert response.status_code == 401