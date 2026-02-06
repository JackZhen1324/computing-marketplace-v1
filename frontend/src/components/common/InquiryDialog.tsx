import { useState } from 'react';
import { Modal, Form, Input, Checkbox, Radio, Button, message, Row, Col } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, BankOutlined } from '@ant-design/icons';
import { inquiriesService } from '../../services/api/inquiries';

interface InquiryDialogProps {
  visible: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    category: string;
  };
}

const InquiryDialog = ({ visible, onClose, product }: InquiryDialogProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Call real API
      await inquiriesService.submitInquiry({
        productId: product.id,
        ...values,
      });

      message.success('咨询提交成功！我们会尽快联系您');
      form.resetFields();
      onClose();
    } catch (error: any) {
      console.error('Submit failed:', error);
      message.error(error.response?.data?.message || '提交失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: '18px', fontWeight: 600 }}>
          产品咨询 - {product.name}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
          }}
        >
          提交咨询
        </Button>,
      ]}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        style={{ marginTop: '24px' }}
        initialValues={{
          interestedProducts: [product.name],
        }}
      >
        <Form.Item
          label="意向产品"
          name="interestedProducts"
          rules={[{ required: true, message: '请选择意向产品' }]}
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Checkbox value="GPU裸金属">GPU裸金属</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="GPU虚拟机">GPU虚拟机</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="智算一体机">智算一体机</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="MaaS平台">MaaS平台</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="通算虚拟机">通算虚拟机</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="对象存储">对象存储</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="云硬盘">云硬盘</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="文件存储">文件存储</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="NAT网关">NAT网关</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="负载均衡">负载均衡</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="浮动IP">浮动IP</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="意向规格"
          name="specification"
          rules={[{ required: true, message: '请选择意向规格' }]}
        >
          <Radio.Group size="large">
            <Radio value="4090">4090</Radio>
            <Radio value="5090">5090</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="企业名称"
          name="companyName"
          rules={[{ required: true, message: '请输入企业名称' }]}
        >
          <Input
            prefix={<BankOutlined />}
            placeholder="请输入您的企业名称"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="姓名"
          name="customerName"
          rules={[{ required: true, message: '请输入联系人姓名' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入您的姓名"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="电话"
          name="contactPhone"
          rules={[
            { required: true, message: '请输入联系电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="请输入您的手机号码"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入正确的邮箱地址' }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="请输入您的邮箱"
            size="large"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InquiryDialog;
