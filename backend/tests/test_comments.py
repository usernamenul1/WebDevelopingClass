def test_create_comment(client, auth_headers, test_event):
    """测试创建评论"""
    response = client.post(
        "/comments/",
        headers=auth_headers,
        json={
            "content": "This is a test comment",
            "event_id": test_event.id
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "This is a test comment"
    assert data["event_id"] == test_event.id

def test_get_event_comments(client, auth_headers, test_event):
    """测试获取活动评论"""
    # 先创建评论
    client.post(
        "/comments/",
        headers=auth_headers,
        json={
            "content": "Test comment for getting comments",
            "event_id": test_event.id
        }
    )
    
    # 获取活动评论
    response = client.get(f"/comments/events/{test_event.id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["event_id"] == test_event.id

def test_delete_comment(client, auth_headers, test_event):
    """测试删除评论"""
    # 先创建评论
    create_response = client.post(
        "/comments/",
        headers=auth_headers,
        json={
            "content": "Comment to be deleted",
            "event_id": test_event.id
        }
    )
    comment_id = create_response.json()["id"]
    
    # 删除评论
    response = client.delete(f"/comments/{comment_id}", headers=auth_headers)
    assert response.status_code == 204
    
    # 获取活动评论确认已删除
    response = client.get(f"/comments/events/{test_event.id}")
    assert response.status_code == 200
    data = response.json()
    assert not any(comment["id"] == comment_id for comment in data)