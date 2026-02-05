import { useState } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Select, Input, message, Card, Statistic, Row, Col } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useInquiries } from '../../contexts/InquiryContext';
import type { Inquiry } from '../../types/inquiry';
import styles from './InquiryAdmin.module.css';

const { TextArea } = Input;
const { Option } = Select;

const InquiryAdmin = () => {
  const { inquiries, updateInquiry, deleteInquiry } = useInquiries();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  const statusConfig = {
    pending: { text: '待联系', color: 'orange', icon: <ClockCircleOutlined /> },
    contacted: { text: '已联系', color: 'blue', icon: <UserOutlined /> },
    negotiating: { text: '洽谈中', color: 'cyan', icon: <EditOutlined /> },
    closed: { text: '已成交', color: 'green', icon: <CheckCircleOutlined /> },
    cancelled: { text: '已取消', color: 'red', icon: <DeleteOutlined /> },
  };

  const priorityConfig = {
    low: { text: '低', color: 'default' },
    medium: { text: '中', color: 'blue' },
    high: { text: '高', color: 'red' },
  };

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    negotiating: inquiries.filter(i => i.status === 'negotiating').length,
    closed: inquiries.filter(i => i.status === 'closed').length,
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
      assignee: inquiry.assignee || '',
    });
    setEditModalVisible(true);
  };

  const handleDelete = (inquiry: Inquiry) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除来自 ${inquiry.customerName} 的咨询记录吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        deleteInquiry(inquiry.id);
        message.success('删除成功');
      },
    });
  };

  const handleUpdateSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      updateInquiry(selectedInquiry!.id, values);
      message.success('更新成功');
      setEditModalVisible(false);
      editForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
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
      key: 'interestedProducts',
      width: 200,
      render: (_: any, record: Inquiry) => (
        <div>
          {record.interestedProducts?.slice(0, 2).map((product, index) => (
            <Tag key={index} color="blue" style={{ fontSize: '12px', marginBottom: '4px', marginRight: '4px' }}>
              {product}
            </Tag>
          ))}
          {record.interestedProducts && record.interestedProducts.length > 2 && (
            <Tag color="blue" style={{ fontSize: '12px' }}>
              +{record.interestedProducts.length - 2}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: '意向规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 100,
      render: (value: string) => value || '-',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: keyof typeof priorityConfig) => (
        <Tag color={priorityConfig[priority].color}>{priorityConfig[priority].text}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: keyof typeof statusConfig) => (
        <Tag icon={statusConfig[status].icon} color={statusConfig[status].color}>
          {statusConfig[status].text}
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
      width: 200,
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
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
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
          <span style={{ fontSize: '14px', color: '#666' }}>
            共 {inquiries.length} 条记录
          </span>
        }
      >
        <Table
          columns={columns}
          dataSource={inquiries}
          rowKey="id"
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
                    icon={statusConfig[selectedInquiry.status].icon}
                    color={statusConfig[selectedInquiry.status].color}
                  >
                    {statusConfig[selectedInquiry.status].text}
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
              <Col span={24}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>意向产品：</span>
                  <div className={styles.detailValue}>
                    {selectedInquiry.interestedProducts?.map((product, index) => (
                      <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                        {product}
                      </Tag>
                    ))}
                  </div>
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
                  <Tag color={priorityConfig[selectedInquiry.priority].color}>
                    {priorityConfig[selectedInquiry.priority].text}
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
              {selectedInquiry.assignee && (
                <Col span={12}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>负责人：</span>
                    <span className={styles.detailValue}>{selectedInquiry.assignee}</span>
                  </div>
                </Col>
              )}
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
              <Option value="pending">待联系</Option>
              <Option value="contacted">已联系</Option>
              <Option value="negotiating">洽谈中</Option>
              <Option value="closed">已成交</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="优先级"
            name="priority"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select size="large">
              <Option value="low">低</Option>
              <Option value="medium">中</Option>
              <Option value="high">高</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="负责人"
            name="assignee"
          >
            <Input placeholder="请输入负责人姓名" size="large" />
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
