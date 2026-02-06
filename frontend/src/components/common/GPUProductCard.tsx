import { useState } from 'react';
import { Card, Tag } from 'antd';
import { CheckOutlined, ThunderboltOutlined, StarOutlined } from '@ant-design/icons';
import type { ProductWithDetails } from '../../services/types/api';
import InquiryDialog from './InquiryDialog';

interface GPUProductCardProps {
  product: ProductWithDetails;
}

const GPUProductCard = ({ product }: GPUProductCardProps) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  // Extract GPU model from specifications
  const gpuModel = product.specifications.find(spec => spec.specLabel === 'GPU型号')?.specValue || product.name;
  const gpuMemory = product.specifications.find(spec => spec.specLabel === 'GPU显存')?.specValue || 'N/A';
  const cpu = product.specifications.find(spec => spec.specLabel === 'CPU')?.specValue || 'N/A';
  const memory = product.specifications.find(spec => spec.specLabel === '内存')?.specValue || 'N/A';
  const storage = product.specifications.find(spec => spec.specLabel === '存储')?.specValue || 'N/A';

  // Parse price to format it correctly
  const formatPrice = (price: string) => {
    // Extract numeric value and unit
    const match = price.match(/¥([\d,]+)/);
    if (match) {
      const numericValue = match[1].replace(/,/g, '');
      return `¥${numericValue}.00`;
    }
    return price;
  };

  return (
    <Card
      hoverable
      className="gpu-product-card"
      style={{
        borderRadius: '16px',
        overflow: 'visible',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        height: '100%',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
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
      {/* Status Tag - Top Right Corner */}
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

      {/* GPU Icon */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          fontSize: '32px',
        }}
      >
        🖥️
      </div>

      {/* GPU Model & Name */}
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 700,
          margin: '0 0 12px 0',
          color: '#1a1a1a',
        }}
      >
        {product.name}
      </h3>

      {/* Price */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
          低至
        </div>
        <div
          style={{
            fontSize: '26px',
            fontWeight: 'bold',
            color: '#ff4d4f',
            lineHeight: 1,
          }}
        >
          {formatPrice(product.priceDisplay || '')}
          <span style={{ fontSize: '15px', fontWeight: 'normal', color: '#666' }}>
            /月 起
          </span>
        </div>
      </div>

      {/* Specifications List */}
      <div style={{ marginBottom: '24px' }}>
        {[
          { label: 'GPU型号', value: gpuModel, icon: <ThunderboltOutlined /> },
          { label: '显存', value: gpuMemory, icon: <StarOutlined /> },
          { label: '系统盘', value: storage, icon: <CheckOutlined /> },
          { label: 'CPU核数', value: cpu, icon: <CheckOutlined /> },
          { label: '内存容量', value: memory, icon: <CheckOutlined /> },
        ].map((spec, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: index < 4 ? '10px' : '0',
              fontSize: '14px',
            }}
          >
            <span style={{ color: '#667eea', fontSize: '14px' }}>
              {spec.icon}
            </span>
            <span style={{ color: '#999', minWidth: '70px' }}>{spec.label}：</span>
            <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{spec.value}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => setDialogVisible(true)}
        style={{
          width: '100%',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
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
        onSubmit={handleInquirySubmit}
      />
    </Card>
  );
};

export default GPUProductCard;
