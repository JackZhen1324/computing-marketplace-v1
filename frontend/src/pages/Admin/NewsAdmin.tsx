import { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Switch, Space, message, Typography, Tag, Row, Col, Tooltip } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  EditOutlined as EditPenOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { newsService, NewsArticle, CreateNewsRequest, UpdateNewsRequest } from '../../services/api/news';
import { ConfigurableTable } from '../../components/ConfigurableTable';
import type { ColumnDef } from '../../types/table';
import styles from './NewsAdmin.module.css';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const NewsAdmin = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [viewNews, setViewNews] = useState<NewsArticle | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
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

  const handleView = (item: NewsArticle) => {
    setViewNews(item);
    setViewModalVisible(true);
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

  const typeConfig = {
    NEWS: { text: '新闻', color: 'blue', icon: <FileTextOutlined />, bgColor: '#e6f7ff' },
    POLICY: { text: '政策', color: 'green', icon: <CheckCircleOutlined />, bgColor: '#f6ffed' },
  };

  const stats = {
    total: news.length,
    published: news.filter(n => n.isPublished).length,
    draft: news.filter(n => !n.isPublished).length,
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

  const columnDefinitions: ColumnDef[] = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{title}</span>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: keyof typeof typeConfig) => {
        const config = typeConfig[type];
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
            {config?.text || type}
          </Tag>
        );
      },
    },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
      width: 120,
      ellipsis: true,
      render: (tag: string) => tag ? (
        <Tag color="cyan" style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '12px' }}>
          {tag}
        </Tag>
      ) : <Text type="secondary">-</Text>,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 120,
      ellipsis: true,
      render: (source: string) => source || <Text type="secondary">-</Text>,
    },
    {
      title: '状态',
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: 100,
      render: (published: boolean) => (
        <Tag
          icon={published ? <CheckCircleOutlined /> : <EditPenOutlined />}
          color={published ? 'success' : 'default'}
          style={{
            fontSize: '12px',
            padding: '4px 12px',
            borderRadius: '12px',
            fontWeight: 500,
            background: published ? '#f6ffed' : '#f5f5f5',
            border: 'none',
          }}
        >
          {published ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '排序',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 80,
      render: (order: number) => (
        <Text style={{ fontSize: '13px', color: '#595959' }}>{order}</Text>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: any, record: NewsArticle) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              className={styles.actionButton}
            >
              查看
            </Button>
          </Tooltip>
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
            新闻管理
          </Title>
          <Text type="secondary">管理平台新闻文章和政策信息</Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchNews}
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
            新建新闻
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="总文章"
            value={stats.total}
            icon={<FileTextOutlined />}
            color="#1890ff"
            bgColor="#e6f7ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="已发布"
            value={stats.published}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            bgColor="#f6ffed"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="草稿"
            value={stats.draft}
            icon={<EditPenOutlined />}
            color="#8c8c8c"
            bgColor="#f5f5f5"
          />
        </Col>
      </Row>

      {/* Table */}
      <div className={styles.tableCard}>
        <ConfigurableTable
          tableKey="news-admin"
          columns={columnDefinitions}
          dataSource={news}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      {/* View Modal */}
      <Modal
        title={
          <Space>
            <EyeOutlined style={{ color: '#1890ff' }} />
            <span>新闻详情</span>
          </Space>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {viewNews && (
          <div className={styles.detailContent}>
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>文章ID</span>
                  <Text copyable className={styles.detailValue}>
                    {viewNews.id.slice(0, 16)}...
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>类型</span>
                  <Tag
                    icon={typeConfig[viewNews.type as keyof typeof typeConfig]?.icon}
                    color={typeConfig[viewNews.type as keyof typeof typeConfig]?.color}
                    style={{
                      background: typeConfig[viewNews.type as keyof typeof typeConfig]?.bgColor,
                      border: 'none',
                      padding: '4px 12px',
                    }}
                  >
                    {typeConfig[viewNews.type as keyof typeof typeConfig]?.text || viewNews.type}
                  </Tag>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>标题</span>
                  <Text strong className={styles.detailValue}>
                    {viewNews.title}
                  </Text>
                </div>
              </Col>
              {viewNews.summary && (
                <Col span={24}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>摘要</span>
                    <div className={styles.detailValue}>{viewNews.summary}</div>
                  </div>
                </Col>
              )}
              {viewNews.tag && (
                <Col span={12}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>标签</span>
                    <Tag color="cyan" style={{ margin: 0 }}>{viewNews.tag}</Tag>
                  </div>
                </Col>
              )}
              {viewNews.source && (
                <Col span={12}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>来源</span>
                    <Text className={styles.detailValue}>{viewNews.source}</Text>
                  </div>
                </Col>
              )}
              {viewNews.publishDate && (
                <Col span={12}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>发布日期</span>
                    <Text className={styles.detailValue}>{viewNews.publishDate}</Text>
                  </div>
                </Col>
              )}
              <Col span={12}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>排序</span>
                  <Text className={styles.detailValue}>{viewNews.displayOrder}</Text>
                </div>
              </Col>
              {viewNews.content && (
                <Col span={24}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>内容</span>
                    <div className={styles.detailValue} style={{ whiteSpace: 'pre-wrap' }}>
                      {viewNews.content}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>

      {/* Edit/Create Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined style={{ color: '#1890ff' }} />
            <span>{editingNews ? '编辑新闻' : '新建新闻'}</span>
          </Space>
        }
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={700}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item name="type" label="类型" rules={[{ required: true, message: '请选择类型' }]}>
            <Select size="large" placeholder="请选择类型">
              <Option value="NEWS">
                <Space>
                  <FileTextOutlined />
                  新闻
                </Space>
              </Option>
              <Option value="POLICY">
                <Space>
                  <CheckCircleOutlined />
                  政策
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input size="large" placeholder="请输入新闻标题" />
          </Form.Item>

          <Form.Item name="summary" label="摘要">
            <TextArea rows={2} placeholder="请输入新闻摘要" maxLength={200} showCount />
          </Form.Item>

          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
            <TextArea rows={6} placeholder="请输入新闻内容" maxLength={5000} showCount />
          </Form.Item>

          <Form.Item name="source" label="来源">
            <Input size="large" placeholder="请输入新闻来源" />
          </Form.Item>

          <Form.Item name="tag" label="标签">
            <Input size="large" placeholder="请输入新闻标签" />
          </Form.Item>

          <Form.Item name="imageUrl" label="图片URL">
            <Input size="large" placeholder="请输入图片URL" />
          </Form.Item>

          <Form.Item name="publishDate" label="发布日期">
            <Input size="large" type="date" />
          </Form.Item>

          <Form.Item name="displayOrder" label="排序" initialValue={0}>
            <Input size="large" type="number" placeholder="数字越小排序越靠前" />
          </Form.Item>

          <Form.Item name="isPublished" label="状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="已发布" unCheckedChildren="草稿" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsAdmin;
