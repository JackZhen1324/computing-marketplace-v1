import { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Select, Input, message, Card, Statistic, Row, Col } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { inquiriesService } from '../../services/api/inquiries';
import type { Inquiry } from '../../types/inquiry';
import styles from './InquiryAdmin.module.css';

const { TextArea } = Input;
const { Option } = Select;

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
    PENDING: { text: '待联系', color: 'orange', icon: <ClockCircleOutlined /> },
    CONTACTED: { text: '已联系', color: 'blue', icon: <UserOutlined /> },
    NEGOTIATING: { text: '洽谈中', color: 'cyan', icon: <EditOutlined /> },
    CLOSED: { text: '已成交', color: 'green', icon: <CheckCircleOutlined /> },
    CANCELLED: { text: '已取消', color: 'red', icon: <DeleteOutlined /> },
  };

  const priorityConfig = {
    LOW: { text: '低', color: 'default' },
    MEDIUM: { text: '中', color: 'blue' },
    HIGH: { text: '高', color: 'red' },
  };

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'PENDING').length,
    contacted: inquiries.filter(i => i.status === 'CONTACTED').length,
    negotiating: inquiries.filter(i => i.status === 'NEGOTIATING').length,
    closed: inquiries.filter(i => i.status === 'CLOSED').length,
  };

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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      render: (id: string) => (
        <span style={{ fontSize: '12px', color: '#666' }}>{id}</span>
      ),
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 150,
    },
    {
      title: '联系人',
      key: 'customer',
      width: 150,
      render: (_: any, record: Inquiry) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>{record.customerName}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>{record.contactPhone}</div>
        </div>
      ),
    },
    {
      title: '意向产品',
      key: 'productName',
      width: 200,
      render: (_: any, record: Inquiry) => (
        <div>
          <Tag color="blue" style={{ fontSize: '12px' }}>
            {record.productName}
          </Tag>
        </div>
      ),
    },
    {
      title: '意向规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 150,
      render: (value: string) => value || '-',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: keyof typeof priorityConfig) => (
        <Tag color={priorityConfig[priority]?.color || 'default'}>
          {priorityConfig[priority]?.text || priority}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: keyof typeof statusConfig) => (
        <Tag icon={statusConfig[status]?.icon} color={statusConfig[status]?.color || 'default'}>
          {statusConfig[status]?.text || status}
        </Tag>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: Inquiry) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      {/* Statistics Cards */}
      <Row gutter={24} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总咨询数"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待联系"
              value={stats.pending}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="洽谈中"
              value={stats.negotiating}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已成交"
              value={stats.closed}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card
        title="咨询记录列表"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchInquiries}
            loading={loading}
          >
            刷新
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={inquiries}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="咨询详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedInquiry && (
          <div className={styles.detailContent}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>咨询ID：</span>
                  <span className={styles.detailValue}>{selectedInquiry.id}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>状态：</span>
                  <Tag
                    icon={statusConfig[selectedInquiry.status as keyof typeof statusConfig]?.icon}
                    color={statusConfig[selectedInquiry.status as keyof typeof statusConfig]?.color}
                  >
                    {statusConfig[selectedInquiry.status as keyof typeof statusConfig]?.text || selectedInquiry.status}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>企业名称：</span>
                  <span className={styles.detailValue}>{selectedInquiry.companyName}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>客户姓名：</span>
                  <span className={styles.detailValue}>{selectedInquiry.customerName}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>联系电话：</span>
                  <span className={styles.detailValue}>{selectedInquiry.contactPhone}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>电子邮箱：</span>
                  <span className={styles.detailValue}>{selectedInquiry.email}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>产品名称：</span>
                  <span className={styles.detailValue}>{selectedInquiry.productName}</span>
                </div>
              </Col>
              {selectedInquiry.specification && (
                <Col span={12}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>意向规格：</span>
                    <span className={styles.detailValue}>{selectedInquiry.specification}</span>
                  </div>
                </Col>
              )}
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>优先级：</span>
                  <Tag color={priorityConfig[selectedInquiry.priority as keyof typeof priorityConfig]?.color || 'default'}>
                    {priorityConfig[selectedInquiry.priority as keyof typeof priorityConfig]?.text || selectedInquiry.priority}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>提交时间：</span>
                  <span className={styles.detailValue}>
                    {new Date(selectedInquiry.createdAt).toLocaleString('zh-CN')}
                  </span>
                </div>
              </Col>
              {selectedInquiry.notes && (
                <Col span={24}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>内部备注：</span>
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
        title="更新咨询状态"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleUpdateSubmit}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
            }}
          >
            保存
          </Button>,
        ]}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          style={{ marginTop: '24px' }}
        >
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select size="large">
              <Option value="PENDING">待联系</Option>
              <Option value="CONTACTED">已联系</Option>
              <Option value="NEGOTIATING">洽谈中</Option>
              <Option value="CLOSED">已成交</Option>
              <Option value="CANCELLED">已取消</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="优先级"
            name="priority"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select size="large">
              <Option value="LOW">低</Option>
              <Option value="MEDIUM">中</Option>
              <Option value="HIGH">高</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="内部备注"
            name="notes"
          >
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
