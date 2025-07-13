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
    DeleteOutlined,
    OrderedListOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { ordersAPI } from '../api';

const { Title } = Typography;

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 加载我的订单
    const loadMyOrders = async () => {
        setLoading(true);
        try {
            const response = await ordersAPI.getMyOrders();
            setOrders(response.data);
        } catch (error) {
            message.error('加载订单列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMyOrders();
    }, []);

    // 取消订单
    const handleCancel = async (orderId, eventTitle) => {
        Modal.confirm({
            title: '确认取消',
            content: `确定要取消报名"${eventTitle}"吗？`,
            okText: '确定',
            cancelText: '取消',
            okType: 'danger',
            onOk: async () => {
                try {
                    await ordersAPI.cancelOrder(orderId);
                    message.success('取消报名成功');
                    await loadMyOrders(); // 重新加载列表
                } catch (error) {
                    message.error('取消报名失败');
                }
            },
        });
    };

    const columns = [
        {
            title: '活动标题',
            key: 'event_title',
            ellipsis: true,
            width: 200,
            render: (_, record) => record.event.title,
        },
        {
            title: '活动时间',
            key: 'event_time',
            width: 150,
            render: (_, record) => dayjs(record.event.event_time).format('MM-DD HH:mm'),
        },
        {
            title: '活动地点',
            key: 'event_location',
            ellipsis: true,
            width: 150,
            render: (_, record) => record.event.location,
        },
        {
            title: '费用',
            key: 'event_price',
            width: 80,
            render: (_, record) =>
                record.event.price > 0 ? `¥${(record.event.price / 100).toFixed(2)}` : '免费',
        },
        {
            title: '活动状态',
            key: 'event_status',
            width: 100,
            render: (_, record) => {
                const isEventPassed = dayjs(record.event.event_time).isBefore(dayjs());
                if (isEventPassed) {
                    return <Tag color="default">已结束</Tag>;
                }

                const statusMap = {
                    active: { color: 'green', text: '进行中' },
                    cancelled: { color: 'red', text: '已取消' },
                    completed: { color: 'default', text: '已完成' },
                };
                const statusInfo = statusMap[record.event.status] || { color: 'default', text: record.event.status };
                return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
            },
        },
        {
            title: '报名状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => {
                const statusMap = {
                    active: { color: 'green', text: '已报名' },
                    cancelled: { color: 'red', text: '已取消' },
                };
                const statusInfo = statusMap[status] || { color: 'default', text: status };
                return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
            },
        },
        {
            title: '报名时间',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: '操作',
            key: 'actions',
            width: 150,
            fixed: 'right',
            render: (_, record) => {
                const isEventPassed = dayjs(record.event.event_time).isBefore(dayjs());
                const canCancel = record.status === 'active' && !isEventPassed;

                return (
                    <Space size="small">
                        <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/events/${record.event.id}`)}
                        >
                            查看活动
                        </Button>
                        {canCancel && (
                            <Button
                                type="link"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleCancel(record.id, record.event.title)}
                            >
                                取消报名
                            </Button>
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <div style={{
            padding: '24px',
            backgroundColor: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)'
        }}>
            <Card>
                <div style={{ marginBottom: 24 }}>
                    <Title level={3} style={{ margin: 0 }}>
                        <OrderedListOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        我的订单
                    </Title>
                </div>

                {orders.length > 0 ? (
                    <Table
                        columns={columns}
                        dataSource={orders}
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
                        description="你还没有报名任何活动"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                        <Button
                            type="primary"
                            onClick={() => navigate('/events')}
                            icon={<CalendarOutlined />}
                        >
                            去看看有什么活动
                        </Button>
                    </Empty>
                )}
            </Card>
        </div>
    );
};

export default MyOrders;
