import React, { useState, useEffect } from 'react';
import {
    Card,
    Descriptions,
    Button,
    message,
    Space,
    Typography,
    Tag,
    Divider,
    List,
    Avatar,
    Input,
    Form,
    Spin,
    Modal
} from 'antd';
import {
    CalendarOutlined,
    EnvironmentOutlined,
    UserOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    MessageOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { eventsAPI, commentsAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [event, setEvent] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [commentForm] = Form.useForm();

    // 加载活动详情
    const loadEvent = async () => {
        try {
            const response = await eventsAPI.getEvent(id);
            setEvent(response.data);
        } catch (error) {
            message.error('加载活动详情失败');
            navigate('/events');
        }
    };

    // 加载评论
    const loadComments = async () => {
        try {
            const response = await commentsAPI.getEventComments(id);
            setComments(response.data);
        } catch (error) {
            console.error('Load comments error:', error);
        }
    };

    // 初始加载
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([loadEvent(), loadComments()]);
            setLoading(false);
        };

        loadData();
    }, [id]);

    // 报名活动
    const handleRegister = async () => {
        if (!isAuthenticated) {
            message.warning('请先登录');
            navigate('/login');
            return;
        }

        Modal.confirm({
            title: '确认报名',
            content: `确定要报名参加"${event.title}"吗？`,
            onOk: async () => {
                setRegistering(true);
                try {
                    await eventsAPI.registerEvent(id);
                    message.success('报名成功！');
                    // 重新加载活动详情以更新报名人数
                    await loadEvent();
                } catch (error) {
                    const errorMsg = error.response?.data?.detail || '报名失败';
                    message.error(errorMsg);
                } finally {
                    setRegistering(false);
                }
            }
        });
    };

    // 提交评论
    const handleCommentSubmit = async (values) => {
        if (!isAuthenticated) {
            message.warning('请先登录');
            navigate('/login');
            return;
        }

        setSubmitting(true);
        try {
            await commentsAPI.createComment({
                content: values.content,
                event_id: parseInt(id)
            });

            message.success('评论发布成功！');
            commentForm.resetFields();
            // 重新加载评论
            await loadComments();
        } catch (error) {
            message.error('评论发布失败');
        } finally {
            setSubmitting(false);
        }
    };

    // 删除评论
    const handleDeleteComment = async (commentId) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这条评论吗？',
            onOk: async () => {
                try {
                    await commentsAPI.deleteComment(commentId);
                    message.success('评论删除成功！');
                    await loadComments();
                } catch (error) {
                    message.error('删除评论失败');
                }
            }
        });
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!event) {
        return null;
    }

    const isEventPassed = dayjs(event.event_time).isBefore(dayjs());
    const isEventFull = event.registered_count >= event.capacity;
    const canRegister = !isEventPassed && !isEventFull;

    return (
        <div style={{
            padding: '24px',
            backgroundColor: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* 活动基本信息 */}
                <Card style={{ marginBottom: 24 }}>
                    <div style={{ marginBottom: 24 }}>
                        <Title level={2} style={{ marginBottom: 8 }}>
                            {event.title}
                            {isEventPassed && <Tag color="red" style={{ marginLeft: 12 }}>已结束</Tag>}
                            {isEventFull && !isEventPassed && <Tag color="orange" style={{ marginLeft: 12 }}>已满员</Tag>}
                            <Tag color={event.status === 'active' ? 'green' : 'red'} style={{ marginLeft: 12 }}>
                                {event.status === 'active' ? '进行中' : '已取消'}
                            </Tag>
                        </Title>

                        <Space size="large" wrap>
                            <span>
                                <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                创建者：{event.creator.username}
                            </span>
                            <span>
                                <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                发布时间：{dayjs(event.created_at).format('YYYY-MM-DD')}
                            </span>
                        </Space>
                    </div>

                    <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
                        <Descriptions.Item
                            label={<><CalendarOutlined /> 活动时间</>}
                            span={3}
                        >
                            {dayjs(event.event_time).format('YYYY年MM月DD日 HH:mm')}
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={<><EnvironmentOutlined /> 活动地点</>}
                            span={3}
                        >
                            {event.location}
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={<><TeamOutlined /> 报名情况</>}
                        >
                            {event.registered_count || 0} / {event.capacity} 人
                        </Descriptions.Item>

                        {event.price > 0 && (
                            <Descriptions.Item
                                label={<><DollarOutlined /> 活动费用</>}
                            >
                                ¥{(event.price / 100).toFixed(2)}
                            </Descriptions.Item>
                        )}

                        <Descriptions.Item
                            label="活动状态"
                        >
                            <Tag color={event.status === 'active' ? 'green' : 'red'}>
                                {event.status === 'active' ? '进行中' : '已取消'}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>

                    {event.description && (
                        <>
                            <Divider />
                            <div>
                                <Title level={4}>活动描述</Title>
                                <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                                    {event.description}
                                </Paragraph>
                            </div>
                        </>
                    )}

                    {/* 报名按钮 */}
                    <div style={{ marginTop: 24, textAlign: 'center' }}>
                        <Button
                            type="primary"
                            size="large"
                            loading={registering}
                            disabled={!canRegister || event.status !== 'active'}
                            onClick={handleRegister}
                            style={{ minWidth: 120 }}
                        >
                            {isEventPassed ? '活动已结束' :
                                isEventFull ? '活动已满员' :
                                    event.status !== 'active' ? '活动已取消' : '立即报名'}
                        </Button>
                    </div>
                </Card>

                {/* 评论区域 */}
                <Card title={<><MessageOutlined /> 活动评论 ({comments.length})</>}>
                    {/* 发布评论 */}
                    {isAuthenticated ? (
                        <Form
                            form={commentForm}
                            onFinish={handleCommentSubmit}
                            style={{ marginBottom: 24 }}
                        >
                            <Form.Item
                                name="content"
                                rules={[
                                    { required: true, message: '请输入评论内容' },
                                    { min: 5, message: '评论内容至少5个字符' },
                                    { max: 500, message: '评论内容最多500个字符' }
                                ]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="分享你对这个活动的看法..."
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={submitting}
                                >
                                    发布评论
                                </Button>
                            </Form.Item>
                        </Form>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '24px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: 8,
                            marginBottom: 24
                        }}>
                            <Paragraph>
                                <Button type="link" onClick={() => navigate('/login')}>
                                    登录
                                </Button>
                                后可以参与评论讨论
                            </Paragraph>
                        </div>
                    )}

                    {/* 评论列表 */}
                    {comments.length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={comments}
                            renderItem={(comment) => (
                                <List.Item
                                    actions={
                                        isAuthenticated && user?.id === comment.user_id ? [
                                            <Button
                                                type="link"
                                                danger
                                                size="small"
                                                onClick={() => handleDeleteComment(comment.id)}
                                            >
                                                删除
                                            </Button>
                                        ] : []
                                    }
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<UserOutlined />} />}
                                        title={
                                            <Space>
                                                <span>{comment.user.username}</span>
                                                <span style={{ fontSize: 12, color: '#999' }}>
                                                    {dayjs(comment.created_at).format('YYYY-MM-DD HH:mm')}
                                                </span>
                                            </Space>
                                        }
                                        description={
                                            <div style={{
                                                fontSize: 14,
                                                lineHeight: 1.6,
                                                marginTop: 8
                                            }}>
                                                {comment.content}
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#999'
                        }}>
                            暂无评论，快来抢沙发吧！
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default EventDetail;
