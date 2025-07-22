def test_register_for_event(client, auth_headers, test_event):
    """测试报名活动"""
    response = client.post(
        f"/events/{test_event.id}/register",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["event_id"] == test_event.id
    assert data["status"] == "active"

def test_get_user_orders(client, auth_headers, test_event):
    """测试获取用户订单列表"""
    # 先报名活动
    client.post(f"/events/{test_event.id}/register", headers=auth_headers)
    
    # 获取订单列表
    response = client.get("/orders/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["event_id"] == test_event.id

def test_get_order_detail(client, auth_headers, test_event):
    """测试获取订单详情"""
    # 先报名活动
    register_response = client.post(
        f"/events/{test_event.id}/register", 
        headers=auth_headers
    )
    order_id = register_response.json()["id"]
    
    # 获取订单详情
    response = client.get(f"/orders/{order_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == order_id
    assert data["event_id"] == test_event.id

def test_cancel_order(client, auth_headers, test_event):
    """测试取消订单"""
    # 先报名活动
    register_response = client.post(
        f"/events/{test_event.id}/register", 
        headers=auth_headers
    )
    order_id = register_response.json()["id"]
    
    # 取消订单
    response = client.delete(f"/orders/{order_id}", headers=auth_headers)
    assert response.status_code == 204
    
    # 获取订单详情确认状态已变更
    response = client.get(f"/orders/{order_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "cancelled"