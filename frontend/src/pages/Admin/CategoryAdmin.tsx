import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, message, Card, Popconfirm, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { categoriesService, Category } from '../../services/api/categories';

const CategoryAdmin = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

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

  const handleToggleStatus = async (id: string) => {
    try {
      await categoriesService.toggleCategoryStatus(id);
      message.success('状态更新成功');
      fetchCategories();
    } catch (error: any) {
      message.error('状态更新失败: ' + (error.response?.data?.message || error.message));
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

  const columns = [
    {
      title: '排序',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 80,
    },
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
      title: '图标',
      dataIndex: 'iconUrl',
      key: 'iconUrl',
      width: 80,
      render: (url: string) => url ? <Image src={url} width={40} height={40} style={{ borderRadius: '8px' }} /> : '-',
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '英文名',
      dataIndex: 'nameEn',
      key: 'nameEn',
      width: 150,
      render: (nameEn: string) => nameEn || '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string) => desc || '-',
    },
    {
      title: '产品数量',
      key: 'productCount',
      width: 100,
      render: (_: any, record: Category) => record._count?.products || 0,
    },
    {
      title: '状态',
      key: 'isActive',
      width: 100,
      render: (_: any, record: Category) => (
        <Switch
          checked={record.isActive}
          onChange={() => handleToggleStatus(record.id)}
          checkedChildren="显示"
          unCheckedChildren="隐藏"
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: Category) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除分类"${record.name}"吗？`}
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            disabled={record._count?.products > 0}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={record._count?.products > 0}
            >
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
        title="分类管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建分类
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingCategory ? '编辑分类' : '新建分类'}
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
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '24px' }}
        >
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

          <Form.Item
            name="nameEn"
            label="英文名称"
          >
            <Input placeholder="请输入英文名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} placeholder="请输入分类描述" />
          </Form.Item>

          <Form.Item
            name="iconUrl"
            label="图标URL"
          >
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
