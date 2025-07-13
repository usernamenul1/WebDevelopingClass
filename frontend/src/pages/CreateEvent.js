import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    DatePicker,
    InputNumber,
    Button,
    message,
    Typography,
    Space
} from 'antd';
import {
    CalendarOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    DollarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { eventsAPI } from '../api';

const { Title } = Typography;
const { TextArea } = Input;

const CreateEvent = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);

        try {
            const eventData = {
                ...values,
                event_time: values.event_time.toISOString(),
                price: values.price ? Math.round(values.price * 100) : 0, // 转换为分
            };

            const response = await eventsAPI.createEvent(eventData);

            message.success('活动创建成功！');
            navigate(`/events/${response.data.id}`);
        } catch (error) {
            const errorMsg = error.response?.data?.detail || '创建活动失败';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const disabledDate = (current) => {
        // 不能选择过去的日期
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
                            发布新活动
                        </Title>
                        <p style={{ color: '#666', fontSize: 16 }}>
                            填写下面的信息来创建一个精彩的体育活动
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        size="large"
                        initialValues={{
                            price: 0,
                            capacity: 10
                        }}
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
                            <Input
                                placeholder="给你的活动起个吸引人的标题"
                                showCount
                                maxLength={100}
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="活动描述"
                            rules={[
                                { max: 1000, message: '描述最多1000个字符' }
                            ]}
                        >
                            <TextArea
                                rows={6}
                                placeholder="详细描述你的活动，包括活动内容、注意事项等..."
                                showCount
                                maxLength={1000}
                            />
                        </Form.Item>

                        <Form.Item
                            name="location"
                            label={
                                <Space>
                                    <EnvironmentOutlined />
                                    活动地点
                                </Space>
                            }
                            rules={[
                                { required: true, message: '请输入活动地点' },
                                { max: 200, message: '地点最多200个字符' }
                            ]}
                        >
                            <Input
                                placeholder="详细的活动地址，如：北京市朝阳区某某体育馆"
                                showCount
                                maxLength={200}
                            />
                        </Form.Item>

                        <Form.Item
                            name="event_time"
                            label={
                                <Space>
                                    <CalendarOutlined />
                                    活动时间
                                </Space>
                            }
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
                            label={
                                <Space>
                                    <TeamOutlined />
                                    活动容量
                                </Space>
                            }
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
                            label={
                                <Space>
                                    <DollarOutlined />
                                    活动费用
                                </Space>
                            }
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
                                    loading={loading}
                                    size="large"
                                    style={{ minWidth: 120 }}
                                >
                                    发布活动
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default CreateEvent;
