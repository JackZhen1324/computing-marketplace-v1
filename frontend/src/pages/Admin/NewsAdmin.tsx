import { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Switch, Space, message, Card, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { newsService, NewsArticle, CreateNewsRequest, UpdateNewsRequest } from '../../services/api/news';
import { ConfigurableTable } from '../../components/ConfigurableTable';
import type { ColumnDef } from '../../types/table';

const { TextArea } = Input;
const { Option } = Select;

const NewsAdmin = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await newsService.getNews();
      setNews(data);
    } catch (error: any) {
      message.error('获取新闻列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingNews(null);
    form.resetFields();
    form.setFieldsValue({
      type: 'NEWS',
      isPublished: true,
      displayOrder: 0,
    });
    setModalVisible(true);
  };

  const handleEdit = (item: NewsArticle) => {
    setEditingNews(item);
    form.setFieldsValue(item);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await newsService.deleteNews(id);
      message.success('删除成功');
      fetchNews();
    } catch (error: any) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingNews) {
        await newsService.updateNews(editingNews.id, values as UpdateNewsRequest);
        message.success('更新成功');
      } else {
        await newsService.createNews(values as CreateNewsRequest);
        message.success('创建成功');
      }

      setModalVisible(false);
      form.resetFields();
      fetchNews();
    } catch (error: any) {
      if (error.errorFields) return;
      message.error('操作失败');
    }
  };

  const columnDefinitions: ColumnDef[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 200 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '标签', dataIndex: 'tag', key: 'tag', width: 120 },
    { title: '来源', dataIndex: 'source', key: 'source', width: 120 },
    {
      title: '状态',
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: 80,
      render: (published: boolean) => (published ? '已发布' : '草稿'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: true,
      render: (_: any, record: NewsArticle) => (
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
        title="新闻管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建新闻
          </Button>
        }
      >
        <ConfigurableTable
          tableKey="news-admin"
          columns={columnDefinitions}
          dataSource={news}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingNews ? '编辑新闻' : '新建新闻'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={700}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select>
              <Option value="NEWS">新闻</Option>
              <Option value="POLICY">政策</Option>
            </Select>
          </Form.Item>

          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="summary" label="摘要">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item name="content" label="内容">
            <TextArea rows={6} />
          </Form.Item>

          <Form.Item name="source" label="来源">
            <Input />
          </Form.Item>

          <Form.Item name="tag" label="标签">
            <Input />
          </Form.Item>

          <Form.Item name="imageUrl" label="图片URL">
            <Input />
          </Form.Item>

          <Form.Item name="publishDate" label="发布日期">
            <Input type="date" />
          </Form.Item>

          <Form.Item name="displayOrder" label="排序" initialValue={0}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="isPublished" label="发布" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsAdmin;
