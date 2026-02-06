import { useState } from 'react';
import { Card, Tag } from 'antd';
import { CheckOutlined, ThunderboltOutlined, StarOutlined, RocketOutlined } from '@ant-design/icons';
import type { Product } from '../../data/products';
import InquiryDialog from './InquiryDialog';

interface ApplianceCardProps {
  product: Product;
}

const ApplianceCard = ({ product }: ApplianceCardProps) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  // Extract specifications
  const gpu = product.specifications.find(spec => spec.label === 'GPU')?.value || 'N/A';
  const cpu = product.specifications.find(spec => spec.label === 'CPU')?.value || 'N/A';
  const memory = product.specifications.find(spec => spec.label === '内存')?.value || 'N/A';
  const storage = product.specifications.find(spec => spec.label === '存储')?.value || 'N/A';
  const software = product.specifications.find(spec => spec.label === '软件栈' || spec.label === '模型')?.value || 'N/A';

  // DeepSeek special handling
  const isDeepSeek = product.name.includes('DeepSeek');

  return (
    <Card
      hoverable
      className="appliance-card"
      style={{
        borderRadius: '16px',
        overflow: 'visible',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        height: '100%',
        background: isDeepSeek
          ? 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
        position: 'relative',
      }}
      styles={{
        body: { padding: '28px' },
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.2)';
        e.currentTarget.style.transform = 'translateY(-6px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Status Tags */}
      {product.tags && product.tags.length > 0 && (
        <div style={{ position: 'absolute', top: '-8px', right: '20px', zIndex: 1 }}>
          {product.tags.map((tag, index) => (
            <Tag
              key={index}
              color={tag === '热销' ? 'red' : tag === '上新' ? 'blue' : 'purple'}
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '4px 12px',
                borderRadius: '20px',
                margin: '0 4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
      )}

      {/* DeepSeek Badge */}
      {isDeepSeek && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            left: '20px',
            zIndex: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
          }}
        >
          <RocketOutlined />
          DeepSeek
        </div>
      )}

      {/* Product Icon */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: isDeepSeek
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          fontSize: '32px',
        }}
      >
        {isDeepSeek ? '🤖' : '🖥️'}
      </div>

      {/* Product Title */}
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 700,
          margin: '0 0 8px 0',
          color: '#1a1a1a',
        }}
      >
        {product.name}
      </h3>

      {/* Subtitle */}
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px', minHeight: '20px' }}>
        {product.subtitle}
      </div>

      {/* Price */}
      {product.price && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            价格
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ff4d4f',
              lineHeight: 1,
            }}
          >
            {product.price}
          </div>
        </div>
      )}

      {/* Specifications List */}
      <div style={{ marginBottom: '24px' }}>
        {[
          { label: 'GPU', value: gpu, icon: <ThunderboltOutlined /> },
          { label: 'CPU', value: cpu, icon: <StarOutlined /> },
          { label: '内存', value: memory, icon: <CheckOutlined /> },
          { label: '存储', value: storage, icon: <CheckOutlined /> },
          { label: isDeepSeek ? '模型' : '软件', value: software, icon: <CheckOutlined /> },
        ].map((spec, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginBottom: index < 4 ? '10px' : '0',
              fontSize: '14px',
            }}
          >
            <span style={{ color: isDeepSeek ? '#667eea' : '#00f2fe', fontSize: '14px', marginTop: '2px' }}>
              {spec.icon}
            </span>
            <span style={{ color: '#999', minWidth: '50px', flexShrink: 0 }}>{spec.label}：</span>
            <span style={{ color: '#1a1a1a', fontWeight: 500, wordBreak: 'break-word' }}>
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => setDialogVisible(true)}
        style={{
          width: '100%',
          padding: '12px 24px',
          background: isDeepSeek
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: 'none',
          borderRadius: '10px',
          color: '#fff',
          fontSize: '15px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = isDeepSeek
            ? '0 6px 20px rgba(102, 126, 234, 0.4)'
            : '0 6px 20px rgba(79, 172, 254, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        立即咨询
      </button>

      {/* Inquiry Dialog */}
      <InquiryDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        product={{
          id: product.id,
          name: product.name,
          category: product.category,
        }}
      />
    </Card>
  );
};

export default ApplianceCard;
