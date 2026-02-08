import { useState, useMemo } from 'react';
import { Modal, Form, Input, Checkbox, Radio, Button, message, Select, Row, Col } from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { inquiriesService } from '../../services/api/inquiries';
import {
  getCategoryFormConfig,
  getCategoryFromProductId,
  FormFieldConfig,
} from '../../config/inquiryFormConfig';

const { TextArea } = Input;
const { Option } = Select;

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

  // 根据产品类别获取表单配置
  const categoryConfig = useMemo(() => {
    const category = getCategoryFromProductId(product.id);
    return getCategoryFormConfig(category);
  }, [product.id]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 合并产品特定字段和通用字段
      const inquiryData = {
        productId: product.id,
        productName: product.name,
        productCategory: product.category,
        // 产品特定需求
        requirements: values,
        // 通用联系信息
        companyName: values.companyName,
        customerName: values.customerName,
        contactPhone: values.contactPhone,
        email: values.email,
        // 兼容旧字段
        interestedProducts: [product.name],
        specification: values.gpuModel || values.instanceType || values.applianceType || '标准配置',
      };

      // Call real API
      await inquiriesService.submitInquiry(inquiryData);

      message.success('咨询提交成功！我们会尽快联系您');
      form.resetFields();
      onClose();
    } catch (error: any) {
      console.error('Submit failed:', error);
      if (error.errorFields) {
        return; // Validation error
      }
      message.error(error.response?.data?.message || '提交失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  /**
   * 渲染表单字段
   */
  const renderFormField = (field: FormFieldConfig) => {
    const baseProps = {
      size: 'large' as const,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case 'text':
        return <Input {...baseProps} />;

      case 'textarea':
        return <TextArea rows={4} {...baseProps} />;

      case 'number':
        return <Input type="number" {...baseProps} />;

      case 'select':
        return (
          <Select {...baseProps} allowClear>
            {field.options?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.icon && <span style={{ marginRight: 8 }}>{option.icon}</span>}
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case 'radio':
        return (
          <Radio.Group size="large">
            <Row gutter={[16, 16]}>
              {field.options?.map((option) => (
                <Col key={option.value} span={field.options?.length && field.options.length > 4 ? 8 : 12}>
                  <Radio value={option.value}>{option.label}</Radio>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        );

      case 'checkbox':
        return (
          <Checkbox.Group style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              {field.options?.map((option) => (
                <Col key={option.value} span={field.options?.length && field.options.length > 4 ? 12 : 24}>
                  <Checkbox value={option.value}>
                    {option.icon && <span style={{ marginRight: 6 }}>{option.icon}</span>}
                    {option.label}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        );

      default:
        return <Input {...baseProps} />;
    }
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: '18px', fontWeight: 600 }}>
          <InfoCircleOutlined style={{ marginRight: 8, color: '#6366f1' }} />
          {categoryConfig.title} - {product.name}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} size="large">
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          size="large"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: 'none',
            fontWeight: 600,
          }}
        >
          提交咨询
        </Button>,
      ]}
      width={720}
      destroyOnClose
    >
      <div style={{ marginBottom: '16px', color: '#64748b', fontSize: '14px' }}>
        {categoryConfig.description}
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        style={{ marginTop: '24px' }}
      >
        {/* 产品特定字段 */}
        {categoryConfig.fields.map((field) => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={field.required ? [{ required: true, message: `请选择${field.label}` }] : undefined}
            initialValue={field.defaultValue}
          >
            {renderFormField(field)}
          </Form.Item>
        ))}

        {/* 通用联系信息字段 */}
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #f0f0f0',
        }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '20px',
          }}>
            联系信息
          </div>

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
            label="联系人姓名"
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
            label="联系电话"
            name="contactPhone"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="请输入您的手机号码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="电子邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入正确的邮箱地址' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="请输入您的邮箱"
              size="large"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default InquiryDialog;
