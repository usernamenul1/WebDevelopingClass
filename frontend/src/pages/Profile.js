import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    message,
    Typography,
    Space,
    Avatar,
    Descriptions
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    EditOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title } = Typography;

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [form] = Form.useForm();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // 初始化表单数据
    React.useEffect(() => {
        if (user) {
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                full_name: user.full_name || '',
                phone: user.phone || '',
            });
        }
    }, [user, form]);

    // 更新用户信息
    const onFinish = async (values) => {
        setLoading(true);
        try {
            // 模拟API调用 - 实际项目中应该调用真实的API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 更新本地用户信息
            const updatedUser = { ...user, ...values };
            updateUser(updatedUser);

            message.success('个人信息更新成功');
            setEditing(false);
        } catch (error) {
            message.error('更新失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setEditing(false);
    };

    if (!user) {
        return null;
    }

    return (
        <div style={{
            padding: '24px',
            backgroundColor: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)'
        }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <Card>
                    <div style={{ marginBottom: 32, textAlign: 'center' }}>
                        <Avatar
                            size={80}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
                        />
                        <Title level={3} style={{ margin: 0 }}>
                            {user.full_name || user.username}
                        </Title>
                        <p style={{ color: '#666', margin: '8px 0 0' }}>
                            加入时间：{new Date(user.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    {!editing ? (
                        // 查看模式
                        <>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 24
                            }}>
                                <Title level={4} style={{ margin: 0 }}>个人信息</Title>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={() => setEditing(true)}
                                >
                                    编辑资料
                                </Button>
                            </div>

                            <Descriptions
                                column={{ xs: 1, sm: 2 }}
                                labelStyle={{ fontWeight: 600 }}
                            >
                                <Descriptions.Item
                                    label={<><UserOutlined /> 用户名</>}
                                    span={2}
                                >
                                    {user.username}
                                </Descriptions.Item>

                                <Descriptions.Item
                                    label={<><MailOutlined /> 邮箱地址</>}
                                    span={2}
                                >
                                    {user.email}
                                </Descriptions.Item>

                                <Descriptions.Item
                                    label={<><UserOutlined /> 真实姓名</>}
                                >
                                    {user.full_name || '未填写'}
                                </Descriptions.Item>

                                <Descriptions.Item
                                    label={<><PhoneOutlined /> 手机号码</>}
                                >
                                    {user.phone || '未填写'}
                                </Descriptions.Item>

                                <Descriptions.Item
                                    label="账户状态"
                                >
                                    <span style={{ color: user.is_active ? '#52c41a' : '#f5222d' }}>
                                        {user.is_active ? '正常' : '已禁用'}
                                    </span>
                                </Descriptions.Item>
                            </Descriptions>
                        </>
                    ) : (
                        // 编辑模式
                        <>
                            <div style={{ marginBottom: 24 }}>
                                <Title level={4} style={{ margin: 0 }}>编辑个人信息</Title>
                            </div>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                size="large"
                            >
                                <Form.Item
                                    name="username"
                                    label="用户名"
                                    rules={[
                                        { required: true, message: '请输入用户名' },
                                        { min: 3, message: '用户名至少3个字符' },
                                        { max: 20, message: '用户名最多20个字符' }
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        disabled // 通常用户名不允许修改
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="邮箱地址"
                                    rules={[
                                        { required: true, message: '请输入邮箱' },
                                        { type: 'email', message: '请输入有效的邮箱地址' }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined />}
                                        disabled // 通常邮箱也不允许随意修改
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="full_name"
                                    label="真实姓名"
                                    rules={[
                                        { max: 50, message: '姓名最多50个字符' }
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="请输入真实姓名"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    label="手机号码"
                                    rules={[
                                        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                                    ]}
                                >
                                    <Input
                                        prefix={<PhoneOutlined />}
                                        placeholder="请输入手机号码"
                                    />
                                </Form.Item>

                                <Form.Item style={{ marginTop: 32 }}>
                                    <Space size="large">
                                        <Button
                                            onClick={handleCancel}
                                            size="large"
                                        >
                                            取消
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            size="large"
                                        >
                                            保存更改
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </>
                    )}
                </Card>

                {/* 统计信息 */}
                <Card style={{ marginTop: 24 }} title="活动统计">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 24,
                        textAlign: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>
                                0
                            </div>
                            <div style={{ color: '#666' }}>创建的活动</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>
                                0
                            </div>
                            <div style={{ color: '#666' }}>参与的活动</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>
                                0
                            </div>
                            <div style={{ color: '#666' }}>发布的评论</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
