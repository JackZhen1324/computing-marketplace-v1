import { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import styles from './ContactForm.module.css';

interface ContactFormValues {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  title?: string;
  description?: string;
  submitText?: string;
  onSuccess?: () => void;
}

const ContactForm = ({
  title = '联系我们',
  description = '请填写以下表单，我们会尽快回复您',
  submitText = '提交咨询',
  onSuccess,
}: ContactFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ContactFormValues) => {
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Form submitted:', values);

      message.success('提交成功！我们会尽快联系您');
      form.resetFields();

      onSuccess?.();
    } catch (error) {
      message.error('提交失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          className={styles.form}
        >
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入您的姓名' }]}
          >
            <Input placeholder="请输入您的姓名" size="large" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入您的邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入您的邮箱" size="large" />
          </Form.Item>

          <Form.Item label="手机号" name="phone">
            <Input placeholder="请输入您的手机号（可选）" size="large" />
          </Form.Item>

          <Form.Item label="公司名称" name="company">
            <Input placeholder="请输入您的公司名称（可选）" size="large" />
          </Form.Item>

          <Form.Item
            label="咨询主题"
            name="subject"
            rules={[{ required: true, message: '请输入咨询主题' }]}
          >
            <Input
              placeholder="例如：GPU裸金属服务器咨询"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="详细描述"
            name="message"
            rules={[{ required: true, message: '请输入详细描述' }]}
          >
            <Input.TextArea
              placeholder="请详细描述您的需求..."
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<SendOutlined />}
              block
              className={styles.submitButton}
            >
              {submitText}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ContactForm;
