import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Space,
  message,
  Tag,
  Popconfirm,
  Image,
  Tabs,
  Row,
  Col,
  Typography,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TagsOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { productsService, CreateProductRequest, UpdateProductRequest } from '../../services/api/products';
import { categoriesService, Category } from '../../services/api/categories';
import { ConfigurableTable } from '../../components/ConfigurableTable';
import type { ColumnDef } from '../../types/table';
import ImageUpload from '../../components/ImageUpload';
import styles from './ProductAdmin.module.css';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

interface Product {
  id: string;
  categoryId: string;
  name: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  priceDisplay?: string;
  source?: string;
  region?: string;
  tags: string[];
  isActive: boolean;
  category?: Category;
}

const ProductAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // Statistics
  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    categories: categories.length,
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
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productsService.getProducts();
      setProducts(data as Product[]);
    } catch (error: any) {
      message.error('获取产品列表失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoriesService.getCategories();
      setCategories(data.filter((c) => c.isActive));
    } catch (error: any) {
      message.error('获取分类列表失败');
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    form.setFieldsValue({
      tags: [],
      specifications: [],
      pricing: [],
      features: [],
      useCases: [],
      isActive: true,
    });
    setModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      ...product,
      features: product.tags || [], // Using tags as features for now
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await productsService.deleteProduct(id);
      message.success('删除成功');
      fetchProducts();
    } catch (error: any) {
      message.error('删除失败: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const productData = {
        ...values,
        features: values.tags || [],
        specifications: values.specifications || [],
        pricing: values.pricing || [],
        useCases: values.useCases || [],
      };

      if (editingProduct) {
        await productsService.updateProduct(editingProduct.id, productData as UpdateProductRequest);
        message.success('更新成功');
      } else {
        await productsService.createProduct(productData as CreateProductRequest);
        message.success('创建成功');
      }

      setModalVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error('操作失败: ' + (error.response?.data?.message || error.message));
    }
  };

  const columnDefinitions: ColumnDef[] = [
    {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 70,
      render: (url: string) => url ? (
        <Image
          src={url}
          width={45}
          height={45}
          style={{ borderRadius: '8px', objectFit: 'cover' }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJF9kT1Iw0AcxV9TpVUqDnYQ6ZChOlkQFXGUKhbBQmkrtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0DhHqZqWbHOKBqlpGMRcVMdlXxQKZ24Pv5NHypXB8kf49VIUqJ7xQkVVUvUqUopVdQpJVWUxUQVTFcqVapXVqpWqqVU9fVa1da1L1Vau1v1UwV6tYvVa/TbHWvW0MzbabLbLac1harWtf2nYbauNbfb3bXat23bft23jM3DbLM3zbTM7TbPd3gX+jIqjexqG1Ma4zgSOJcrxbqcy7KM7sb3bBM7jXOXU3j3O/5jLMd3oXO6e83zvO8jL8fz/P8/Pz//AAbYAXwAqAOoB7gIqAuoCxgLKAu4DCgMuAzoDZgOqA74D6gQGBGQE5AVUBdQGQgbqB1oHlggaCEIIdgh6CRIIugiRCSQJbgnmCgYKJgqGCsoLYgumC9YMIgxKDKIMyg0SDZINqg3qDhIOIg7SD4oQAhCSEJoQqhDaEQ4RmhGSEd4SVhJiEmYSahKOIo4ikSKVIp4ipSKrIrEivSLNIzUjYSNpI3kj3iQhJKEkYSUhLaEu4TzhPeFCIURJSFFIU4hWCFZYV5hZmFq4WvhcWF1IXlhfKF+IYIhhSGSIYphjiGaIZ4hoiGiIaohqiGqIbophiGyIboh0iHeIgIiEiIiIiIiJiIqIioiKiIqIi4iLyIwYjEiMyIzYjOyNBI0kjWSOJI4kjmSOBI5UjmSOxI74kAiRCJIIkgiSCJQIlQiVCJUIlQiVCJYIlYiWCJcImAieCJ8IoAihSKSIpIikSKRIpEikSKSopEikSKRIoEiDyIwEjISMhIyEjQiNCI0IjQiNiI2IjoiPCJBIkMikiSKRIpEikSKSIpIikSKRopEikSKSIpIikSKRIoIiCSCJQIkQikSKSIpIikSKRopIikSKSIpIikSKSIpIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiEiISIhIiH"
        />
      ) : (
        <div
          style={{
            width: 45,
            height: 45,
            borderRadius: '8px',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppstoreOutlined style={{ fontSize: '20px', color: '#bfbfbf' }} />
        </div>
      ),
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      ellipsis: true,
      render: (name: string) => (
        <Space>
          <AppstoreOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 140,
      ellipsis: true,
      render: (title: string) => title || <Text type="secondary">-</Text>,
    },
    {
      title: '分类',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 110,
      ellipsis: true,
      render: (name: string) => (
        <Tag color="cyan" style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '6px' }}>
          {name}
        </Tag>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      ellipsis: true,
      render: (tags: string[]) => (
        <>
          {tags?.slice(0, 2).map((tag) => (
            <Tag key={tag} color="blue" style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
              {tag}
            </Tag>
          ))}
          {tags?.length > 2 && (
            <Tag color="default" style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
              +{tags.length - 2}
            </Tag>
          )}
        </>
      ),
    },
    {
      title: '价格',
      dataIndex: 'priceDisplay',
      key: 'priceDisplay',
      width: 100,
      render: (price: string) => (
        <Text style={{ fontSize: '13px', color: '#595959' }}>{price || '-'}</Text>
      ),
    },
    {
      title: '状态',
      key: 'isActive',
      width: 90,
      render: (_: any, record: Product) => (
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
          {record.isActive ? '已上架' : '已下架'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 130,
      fixed: 'right',
      render: (_: any, record: Product) => (
        <Space size="small">
          <Tooltip title="编辑产品">
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
            description={`确定要删除产品"${record.name}"吗？`}
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
          >
            <Tooltip title="删除产品">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
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
            产品管理
          </Title>
          <Text type="secondary">管理所有算力产品和相关信息</Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchProducts}
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
            新建产品
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6} xl={6}>
          <StatCard
            title="总产品"
            value={stats.total}
            icon={<AppstoreOutlined />}
            color="#1890ff"
            bgColor="#e6f7ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6} xl={6}>
          <StatCard
            title="已上架"
            value={stats.active}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            bgColor="#f6ffed"
          />
        </Col>
        <Col xs={24} sm={12} lg={6} xl={6}>
          <StatCard
            title="已下架"
            value={stats.inactive}
            icon={<CloseCircleOutlined />}
            color="#8c8c8c"
            bgColor="#f5f5f5"
          />
        </Col>
        <Col xs={24} sm={12} lg={6} xl={6}>
          <StatCard
            title="分类数"
            value={stats.categories}
            icon={<TagsOutlined />}
            color="#722ed1"
            bgColor="#f9f0ff"
          />
        </Col>
      </Row>

      {/* Table */}
      <div className={styles.tableCard}>
        <ConfigurableTable
          tableKey="product-admin"
          columns={columnDefinitions}
          dataSource={products}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      <Modal
        title={
          <Space>
            <AppstoreOutlined style={{ color: '#1890ff' }} />
            <span>{editingProduct ? '编辑产品' : '新建产品'}</span>
          </Space>
        }
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={900}
        okText="确定"
        cancelText="取消"
      >
        <Tabs
          defaultActiveKey="basic"
          items={[
            {
              key: 'basic',
              label: '基本信息',
              children: (
                <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
                  <Form.Item
                    name="id"
                    label="产品ID"
                    rules={[{ required: true, message: '请输入产品ID' }]}
                  >
                    <Input placeholder="产品唯一标识" disabled={!!editingProduct} />
                  </Form.Item>

                  <Form.Item
                    name="categoryId"
                    label="分类"
                    rules={[{ required: true, message: '请选择分类' }]}
                  >
                    <Select placeholder="请选择分类">
                      {categories.map((cat) => (
                        <Option key={cat.id} value={cat.id}>
                          {cat.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="name"
                    label="产品名称"
                    rules={[{ required: true, message: '请输入产品名称' }]}
                  >
                    <Input placeholder="请输入产品名称" />
                  </Form.Item>

                  <Form.Item name="title" label="标题">
                    <Input placeholder="请输入标题" />
                  </Form.Item>

                  <Form.Item name="subtitle" label="副标题">
                    <Input placeholder="请输入副标题" />
                  </Form.Item>

                  <Form.Item name="description" label="描述">
                    <TextArea rows={3} placeholder="请输入产品描述" />
                  </Form.Item>

                  <Form.Item name="imageUrl" label="产品图片">
                    <ImageUpload />
                  </Form.Item>

                  <Form.Item name="priceDisplay" label="价格展示">
                    <Input placeholder="如: ¥999/月起" />
                  </Form.Item>

                  <Form.Item name="source" label="来源">
                    <Input placeholder="如: NVIDIA" />
                  </Form.Item>

                  <Form.Item name="region" label="地区">
                    <Input placeholder="如: 华东" />
                  </Form.Item>

                  <Form.Item name="tags" label="标签">
                    <Select mode="tags" placeholder="请输入标签，按回车添加" />
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
              ),
            },
            {
              key: 'advanced',
              label: '高级信息',
              children: (
                <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
                  <Form.Item name="cpuMemoryRatio" label="CPU内存配比">
                    <Input placeholder="如: 1:4" />
                  </Form.Item>

                  <Form.Item name="vcpuRange" label="vCPU范围">
                    <Input placeholder="如: 1-32核" />
                  </Form.Item>

                  <Form.Item name="baseFreq" label="基础频率">
                    <Input placeholder="如: 3.0 GHz" />
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default ProductAdmin;
