import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// 创建 axios 实例
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器：添加认证令牌
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器：处理认证错误
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // 清除本地存储的令牌
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            // 重定向到登录页面
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 认证相关 API
export const authAPI = {
    // 用户注册
    register: (userData) => api.post('/auth/register', userData),

    // 用户登录
    login: (credentials) => {
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        return api.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // 获取当前用户信息
    getCurrentUser: () => api.get('/auth/me'),
};

// 活动相关 API
export const eventsAPI = {
    // 获取活动列表
    getEvents: (params = {}) => api.get('/events/', { params }),

    // 获取活动详情
    getEvent: (eventId) => api.get(`/events/${eventId}`),

    // 创建活动
    createEvent: (eventData) => api.post('/events/', eventData),

    // 更新活动
    updateEvent: (eventId, eventData) => api.put(`/events/${eventId}`, eventData),

    // 删除活动
    deleteEvent: (eventId) => api.delete(`/events/${eventId}`),

    // 获取我创建的活动
    getMyEvents: () => api.get('/events/my'),

    // 报名活动
    registerEvent: (eventId) => api.post(`/events/${eventId}/register`),
};

// 订单相关 API
export const ordersAPI = {
    // 获取我的订单
    getMyOrders: () => api.get('/orders/'),

    // 获取订单详情
    getOrder: (orderId) => api.get(`/orders/${orderId}`),

    // 取消订单
    cancelOrder: (orderId) => api.delete(`/orders/${orderId}`),
};

// 评论相关 API
export const commentsAPI = {
    // 创建评论
    createComment: (commentData) => api.post('/comments/', commentData),

    // 获取活动评论
    getEventComments: (eventId) => api.get(`/comments/events/${eventId}`),

    // 删除评论
    deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};

export default api;
