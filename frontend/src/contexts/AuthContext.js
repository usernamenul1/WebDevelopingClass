import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../api';

// 创建认证上下文
const AuthContext = createContext();

// 认证状态的初始值
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
};

// 认证状态管理器
const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
};

// 认证提供者组件
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // 检查本地存储的认证信息
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            const user = localStorage.getItem('user');

            if (token && user) {
                try {
                    // 验证令牌是否有效
                    const response = await authAPI.getCurrentUser();
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: {
                            user: response.data,
                            token,
                        },
                    });
                } catch (error) {
                    // 令牌无效，清除本地存储
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        checkAuth();
    }, []);

    // 登录
    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { access_token } = response.data;

            // 先保存 token 到 localStorage
            localStorage.setItem('access_token', access_token);

            // 然后获取用户信息（此时 axios 拦截器可以读取到 token）
            const userResponse = await authAPI.getCurrentUser();
            const user = userResponse.data;

            // 保存用户信息
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user,
                    token: access_token,
                },
            });

            return { success: true };
        } catch (error) {
            // 如果失败，清除可能已保存的 token
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');

            return {
                success: false,
                message: error.response?.data?.detail || '登录失败',
            };
        }
    };

    // 注册
    const register = async (userData) => {
        try {
            await authAPI.register(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail || '注册失败',
            };
        }
    };

    // 登出
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
    };

    // 更新用户信息
    const updateUser = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({
            type: 'UPDATE_USER',
            payload: user,
        });
    };

    const value = {
        ...state,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 使用认证上下文的钩子
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
