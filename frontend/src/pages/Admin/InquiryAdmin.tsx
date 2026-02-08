import { useState, useEffect } from 'react';
import { Tag, Button, Space, Modal, Form, Select, Input, message, Row, Col, Typography, Tooltip } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ReloadOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { inquiriesService } from '../../services/api/inquiries';
import type { Inquiry } from '../../services/types/api';
import { ConfigurableTable } from '../../components/ConfigurableTable';
import type { ColumnDef } from '../../types/table';
import styles from './InquiryAdmin.module.css';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const InquiryAdmin = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await inquiriesService.getInquiries();
      setInquiries(data);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
      message.error('获取询价列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const statusConfig = {
    PENDING: { text: '待联系', color: 'warning', icon: <ClockCircleOutlined />, bgColor: '#fff7e6' },
    CONTACTED: { text: '已联系', color: 'processing', icon: <UserOutlined />, bgColor: '#e6f7ff' },
    NEGOTIATING: { text: '洽谈中', color: 'cyan', icon: <EditOutlined />, bgColor: '#e6fffb' },
    CLOSED: { text: '已成交', color: 'success', icon: <CheckCircleOutlined />, bgColor: '#f6ffed' },
    CANCELLED: { text: '已取消', color: 'error', icon: <EditOutlined />, bgColor: '#fff1f0' },
  };

  const priorityConfig = {
    LOW: { text: '低', color: 'default', bgColor: '#f5f5f5' },
    MEDIUM: { text: '中', color: 'blue', bgColor: '#e6f7ff' },
    HIGH: { text: '高', color: 'red', bgColor: '#fff1f0' },
  };

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'PENDING').length,
    contacted: inquiries.filter(i => i.status === 'CONTACTED').length,
    negotiating: inquiries.filter(i => i.status === 'NEGOTIATING').length,
    closed: inquiries.filter(i => i.status === 'CLOSED').length,
  };

  const StatCard = ({ title, value, icon, color, bgColor }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }) => (
    <div className={styles.statCard} style={{ background: bgColor, borderColor: color }}>
      <div className={styles.statIcon} style={{ color, background: bgColor }}>
        {icon}
      </div>
      <div className={styles.statContent}>
        <Text className={styles.statTitle}>{title}</Text>
        <Title level={3} className={styles.statValue} style={{ color, margin: 0 }}>
          {value}
        </Title>
      </div>
    </div>
  );

  const handleViewDetail = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setDetailModalVisible(true);
  };

  const handleEdit = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    editForm.setFieldsValue({
      status: inquiry.status,
      priority: inquiry.priority,
      notes: inquiry.notes || '',
    });
    setEditModalVisible(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      await inquiriesService.updateInquiry(selectedInquiry!.id, values);
      message.success('更新成功');
      setEditModalVisible(false);
      editForm.resetFields();
      fetchInquiries();
    } catch (error) {
      console.error('Update failed:', error);
      message.error('更新失败');
    }
  };

  const columnDefinitions: ColumnDef[] = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 180,
      ellipsis: true,
      render: (name: string) => (
        <Space>
          <TeamOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      ),
    },
    {
      title: '联系人',
      key: 'customer',
      width: 200,
      render: (_: any, record: Inquiry) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>
            <UserOutlined style={{ fontSize: '12px', marginRight: '4px', color: '#8c8c8c' }} />
            {record.customerName}
          </div>
          <div style={{ fontSize: '13px', color: '#8c8c8c', marginLeft: '18px' }}>
            <PhoneOutlined style={{ fontSize: '12px', marginRight: '4px' }} />
            {record.contactPhone}
          </div>
        </div>
      ),
    },
    {
      title: '意向产品',
      key: 'productName',
      width: 160,
      ellipsis: true,
      render: (_: any, record: Inquiry) => (
        <Tag
          icon={<FileTextOutlined />}
          color="blue"
          style={{ fontSize: '13px', padding: '4px 10px', borderRadius: '6px' }}
        >
          {record.productName}
        </Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 90,
      render: (priority: keyof typeof priorityConfig) => (
        <Tag
          color={priorityConfig[priority]?.color || 'default'}
          style={{
            fontSize: '12px',
            padding: '2px 10px',
            borderRadius: '12px',
            fontWeight: 500,
          }}
        >
          {priorityConfig[priority]?.text || priority}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: keyof typeof statusConfig) => {
        const config = statusConfig[status];
        return (
          <Tag
            icon={config?.icon}
            color={config?.color}
            style={{
              fontSize: '12px',
              padding: '4px 12px',
              borderRadius: '12px',
              fontWeight: 500,
              background: config?.bgColor,
              border: 'none',
            }}
          >
            {config?.text || status}
          </Tag>
        );
      },
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => (
        <Text style={{ fontSize: '13px', color: '#595959' }}>
          {new Date(date).toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_: any, record: Inquiry) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
              className={styles.actionButton}
            >
              详情
            </Button>
          </Tooltip>
          <Tooltip title="编辑状态">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className={styles.actionButton}
            >
              编辑
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <Title level={4} style={{ margin: 0 }}>
            询价管理
          </Title>
          <Text type="secondary">管理所有客户询价记录和跟进状态</Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchInquiries}
          loading={loading}
          className={styles.refreshButton}
        >
          刷新
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6} xl={4.8}>
          <StatCard
            title="总咨询"
            value={stats.total}
            icon={<TeamOutlined />}
            color="#1890ff"
            bgColor="#e6f7ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6} xl={4.8}>
          <StatCard
            title="待联系"
            value={stats.pending}
            icon={<ClockCircleOutlined />}
            color="#faad14"
            bgColor="#fff7e6"
          />
        </Col>
        <Col xs={24} sm={12} lg={6} xl={4.8}>
          <StatCard
            title="已联系"
            value={stats.contacted}
            icon={<UserOutlined />}
            color="#13c2c2"
            bgColor="#e6fffb"
          />
        </Col>
        <Col xs={24} sm={12} lg={6} xl={4.8}>
          <StatCard
            title="洽谈中"
            value={stats.negotiating}
            icon={<EditOutlined />}
            color="#722ed1"
            bgColor="#f9f0ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6} xl={4.8}>
          <StatCard
            title="已成交"
            value={stats.closed}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            bgColor="#f6ffed"
          />
        </Col>
      </Row>

      {/* Table */}
      <div className={styles.tableCard}>
        <ConfigurableTable
          tableKey="inquiry-admin"
          columns={columnDefinitions}
          dataSource={inquiries}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <TeamOutlined style={{ color: '#1890ff' }} />
            <span>咨询详情</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {selectedInquiry && (
          <div className={styles.detailContent}>
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>咨询ID</span>
                  <Text copyable className={styles.detailValue}>
                    {selectedInquiry.id.slice(0, 16)}...
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>状态</span>
                  <Tag
                    icon={statusConfig[selectedInquiry.status as keyof typeof statusConfig]?.icon}
                    color={statusConfig[selectedInquiry.status as keyof typeof statusConfig]?.color}
                    style={{
                      background: statusConfig[selectedInquiry.status as keyof typeof statusConfig]?.bgColor,
                      border: 'none',
                      padding: '4px 12px',
                    }}
                  >
                    {statusConfig[selectedInquiry.status as keyof typeof statusConfig]?.text || selectedInquiry.status}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>
                    <TeamOutlined /> 企业名称
                  </span>
                  <Text strong className={styles.detailValue}>
                    {selectedInquiry.companyName}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>
                    <UserOutlined /> 联系人
                  </span>
                  <Text className={styles.detailValue}>{selectedInquiry.customerName}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>
                    <PhoneOutlined /> 联系电话
                  </span>
                  <Text className={styles.detailValue}>
                    <a href={`tel:${selectedInquiry.contactPhone}`} style={{ color: '#1890ff' }}>
                      {selectedInquiry.contactPhone}
                    </a>
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>
                    <MailOutlined /> 电子邮箱
                  </span>
                  <Text className={styles.detailValue}>
                    <a href={`mailto:${selectedInquiry.email}`} style={{ color: '#1890ff' }}>
                      {selectedInquiry.email}
                    </a>
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>
                    <FileTextOutlined /> 产品名称
                  </span>
                  <Text className={styles.detailValue}>{selectedInquiry.productName}</Text>
                </div>
              </Col>
              {selectedInquiry.specification && (
                <Col span={12}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>意向规格</span>
                    <Text className={styles.detailValue}>{selectedInquiry.specification}</Text>
                  </div>
                </Col>
              )}
              <Col span={12}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>优先级</span>
                  <Tag
                    color={priorityConfig[selectedInquiry.priority as keyof typeof priorityConfig]?.color || 'default'}
                    style={{
                      background: priorityConfig[selectedInquiry.priority as keyof typeof priorityConfig]?.bgColor,
                      border: 'none',
                      padding: '4px 12px',
                      fontWeight: 500,
                    }}
                  >
                    {priorityConfig[selectedInquiry.priority as keyof typeof priorityConfig]?.text || selectedInquiry.priority}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>提交时间</span>
                  <Text className={styles.detailValue}>
                    {new Date(selectedInquiry.createdAt).toLocaleString('zh-CN')}
                  </Text>
                </div>
              </Col>
              {selectedInquiry.notes && (
                <Col span={24}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>内部备注</span>
                    <div className={styles.detailValue}>{selectedInquiry.notes}</div>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined style={{ color: '#1890ff' }} />
            <span>更新咨询状态</span>
          </Space>
        }
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateSubmit}>
            保存更改
          </Button>,
        ]}
        width={500}
      >
        <Form form={editForm} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
            <Select size="large" placeholder="请选择状态">
              {Object.entries(statusConfig).map(([key, config]) => (
                <Option key={key} value={key}>
                  <Space>
                    {config.icon}
                    {config.text}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="优先级" name="priority" rules={[{ required: true, message: '请选择优先级' }]}>
            <Select size="large" placeholder="请选择优先级">
              {Object.entries(priorityConfig).map(([key, config]) => (
                <Option key={key} value={key}>
                  <Tag color={config.color} style={{ margin: 0 }}>
                    {config.text}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="内部备注" name="notes">
            <TextArea
              rows={4}
              placeholder="请输入内部备注信息"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InquiryAdmin;
