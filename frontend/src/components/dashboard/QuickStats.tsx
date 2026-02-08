import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import styles from './QuickStats.module.css';

interface QuickStatsProps {
  stats?: {
    totalInquiries: number;
    pendingTasks: number;
    conversionRate: number;
    activeProducts: number;
    trends: {
      inquiriesChange: number;
      tasksChange: number;
      conversionChange: number;
    };
  };
  loading?: boolean;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats, loading }) => {
  const renderTrend = (value: number) => {
    if (value === 0) return null;

    const isPositive = value >= 0;
    const Icon = isPositive ? ArrowUpOutlined : ArrowDownOutlined;
    const color = isPositive ? '#52c41a' : '#ff4d4f';

    return (
      <span style={{ color, fontSize: '12px', marginLeft: '8px' }}>
        <Icon /> {Math.abs(value)}%
      </span>
    );
  };

  return (
    <Row gutter={24} className={styles.statsRow}>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="总咨询数"
            value={stats?.totalInquiries || 0}
            suffix={renderTrend(stats?.trends?.inquiriesChange || 0)}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="待处理任务"
            value={stats?.pendingTasks || 0}
            suffix={renderTrend(stats?.trends?.tasksChange || 0)}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="转化率"
            value={stats?.conversionRate || 0}
            suffix="%"
            precision={1}
            valueStyle={{ color: '#52c41a' }}
          />
          {stats?.trends && renderTrend(stats.trends.conversionChange || 0)}
        </Card>
      </Col>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="在售产品"
            value={stats?.activeProducts || 0}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
    </Row>
  );
};
