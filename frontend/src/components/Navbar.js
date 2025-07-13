import React from 'react';
import { Layout, Menu, Button, Space, Avatar, Dropdown } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    HomeOutlined,
    CalendarOutlined,
    PlusOutlined,
    UserOutlined,
    LogoutOutlined,
    OrderedListOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header } = Layout;

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // 用户菜单
    const userMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link to="/profile">个人资料</Link>
            </Menu.Item>
            <Menu.Item key="my-events" icon={<CalendarOutlined />}>
                <Link to="/my-events">我的活动</Link>
            </Menu.Item>
            <Menu.Item key="my-orders" icon={<OrderedListOutlined />}>
                <Link to="/my-orders">我的订单</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                退出登录
            </Menu.Item>
        </Menu>
    );

    // 主导航菜单
    const menuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: <Link to="/">首页</Link>,
        },
        {
            key: '/events',
            icon: <CalendarOutlined />,
            label: <Link to="/events">活动列表</Link>,
        },
    ];

    if (isAuthenticated) {
        menuItems.push({
            key: '/create-event',
            icon: <PlusOutlined />,
            label: <Link to="/create-event">发布活动</Link>,
        });
    }

    return (
        <Header style={{
            position: 'fixed',
            zIndex: 1,
            width: '100%',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            padding: '0 24px'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '100%'
            }}>
                {/* Logo */}
                <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1890ff'
                }}>
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        体育活动平台
                    </Link>
                </div>

                {/* 导航菜单 */}
                <Menu
                    theme="light"
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        flex: 1,
                        justifyContent: 'center'
                    }}
                />

                {/* 用户操作区域 */}
                <Space>
                    {isAuthenticated ? (
                        <Dropdown overlay={userMenu} placement="bottomRight">
                            <Button type="text" style={{ height: 'auto', padding: '4px 8px' }}>
                                <Space>
                                    <Avatar size="small" icon={<UserOutlined />} />
                                    <span>{user?.username}</span>
                                </Space>
                            </Button>
                        </Dropdown>
                    ) : (
                        <Space>
                            <Button type="text">
                                <Link to="/login">登录</Link>
                            </Button>
                            <Button type="primary">
                                <Link to="/register">注册</Link>
                            </Button>
                        </Space>
                    )}
                </Space>
            </div>
        </Header>
    );
};

export default Navbar;
