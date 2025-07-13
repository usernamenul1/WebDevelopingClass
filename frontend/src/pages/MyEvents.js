import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Space,
    message,
    Modal,
    Tag,
    Typography,
    Empty
} from 'antd';
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    TeamOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { eventsAPI } from '../api';

const { Title } = Typography;

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 加载我的活动
    const loadMyEvents = async () => {
        setLoading(true);
        try {
            const response = await eventsAPI.getMyEvents();
            setEvents(response.data);
        } catch (error) {
            message.error('加载活动列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMyEvents();
    }, []);

    // 删除活动
    const handleDelete = async (eventId, eventTitle) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除活动"${eventTitle}"吗？此操作不可恢复。`,
            okText: '确定',
            cancelText: '取消',
            okType: 'danger',
            onOk: async () => {
                try {
                    await eventsAPI.deleteEvent(eventId);
                    message.success('活动删除成功');
                    await loadMyEvents(); // 重新加载列表
                } catch (error) {
                    message.error('删除活动失败');
                }
            },
        });
    };

    const columns = [
        {
            title: '活动标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            width: 200,
        },
        {
            title: '活动时间',
            dataIndex: 'event_time',
            key: 'event_time',
            width: 150,
            render: (time) => dayjs(time).format('MM-DD HH:mm'),
        },
        {
            title: '地点',
            dataIndex: 'location',
            key: 'location',
            ellipsis: true,
            width: 150,
        },
        {
            title: '报名情况',
            key: 'registration',
            width: 120,
            render: (_, record) => (
                <span>
                    {record.registered_count || 0}/{record.capacity}
                </span>
            ),
        },
        {
            title: '费用',
            dataIndex: 'price',
            key: 'price',
            width: 80,
            render: (price) => price > 0 ? `¥${(price / 100).toFixed(2)}` : '免费',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status) => {
                const statusMap = {
                    active: { color: 'green', text: '进行中' },
                    cancelled: { color: 'red', text: '已取消' },
                    completed: { color: 'default', text: '已完成' },
                };
                const statusInfo = statusMap[status] || { color: 'default', text: status };
                return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
            },
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 100,
            render: (time) => dayjs(time).format('MM-DD'),
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/events/${record.id}`)}
                    >
                        查看
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/events/${record.id}/edit`)}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id, record.title)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{
            padding: '24px',
            backgroundColor: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)'
        }}>
            <Card>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24
                }}>
                    <Title level={3} style={{ margin: 0 }}>
                        <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        我的活动
                    </Title>
                    <Button
                        type="primary"
                        onClick={() => navigate('/create-event')}
                    >
                        发布新活动
                    </Button>
                </div>

                {events.length > 0 ? (
                    <Table
                        columns={columns}
                        dataSource={events}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: false,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                        }}
                        scroll={{ x: 1000 }}
                    />
                ) : (
                    <Empty
                        description="你还没有创建任何活动"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                        <Button
                            type="primary"
                            onClick={() => navigate('/create-event')}
                        >
                            发布第一个活动
                        </Button>
                    </Empty>
                )}
            </Card>
        </div>
    );
};

export default MyEvents;
