import React from 'react';
import {
    Layout,
    Typography,
    Button,
    Row,
    Col,
    Card,
    Space,
    Statistic
} from 'antd';
import {
    CalendarOutlined,
    TeamOutlined,
    RocketOutlined,
    StarOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const Home = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: <CalendarOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
            title: '丰富的活动',
            description: '各类体育活动等你参与，足球、篮球、羽毛球、跑步...'
        },
        {
            icon: <TeamOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
            title: '志趣相投',
            description: '找到和你有共同爱好的运动伙伴，一起挥洒汗水'
        },
        {
            icon: <RocketOutlined style={{ fontSize: 48, color: '#faad14' }} />,
            title: '简单易用',
            description: '一键报名，轻松参与，让运动变得更简单'
        },
        {
            icon: <StarOutlined style={{ fontSize: 48, color: '#f5222d' }} />,
            title: '品质保证',
            description: '严格的活动审核，确保每一场活动都值得参与'
        }
    ];

    return (
        <Content>
            {/* 英雄区域 */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '100px 24px',
                textAlign: 'center',
                color: 'white'
            }}>
                <Title level={1} style={{ color: 'white', fontSize: '3rem', marginBottom: 24 }}>
                    运动让生活更精彩
                </Title>
                <Paragraph style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '1.2rem',
                    maxWidth: 600,
                    margin: '0 auto 40px'
                }}>
                    加入我们的体育活动平台，发现身边的运动机会，结识志同道合的朋友，享受运动带来的快乐与健康。
                </Paragraph>

                <Space size="large">
                    <Button type="primary" size="large" style={{ height: 48, padding: '0 32px', fontSize: 16 }}>
                        <Link to="/events" style={{ color: 'inherit' }}>
                            浏览活动
                        </Link>
                    </Button>
                    {!isAuthenticated && (
                        <Button
                            size="large"
                            style={{
                                height: 48,
                                padding: '0 32px',
                                fontSize: 16,
                                background: 'transparent',
                                borderColor: 'white',
                                color: 'white'
                            }}
                        >
                            <Link to="/register" style={{ color: 'inherit' }}>
                                立即注册
                            </Link>
                        </Button>
                    )}
                </Space>
            </div>

            {/* 统计数据 */}
            <div style={{ padding: '80px 24px', background: '#f5f5f5' }}>
                <Row gutter={[32, 32]} justify="center">
                    <Col xs={12} sm={6}>
                        <Card style={{ textAlign: 'center' }}>
                            <Statistic
                                title="活跃用户"
                                value={1200}
                                valueStyle={{ color: '#1890ff' }}
                                suffix="+"
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card style={{ textAlign: 'center' }}>
                            <Statistic
                                title="举办活动"
                                value={350}
                                valueStyle={{ color: '#52c41a' }}
                                suffix="+"
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card style={{ textAlign: 'center' }}>
                            <Statistic
                                title="参与人次"
                                value={8500}
                                valueStyle={{ color: '#faad14' }}
                                suffix="+"
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card style={{ textAlign: 'center' }}>
                            <Statistic
                                title="用户满意度"
                                value={98}
                                valueStyle={{ color: '#f5222d' }}
                                suffix="%"
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* 功能特色 */}
            <div style={{ padding: '80px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: 60 }}>
                    <Title level={2}>为什么选择我们？</Title>
                    <Paragraph style={{ fontSize: 16, color: '#666', maxWidth: 600, margin: '0 auto' }}>
                        我们致力于为每一位运动爱好者提供最好的运动体验，让运动成为生活中不可缺少的一部分。
                    </Paragraph>
                </div>

                <Row gutter={[32, 32]} justify="center">
                    {features.map((feature, index) => (
                        <Col xs={24} sm={12} lg={6} key={index}>
                            <Card
                                style={{
                                    textAlign: 'center',
                                    height: '100%',
                                    border: 'none',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                                }}
                                bodyStyle={{ padding: '40px 24px' }}
                            >
                                <div style={{ marginBottom: 24 }}>
                                    {feature.icon}
                                </div>
                                <Title level={4} style={{ marginBottom: 16 }}>
                                    {feature.title}
                                </Title>
                                <Paragraph style={{ color: '#666', lineHeight: 1.6 }}>
                                    {feature.description}
                                </Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* 行动号召 */}
            <div style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)',
                padding: '80px 24px',
                textAlign: 'center',
                color: 'white'
            }}>
                <Title level={2} style={{ color: 'white', marginBottom: 24 }}>
                    准备好开始你的运动之旅了吗？
                </Title>
                <Paragraph style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '1.1rem',
                    marginBottom: 40
                }}>
                    立即加入我们，发现更多精彩的体育活动！
                </Paragraph>

                <Space size="large">
                    {isAuthenticated ? (
                        <Button
                            type="primary"
                            size="large"
                            style={{
                                height: 48,
                                padding: '0 32px',
                                fontSize: 16,
                                background: 'white',
                                borderColor: 'white',
                                color: '#1890ff'
                            }}
                        >
                            <Link to="/create-event" style={{ color: 'inherit' }}>
                                发布活动
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="primary"
                                size="large"
                                style={{
                                    height: 48,
                                    padding: '0 32px',
                                    fontSize: 16,
                                    background: 'white',
                                    borderColor: 'white',
                                    color: '#1890ff'
                                }}
                            >
                                <Link to="/register" style={{ color: 'inherit' }}>
                                    立即注册
                                </Link>
                            </Button>
                            <Button
                                size="large"
                                style={{
                                    height: 48,
                                    padding: '0 32px',
                                    fontSize: 16,
                                    background: 'transparent',
                                    borderColor: 'white',
                                    color: 'white'
                                }}
                            >
                                <Link to="/login" style={{ color: 'inherit' }}>
                                    登录账户
                                </Link>
                            </Button>
                        </>
                    )}
                </Space>
            </div>
        </Content>
    );
};

export default Home;
