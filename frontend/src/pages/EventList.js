import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Input,
    Button,
    Select,
    DatePicker,
    Space,
    Pagination,
    Empty,
    Spin,
    message,
    Tag
} from 'antd';
import {
    SearchOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    UserOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { eventsAPI } from '../api';

const { RangePicker } = DatePicker;
const { Option } = Select;

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        search: '',
        location: '',
        status: 'active',
        page: 1,
        limit: 12
    });
    const [totalEvents, setTotalEvents] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const navigate = useNavigate();

    // 加载活动列表
    const loadEvents = async (params = searchParams) => {
        setLoading(true);
        try {
            const response = await eventsAPI.getEvents(params);
            const { items, total, pages } = response.data;

            setEvents(items);
            setTotalEvents(total);
            setTotalPages(pages);
        } catch (error) {
            message.error('加载活动列表失败');
            console.error('Load events error:', error);
        } finally {
            setLoading(false);
        }
    };

    // 初始加载
    useEffect(() => {
        loadEvents();
    }, []);

    // 搜索处理
    const handleSearch = () => {
        const newParams = {
            ...searchParams,
            page: 1
        };
        setSearchParams(newParams);
        loadEvents(newParams);
    };

    // 分页处理
    const handlePageChange = (page) => {
        const newParams = {
            ...searchParams,
            page
        };
        setSearchParams(newParams);
        loadEvents(newParams);
    };

    // 日期范围处理
    const handleDateRangeChange = (dates) => {
        const newParams = {
            ...searchParams,
            date_from: dates?.[0]?.format('YYYY-MM-DD'),
            date_to: dates?.[1]?.format('YYYY-MM-DD'),
        };
        setSearchParams(newParams);
    };

    // 渲染活动卡片
    const renderEventCard = (event) => {
        const isEventPassed = dayjs(event.event_time).isBefore(dayjs());

        return (
            <Col xs={24} sm={12} lg={8} xl={6} key={event.id}>
                <Card
                    hoverable
                    style={{
                        marginBottom: 16,
                        opacity: isEventPassed ? 0.7 : 1
                    }}
                    cover={
                        <div style={{
                            height: 200,
                            background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 24,
                            fontWeight: 'bold'
                        }}>
                            {event.title.substring(0, 2)}
                        </div>
                    }
                    actions={[
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => navigate(`/events/${event.id}`)}
                            disabled={isEventPassed}
                        >
                            {isEventPassed ? '活动已结束' : '查看详情'}
                        </Button>
                    ]}
                >
                    <Card.Meta
                        title={
                            <div style={{ fontSize: 16, fontWeight: 600 }}>
                                {event.title}
                                {isEventPassed && <Tag color="red" style={{ marginLeft: 8 }}>已结束</Tag>}
                            </div>
                        }
                        description={
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{
                                    fontSize: 14,
                                    color: '#666',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {event.description || '暂无描述'}
                                </div>

                                <div style={{ fontSize: 12, color: '#999' }}>
                                    <Space>
                                        <ClockCircleOutlined />
                                        {dayjs(event.event_time).format('MM-DD HH:mm')}
                                    </Space>
                                </div>

                                <div style={{ fontSize: 12, color: '#999' }}>
                                    <Space>
                                        <EnvironmentOutlined />
                                        {event.location}
                                    </Space>
                                </div>

                                <div style={{ fontSize: 12, color: '#999' }}>
                                    <Space>
                                        <UserOutlined />
                                        {event.registered_count || 0}/{event.capacity}
                                    </Space>
                                </div>

                                {event.price > 0 && (
                                    <div style={{ fontSize: 14, color: '#f5222d', fontWeight: 600 }}>
                                        ¥{(event.price / 100).toFixed(2)}
                                    </div>
                                )}
                            </Space>
                        }
                    />
                </Card>
            </Col>
        );
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
            {/* 搜索栏 */}
            <Card style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={8}>
                        <Input
                            placeholder="搜索活动名称或描述"
                            prefix={<SearchOutlined />}
                            value={searchParams.search}
                            onChange={(e) => setSearchParams({
                                ...searchParams,
                                search: e.target.value
                            })}
                            onPressEnter={handleSearch}
                        />
                    </Col>

                    <Col xs={24} sm={6}>
                        <Input
                            placeholder="活动地点"
                            prefix={<EnvironmentOutlined />}
                            value={searchParams.location}
                            onChange={(e) => setSearchParams({
                                ...searchParams,
                                location: e.target.value
                            })}
                            onPressEnter={handleSearch}
                        />
                    </Col>

                    <Col xs={24} sm={6}>
                        <RangePicker
                            style={{ width: '100%' }}
                            placeholder={['开始日期', '结束日期']}
                            onChange={handleDateRangeChange}
                        />
                    </Col>

                    <Col xs={24} sm={4}>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={handleSearch}
                            block
                        >
                            搜索
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* 活动列表 */}
            <Spin spinning={loading}>
                {events.length > 0 ? (
                    <>
                        <Row gutter={[16, 16]}>
                            {events.map(renderEventCard)}
                        </Row>

                        {/* 分页 */}
                        <div style={{ textAlign: 'center', marginTop: 32 }}>
                            <Pagination
                                current={searchParams.page}
                                total={totalEvents}
                                pageSize={searchParams.limit}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showQuickJumper
                                showTotal={(total, range) =>
                                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                                }
                            />
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <Empty
                            description="暂无活动"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                )}
            </Spin>
        </div>
    );
};

export default EventList;
