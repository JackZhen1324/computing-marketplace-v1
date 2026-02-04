import { Card, Tag, Button, Space, Typography } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import type { Product } from '../../data/mockData'

const { Text, Title } = Typography

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card
      hoverable
      cover={
        <img
          alt={product.name}
          src={product.image}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      }
      actions={[
        <Button type="primary" icon={<ShoppingCartOutlined />} block>
          {product.pricing.type === 'contact' ? '联系咨询' : '立即订购'}
        </Button>
      ]}
    >
      <Title level={4} style={{ marginBottom: '12px' }}>{product.name}</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
        {product.description}
      </Text>

      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div>
          <Text strong>来源：</Text>
          <Text>{product.source}</Text>
        </div>
        <div>
          <Text strong>地区：</Text>
          <Text>{product.region}</Text>
        </div>
        <div>
          <Text strong>价格：</Text>
          <Text type="danger">
            {product.pricing.type === 'contact'
              ? '联系咨询'
              : `¥${product.pricing.price}/${product.pricing.unit}`}
          </Text>
        </div>
      </Space>

      {product.tags.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          {product.tags.map(tag => (
            <Tag key={tag} color={product.featured ? 'blue' : 'default'}>
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </Card>
  )
}

export default ProductCard
