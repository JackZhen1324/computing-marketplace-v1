import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Space,
  message,
  Card,
  Tag,
  Popconfirm,
  Image,
  Tabs,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { productsService, CreateProductRequest, UpdateProductRequest } from '../../services/api/products';
import { categoriesService, Category } from '../../services/api/categories';
import ImageUpload from '../../components/ImageUpload';

const { TextArea } = Input;
const { Option } = Select;

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
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (url: string) => url ? <Image src={url} width={50} height={50} style={{ borderRadius: '4px' }} /> : '-',
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 150,
      ellipsis: true,
      render: (title: string) => title || '-',
    },
    {
      title: '分类',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 120,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <>
          {tags?.map((tag) => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: '价格',
      dataIndex: 'priceDisplay',
      key: 'priceDisplay',
      width: 120,
      render: (price: string) => price || '-',
    },
    {
      title: '状态',
      key: 'isActive',
      width: 80,
      render: (_: any, record: Product) => (
        <Switch checked={record.isActive} checkedChildren="上架" unCheckedChildren="下架" disabled />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除产品"${record.name}"吗？`}
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="产品管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建产品
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title={editingProduct ? '编辑产品' : '新建产品'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={800}
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
