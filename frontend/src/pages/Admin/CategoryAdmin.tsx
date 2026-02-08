import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Space,
  message,
  Popconfirm,
  Image,
  Tag,
  Typography,
  Tooltip,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TagsOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  AppstoreOutlined,
  ReloadOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { categoriesService, Category } from '../../services/api/categories';
import { ConfigurableTable } from '../../components/ConfigurableTable';
import type { ColumnDef } from '../../types/table';
import styles from './CategoryAdmin.module.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

const CategoryAdmin = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  // Statistics
  const stats = {
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    inactive: categories.filter(c => !c.isActive).length,
    totalProducts: categories.reduce((sum, cat) => sum + (cat._count?.products || 0), 0),
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesService.getCategories();
      setCategories(data);
    } catch (error: any) {
      message.error('获取分类列表失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      id: category.id,
      name: category.name,
      nameEn: category.nameEn || '',
      description: category.description || '',
      iconUrl: category.iconUrl || '',
      displayOrder: category.displayOrder,
      isActive: category.isActive,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await categoriesService.deleteCategory(id);
      message.success('删除成功');
      fetchCategories();
    } catch (error: any) {
      message.error('删除失败: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingCategory) {
        await categoriesService.updateCategory(editingCategory.id, values);
        message.success('更新成功');
      } else {
        await categoriesService.createCategory(values);
        message.success('创建成功');
      }

      setModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error: any) {
      if (error.errorFields) {
        return; // Validation error
      }
      message.error('操作失败: ' + (error.response?.data?.message || error.message));
    }
  };

  const columnDefinitions: ColumnDef[] = [
    {
      title: '排序',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 70,
      render: (order: number) => (
        <Tag color="default" style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '6px' }}>
          {order}
        </Tag>
      ),
    },
    {
      title: '图标',
      dataIndex: 'iconUrl',
      key: 'iconUrl',
      width: 70,
      render: (url: string) => url ? (
        <Image
          src={url}
          width={40}
          height={40}
          style={{ borderRadius: '8px', objectFit: 'cover' }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJF9kT1Iw0AcxV9TpVUqDnYQ6ZChOlkQFXGUKhbBQmkrtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0DhHqZqWbHOKBqlpGMRcVMdlXxQKZ24Pv5NHypXB8kf49VIUqJ7xQkVVUvUqUopVdQpJVWUxUQVTFcqVapXVqpWqqVU9fVa1da1L1Vau1v1UwV6tYvVa/TbHWvW0MzbabLbLac1harWtf2nYbauNbfb3bXat23bft23jM3DbLM3zbTM7TbPd3gX+jIqjexqG1Ma4zgSOJcrxbqcy7KM7sb3bBM7jXOXU3j3O/5jLMd3oXO6e83zvO8jL8fz/P8/Pz//AAbYAXwAqAOoB7gIqAuoCxgLKAu4DCgMuAzoDZgOqA74D6gQGBGQE5AVUBdQGQgbqB1oHlggaCEIIdgh6CRIIugiRCSQJbgnmCgYKJgqGCsoLYgumC9YMIgxKDKIMyg0SDZINqg3qDhIOIg7SD4oQAhCSEJoQqhDaEQ4RmhGSEd4SVhJiEmYSahKOIo4ikSKVIp4ipSKrIrEivSLNIzUjYSNpI3kj3iQhJKEkYSUhLaEu4TzhPeFCIURJSFFIU4hWCFZYV5hZmFq4WvhcWF1IXlhfKF+IYIhhSGSIYphjiGaIZ4hoiGiIaohqiGqIbophiGyIboh0iHeIgIiEiIiIiIiJiIqIioiKiIqIi4iLyIwYjEiMyIzYjOyNBI0kjWSOJI4kjmSOBI5UjmSOxI74kAiRCJIIkgiSCJQIlQiVCJUIlQiVCJYIlYiWCJcImAieCJ8IoAihSKSIpIikSKRIpEikSKSopEikSKRIoEiDyIwEjISMhIyEjQiNCI0IjQiNiI2IjoiPCJBIkMikiSKRIpEikSKSIpIikSKRopEikSKSIpIikSKRIoIiCSCJQIkQikSKSIpIikSKRopIikSKSIpIikSKSIpIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiH"
        />
      ) : (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '8px',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FolderOutlined style={{ fontSize: '18px', color: '#bfbfbf' }} />
        </div>
      ),
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name: string) => (
        <Space>
          <TagsOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      ),
    },
    {
      title: '英文名',
      dataIndex: 'nameEn',
      key: 'nameEn',
      width: 140,
      ellipsis: true,
      render: (nameEn: string) => nameEn ? (
        <Text style={{ fontSize: '13px', color: '#595959' }}>{nameEn}</Text>
      ) : (
        <Text type="secondary">-</Text>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string) => desc ? (
        <Text style={{ fontSize: '13px', color: '#595959' }}>{desc}</Text>
      ) : (
        <Text type="secondary">-</Text>
      ),
    },
    {
      title: '产品数量',
      key: 'productCount',
      width: 100,
      render: (_: any, record: Category) => (
        <Tag
          icon={<AppstoreOutlined />}
          color="blue"
          style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '6px' }}
        >
          {record._count?.products || 0}
        </Tag>
      ),
    },
    {
      title: '状态',
      key: 'isActive',
      width: 90,
      render: (_: any, record: Category) => (
        <Tag
          icon={record.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={record.isActive ? 'success' : 'default'}
          style={{
            fontSize: '12px',
            padding: '3px 10px',
            borderRadius: '12px',
            fontWeight: 500,
          }}
        >
          {record.isActive ? '已启用' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_: any, record: Category) => (
        <Space size="small">
          <Tooltip title="编辑分类">
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
          <Popconfirm
            title="确认删除"
            description={`确定要删除分类"${record.name}"吗？${
              (record._count?.products || 0) > 0 ? '\n该分类下还有产品，无法删除。' : ''
            }`}
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            disabled={(record._count?.products || 0) > 0}
          >
            <Tooltip title={record._count?.products ? '该分类下还有产品' : '删除分类'}>
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                disabled={(record._count?.products || 0) > 0}
                className={styles.actionButton}
              >
                删除
              </Button>
            </Tooltip>
          </Popconfirm>
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
            分类管理
          </Title>
          <Text type="secondary">管理产品分类和组织结构</Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchCategories}
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
            新建分类
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6} xl={6}>
          <StatCard
            title="总分类"
            value={stats.total}
            icon={<TagsOutlined />}
            color="#1890ff"
            bgColor="#e6f7ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6} xl={6}>
          <StatCard
            title="已启用"
            value={stats.active}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            bgColor="#f6ffed"
          />
        </Col>
        <Col xs={24} sm={12} lg={6} xl={6}>
          <StatCard
            title="已禁用"
            value={stats.inactive}
            icon={<CloseCircleOutlined />}
            color="#8c8c8c"
            bgColor="#f5f5f5"
          />
        </Col>
        <Col xs={24} sm={12} lg={6} xl={6}>
          <StatCard
            title="总产品数"
            value={stats.totalProducts}
            icon={<AppstoreOutlined />}
            color="#722ed1"
            bgColor="#f9f0ff"
          />
        </Col>
      </Row>

      {/* Table */}
      <div className={styles.tableCard}>
        <ConfigurableTable
          tableKey="category-admin"
          columns={columnDefinitions}
          dataSource={categories}
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
            <TagsOutlined style={{ color: '#1890ff' }} />
            <span>{editingCategory ? '编辑分类' : '新建分类'}</span>
          </Space>
        }
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item
            name="id"
            label="分类ID"
            rules={[{ required: true, message: '请输入分类ID' }]}
            tooltip="唯一标识，如: gpu-bare-metal"
          >
            <Input
              placeholder="请输入分类ID（英文，如: gpu-bare-metal）"
              disabled={!!editingCategory}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称（中文）" />
          </Form.Item>

          <Form.Item name="nameEn" label="英文名称">
            <Input placeholder="请输入英文名称" />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <TextArea rows={3} placeholder="请输入分类描述" />
          </Form.Item>

          <Form.Item name="iconUrl" label="图标URL">
            <Input placeholder="请输入图标URL" />
          </Form.Item>

          <Form.Item
            name="displayOrder"
            label="排序"
            initialValue={0}
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <Input type="number" placeholder="数字越小越靠前" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="是否启用"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryAdmin;
