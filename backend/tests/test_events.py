from datetime import datetime, timedelta

def test_create_event(client, auth_headers):
    """测试创建活动"""
    event_time = (datetime.now() + timedelta(days=10)).isoformat()
    response = client.post(
        "/events/",
        headers=auth_headers,
        json={
            "title": "New Test Event",
            "description": "Description for test event",
            "location": "Test Location",
            "event_time": event_time,
            "capacity": 20,
            "price": 2000
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "New Test Event"
    assert "id" in data

def test_get_events(client, test_event):
    """测试获取活动列表"""
    response = client.get("/events/")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 1
    assert any(event["title"] == "Test Event" for event in data["items"])

def test_get_event_detail(client, test_event):
    """测试获取活动详情"""
    response = client.get(f"/events/{test_event.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Event"
    assert data["id"] == test_event.id

def test_update_event(client, auth_headers, test_event):
    """测试更新活动"""
    response = client.put(
        f"/events/{test_event.id}",
        headers=auth_headers,
        json={
            "title": "Updated Event Title",
            "capacity": 15
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Event Title"
    assert data["capacity"] == 15

def test_delete_event(client, auth_headers, test_event):
    """测试删除活动"""
    response = client.delete(
        f"/events/{test_event.id}",
        headers=auth_headers
    )
    assert response.status_code == 204
    
    # 验证活动已被删除
    response = client.get(f"/events/{test_event.id}")
    assert response.status_code == 404

def test_search_events(client, test_event):
    """测试活动搜索功能"""
    response = client.get("/events/?search=Test")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any(event["title"] == "Test Event" for event in data["items"])