
def get_auth_headers(client, email="test@example.com"):
    client.post(
        "/users/",
        json={
            "email": email,
            "password": "password123"
        }
    )

    response = client.post(
        "/auth/login",
        data={
            "username": email,
            "password": "password123"
        }
    )

    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}

def test_create_task(client):
    headers = get_auth_headers(client)

    response = client.post(
        "/tasks/",
        json={
            "title": "Learn CI/CD",
            "description": "Practice GitHub Actions",
            "due_date": "2027-01-15T18:00:00"
        },
        headers=headers
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Learn CI/CD"
    assert data["status"] == "pending"
    assert "task_id" in data

def test_get_my_tasks(client):
    headers = get_auth_headers(client)

    client.post(
        "/tasks/",
        json={
            "title": "Learn FastAPI",
            "description": "Practice APIs",
            "due_date": "2027-01-15T18:00:00"
        },
        headers=headers
    )

    response = client.get("/tasks/", headers=headers)

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Learn FastAPI"

def test_update_task(client):
    headers = get_auth_headers(client)

    created = client.post(
        "/tasks/",
        json={
            "title": "Old title",
            "description": "Old description",
            "due_date": "2027-01-15T18:00:00"
        },
        headers=headers
    )

    task_id = created.json()["task_id"]

    response = client.put(
        f"/tasks/{task_id}",
        json={"title": "Updated title"},
        headers=headers
    )

    assert response.status_code == 200
    assert response.json()["title"] == "Updated title"

def test_delete_task(client):
    headers = get_auth_headers(client)

    created = client.post(
        "/tasks/",
        json={
            "title": "Delete me",
            "description": "Testing deletion",
            "due_date": "2027-01-15T18:00:00"
        },
        headers=headers
    )

    task_id = created.json()["task_id"]

    response = client.delete(
        f"/tasks/{task_id}",
        headers=headers
    )

    assert response.status_code == 204

    # Verify that deleted task no longer exists.
    response = client.get(
        f"/tasks/{task_id}",
        headers=headers
    )

    assert response.status_code == 404

def test_user_cannot_access_another_users_task(client):
    user1_headers = get_auth_headers(
        client, "user1@example.com"
    )

    user2_headers = get_auth_headers(
        client, "user2@example.com"
    )

    created = client.post(
        "/tasks/",
        json={
            "title": "Private task",
            "description": "Belongs to user 1",
            "due_date": "2027-01-15T18:00:00"
        },
        headers=user1_headers
    )

    task_id = created.json()["task_id"]

    response = client.get(
        f"/tasks/{task_id}",
        headers=user2_headers
    )

    assert response.status_code == 404