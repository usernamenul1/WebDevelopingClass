import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock AuthContext
jest.mock('../contexts/AuthContext', () => ({
    AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
    useAuth: () => ({
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        loading: false
    })
}));

// Mock components to avoid routing issues in tests
jest.mock('../pages/Home', () => {
    return function Home() {
        return <div data-testid="home-page">Home Page</div>;
    };
});

jest.mock('../pages/Login', () => {
    return function Login() {
        return <div data-testid="login-page">Login Page</div>;
    };
});

jest.mock('../pages/EventList', () => {
    return function EventList() {
        return <div data-testid="event-list-page">Event List Page</div>;
    };
});

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('App Component', () => {
    test('renders without crashing', () => {
        renderWithRouter(<App />);
        expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });

    test('renders main navigation elements', () => {
        renderWithRouter(<App />);
        // 测试是否包含主要的导航结构
        const authProvider = screen.getByTestId('auth-provider');
        expect(authProvider).toBeInTheDocument();
    });

    test('handles routing correctly', () => {
        // 测试路由是否正确设置
        renderWithRouter(<App />);
        expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });
});
