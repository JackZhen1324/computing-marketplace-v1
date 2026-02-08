import { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Switch, Space, message, Card, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { solutionsService, SolutionWithBenefits, CreateSolutionRequest, UpdateSolutionRequest } from '../../services/api/solutions';
import { ConfigurableTable } from '../../components/ConfigurableTable';
import type { ColumnDef } from '../../types/table';

const { TextArea } = Input;

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
    { title: 'ID', dataIndex: 'id', key: 'id', width: 200 },
    { title: '标题', dataIndex: 'title', key: 'title', width: 200 },
    {
      title: '亮点',
      dataIndex: 'highlights',
      key: 'highlights',
      width: 300,
      render: (highlights: string[]) => highlights?.join(', ') || '-',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (active: boolean) => (active ? '启用' : '禁用'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: true,
      render: (_: any, record: SolutionWithBenefits) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
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
        title="解决方案管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建解决方案
          </Button>
        }
      >
        <ConfigurableTable
          tableKey="solution-admin"
          columns={columnDefinitions}
          dataSource={solutions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingSolution ? '编辑解决方案' : '新建解决方案'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={700}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item name="id" label="ID" rules={[{ required: true }]}>
            <Input placeholder="唯一标识" disabled={!!editingSolution} />
          </Form.Item>

          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="subtitle" label="副标题">
            <Input />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item name="highlights" label="亮点（每行一个）">
            <TextArea rows={4} placeholder="每行输入一个亮点" />
          </Form.Item>

          <Form.Item name="architecture" label="架构">
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item name="imageUrl" label="图片URL">
            <Input />
          </Form.Item>

          <Form.Item name="isActive" label="启用" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SolutionAdmin;
