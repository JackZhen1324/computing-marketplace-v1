import { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Switch, Space, message, Row, Col, Typography, Tag, Tooltip } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  StopOutlined,
  BulbOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { solutionsService, SolutionWithBenefits, CreateSolutionRequest, UpdateSolutionRequest } from '../../services/api/solutions';
import { ConfigurableTable } from '../../components/ConfigurableTable';
import type { ColumnDef } from '../../types/table';
import styles from './SolutionAdmin.module.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

const SolutionAdmin = () => {
  const [solutions, setSolutions] = useState<SolutionWithBenefits[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSolution, setEditingSolution] = useState<SolutionWithBenefits | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const data = await solutionsService.getSolutions();
      setSolutions(data);
    } catch (error: any) {
      message.error('获取解决方案列表失败');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: solutions.length,
    active: solutions.filter(s => s.isActive).length,
    inactive: solutions.filter(s => !s.isActive).length,
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

  const handleAdd = () => {
    setEditingSolution(null);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      highlights: [],
    });
    setModalVisible(true);
  };

  const handleEdit = (item: SolutionWithBenefits) => {
    setEditingSolution(item);
    form.setFieldsValue({
      ...item,
      highlights: item.highlights || [],
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await solutionsService.deleteSolution(id);
      message.success('删除成功');
      fetchSolutions();
    } catch (error: any) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const solutionData = {
        ...values,
        highlights: values.highlights || [],
        features: values.features || {},
      };

      if (editingSolution) {
        await solutionsService.updateSolution(editingSolution.id, solutionData as UpdateSolutionRequest);
        message.success('更新成功');
      } else {
        await solutionsService.createSolution(solutionData as CreateSolutionRequest);
        message.success('创建成功');
      }

      setModalVisible(false);
      form.resetFields();
      fetchSolutions();
    } catch (error: any) {
      if (error.errorFields) return;
      message.error('操作失败');
    }
  };

  const columnDefinitions: ColumnDef[] = [
    {
      title: '解决方案',
      key: 'solution',
      width: 300,
      render: (_: any, record: SolutionWithBenefits) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: '4px', fontSize: '14px' }}>
            <FileTextOutlined style={{ fontSize: '13px', marginRight: '6px', color: '#1890ff' }} />
            {record.title}
          </div>
          {record.subtitle && (
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '20px' }}>
              {record.subtitle}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '亮点',
      dataIndex: 'highlights',
      key: 'highlights',
      width: 300,
      ellipsis: true,
      render: (highlights: string[]) => (
        <Space size={4} wrap>
          {highlights?.slice(0, 2).map((highlight, index) => (
            <Tag
              key={index}
              icon={<BulbOutlined />}
              color="blue"
              style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '6px', marginBottom: '4px' }}
            >
              {highlight}
            </Tag>
          ))}
          {highlights?.length > 2 && (
            <Tag style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '6px' }}>
              +{highlights.length - 2}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (active: boolean) => (
        <Tag
          icon={active ? <CheckCircleOutlined /> : <StopOutlined />}
          color={active ? 'success' : 'default'}
          style={{
            fontSize: '12px',
            padding: '4px 12px',
            borderRadius: '12px',
            fontWeight: 500,
            background: active ? '#f6ffed' : '#f5f5f5',
            border: 'none',
          }}
        >
          {active ? '已启用' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      ellipsis: true,
      render: (description: string) => (
        <Text style={{ fontSize: '13px', color: '#595959' }} ellipsis={{ tooltip: description }}>
          {description || '-'}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_: any, record: SolutionWithBenefits) => (
        <Space size="small">
          <Tooltip title="编辑">
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
          <Tooltip title="删除">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              className={styles.actionButton}
            >
              删除
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
            解决方案管理
          </Title>
          <Text type="secondary">管理所有企业解决方案和配置信息</Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchSolutions}
            loading={loading}
            className={styles.refreshButton}
          >
            刷新
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className={styles.addButton}
          >
            新建解决方案
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="总解决方案"
            value={stats.total}
            icon={<FileTextOutlined />}
            color="#1890ff"
            bgColor="#e6f7ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="已启用"
            value={stats.active}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            bgColor="#f6ffed"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="已禁用"
            value={stats.inactive}
            icon={<StopOutlined />}
            color="#8c8c8c"
            bgColor="#f5f5f5"
          />
        </Col>
      </Row>

      {/* Table */}
      <div className={styles.tableCard}>
        <ConfigurableTable
          tableKey="solution-admin"
          columns={columnDefinitions}
          dataSource={solutions}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      {/* Modal */}
      <Modal
        title={
          <Space>
            {editingSolution ? <EditOutlined style={{ color: '#1890ff' }} /> : <PlusOutlined style={{ color: '#1890ff' }} />}
            <span>{editingSolution ? '编辑解决方案' : '新建解决方案'}</span>
          </Space>
        }
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText="保存"
        cancelText="取消"
        width={700}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="id" label="解决方案ID" rules={[{ required: true, message: '请输入解决方案ID' }]}>
                <Input placeholder="例如: ai-training" disabled={!!editingSolution} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="状态"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="title" label="解决方案标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="例如: AI训练解决方案" size="large" />
          </Form.Item>

          <Form.Item name="subtitle" label="副标题">
            <Input placeholder="简短的描述性副标题" size="large" />
          </Form.Item>

          <Form.Item name="description" label="详细描述">
            <TextArea
              rows={3}
              placeholder="请输入解决方案的详细描述"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item name="highlights" label="核心亮点（每行一个）">
            <TextArea
              rows={4}
              placeholder="每行输入一个核心亮点&#10;例如:&#10;高性能计算集群&#10;弹性扩展能力&#10;专业运维支持"
            />
          </Form.Item>

          <Form.Item name="architecture" label="架构说明">
            <TextArea
              rows={3}
              placeholder="请输入架构说明"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item name="imageUrl" label="封面图片URL">
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SolutionAdmin;
