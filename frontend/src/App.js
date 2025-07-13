import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// 页面组件
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';

const { Content } = Layout;

function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <AuthProvider>
                <Router>
                    <Layout style={{ minHeight: '100vh' }}>
                        <Navbar />
                        <Content style={{ marginTop: 64 }}>
                            <Routes>
                                {/* 公开路由 */}
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/events" element={<EventList />} />
                                <Route path="/events/:id" element={<EventDetail />} />

                                {/* 需要认证的路由 */}
                                <Route path="/create-event" element={
                                    <ProtectedRoute>
                                        <CreateEvent />
                                    </ProtectedRoute>
                                } />
                                <Route path="/my-events" element={
                                    <ProtectedRoute>
                                        <MyEvents />
                                    </ProtectedRoute>
                                } />
                                <Route path="/my-orders" element={
                                    <ProtectedRoute>
                                        <MyOrders />
                                    </ProtectedRoute>
                                } />
                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </Content>
                    </Layout>
                </Router>
            </AuthProvider>
        </ConfigProvider>
    );
}

export default App;
