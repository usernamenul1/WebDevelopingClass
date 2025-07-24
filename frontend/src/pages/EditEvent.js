import React, { useEffect, useState } from 'react';
import {
    Card,
    Form,
    Input,
    DatePicker,
    InputNumber,
    Button,
    message,
    Typography,
    Space,
    Spin
} from 'antd';
import {
    CalendarOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    DollarOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { eventsAPI } from '../api';

const { Title } = Typography;
const { TextArea } = Input;

const EditEvent = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            try {
                const response = await eventsAPI.getEvent(id);
                const event = response.data;
                form.setFieldsValue({
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    event_time: dayjs(event.event_time),
                    capacity: event.capacity,
                    price: event.price ? event.price / 100 : 0,
                });
            } catch (error) {
                message.error('加载活动信息失败');
                navigate('/my-events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, form, navigate]);

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const eventData = {
                ...values,
                event_time: values.event_time.toISOString(),
                price: values.price ? Math.round(values.price * 100) : 0,
            };
            await eventsAPI.updateEvent(id, eventData);
            message.success('活动更新成功！');
            navigate(`/events/${id}`);
        } catch (error) {
            const errorMsg = error.response?.data?.detail || '更新活动失败';
            message.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    };

    return (
        <div style={{
            padding: '24px',
            backgroundColor: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)'
        }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <Card>
                    <div style={{ marginBottom: 32, textAlign: 'center' }}>
                        <Title level={2}>
                            <CalendarOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                            编辑活动
                        </Title>
                        <p style={{ color: '#666', fontSize: 16 }}>
                            修改你的活动信息
                        </p>
                    </div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            size="large"
                        >
                            <Form.Item
                                name="title"
                                label="活动标题"
                                rules={[
                                    { required: true, message: '请输入活动标题' },
                                    { min: 5, message: '标题至少5个字符' },
                                    { max: 100, message: '标题最多100个字符' }
                                ]}
                            >
                                <Input placeholder="活动标题" showCount maxLength={100} />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="活动描述"
                                rules={[
                                    { max: 1000, message: '描述最多1000个字符' }
                                ]}
                            >
                                <TextArea rows={6} placeholder="活动描述" showCount maxLength={1000} />
                            </Form.Item>
                            <Form.Item
                                name="location"
                                label={<Space><EnvironmentOutlined />活动地点</Space>}
                                rules={[
                                    { required: true, message: '请输入活动地点' },
                                    { max: 200, message: '地点最多200个字符' }
                                ]}
                            >
                                <Input placeholder="活动地点" showCount maxLength={200} />
                            </Form.Item>
                            <Form.Item
                                name="event_time"
                                label={<Space><CalendarOutlined />活动时间</Space>}
                                rules={[
                                    { required: true, message: '请选择活动时间' }
                                ]}
                            >
                                <DatePicker
                                    showTime
                                    style={{ width: '100%' }}
                                    placeholder="选择活动开始时间"
                                    disabledDate={disabledDate}
                                    format="YYYY-MM-DD HH:mm"
                                />
                            </Form.Item>
                            <Form.Item
                                name="capacity"
                                label={<Space><TeamOutlined />活动容量</Space>}
                                rules={[
                                    { required: true, message: '请输入活动容量' },
                                    { type: 'number', min: 1, message: '容量至少为1人' },
                                    { type: 'number', max: 1000, message: '容量最多为1000人' }
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="最多可容纳多少人参加"
                                    min={1}
                                    max={1000}
                                    addonAfter="人"
                                />
                            </Form.Item>
                            <Form.Item
                                name="price"
                                label={<Space><DollarOutlined />活动费用</Space>}
                                rules={[
                                    { type: 'number', min: 0, message: '费用不能为负数' },
                                    { type: 'number', max: 10000, message: '费用最多为10000元' }
                                ]}
                                extra="输入0表示免费活动"
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="活动费用（元）"
                                    min={0}
                                    max={10000}
                                    precision={2}
                                    addonAfter="元"
                                />
                            </Form.Item>
                            <Form.Item style={{ marginTop: 40 }}>
                                <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
                                    <Button
                                        size="large"
                                        onClick={() => navigate(-1)}
                                        style={{ minWidth: 120 }}
                                    >
                                        取消
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={submitting}
                                        size="large"
                                        style={{ minWidth: 120 }}
                                    >
                                        保存修改
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default EditEvent;
