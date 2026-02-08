import { useState } from 'react';
import { Card, Tag } from 'antd';
import { RocketOutlined, ThunderboltOutlined, StarOutlined } from '@ant-design/icons';
import InquiryDialog from './InquiryDialog';

interface ModelInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  parameters: string;
  architecture?: string;
  performance?: string;
  tags: string[];
  category: 'general' | 'vertical' | 'industry' | 'tools' | 'academic';
}

interface ModelCardProps {
  model: ModelInfo;
}

const ModelCard = ({ model }: ModelCardProps) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  return (
    <Card
      hoverable
      className="model-card"
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        height: '100%',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
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
      {/* Model Icon */}
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
        {model.icon}
      </div>

      {/* Model Name */}
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 700,
          margin: '0 0 8px 0',
          color: '#1a1a1a',
        }}
      >
        {model.name}
      </h3>

      {/* Tags */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {model.tags.map((tag, index) => (
          <Tag
            key={index}
            color={
              index === 0
                ? 'purple'
                : index === 1
                ? 'blue'
                : index === 2
                ? 'cyan'
                : 'default'
            }
            style={{ margin: 0, fontSize: '12px', padding: '2px 8px' }}
          >
            {tag}
          </Tag>
        ))}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: '14px',
          color: '#666',
          lineHeight: '1.6',
          margin: '0 0 16px 0',
          minHeight: '48px',
        }}
      >
        {model.description}
      </p>

      {/* Specifications */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            fontSize: '13px',
          }}
        >
          <ThunderboltOutlined style={{ color: '#667eea', fontSize: '14px' }} />
          <span style={{ color: '#999', minWidth: '70px' }}>参数量：</span>
          <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{model.parameters}</span>
        </div>

        {model.architecture && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              fontSize: '13px',
            }}
          >
            <StarOutlined style={{ color: '#667eea', fontSize: '14px' }} />
            <span style={{ color: '#999', minWidth: '70px' }}>架构：</span>
            <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{model.architecture}</span>
          </div>
        )}

        {model.performance && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
            }}
          >
            <RocketOutlined style={{ color: '#667eea', fontSize: '14px' }} />
            <span style={{ color: '#999', minWidth: '70px' }}>优势：</span>
            <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{model.performance}</span>
          </div>
        )}
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
          id: model.id,
          name: model.name,
          category: model.category,
        }}
      />
    </Card>
  );
};

export default ModelCard;
