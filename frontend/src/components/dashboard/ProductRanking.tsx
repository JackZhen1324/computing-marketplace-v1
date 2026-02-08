import React from 'react';
import { Card } from 'antd';
import { Column } from '@ant-design/charts';
import { useProductRanking } from '../../hooks/useDashboardData';
import type { TimeRange } from '../../types/dashboard';
import styles from './ProductRanking.module.css';

interface ProductRankingProps {
  timeRange: TimeRange;
}

export const ProductRanking: React.FC<ProductRankingProps> = ({ timeRange }) => {
  const { data, isLoading } = useProductRanking(10, timeRange);

  const chartData = (data?.topProducts || []).map((item: any, index: number) => ({
    productName: item.productName,
    inquiryCount: item.inquiryCount,
    conversionRate: item.conversionRate,
    rank: index + 1,
  }));

  const config = {
    data: chartData,
    xField: 'inquiryCount',
    yField: 'productName',
    seriesField: 'productName',
    rank: {
      direction: 'desc' as const,
    },
    label: {
      position: 'right' as const,
      formatter: (datum: any) => `${datum.inquiryCount}次询价`,
    },
    color: '#1890ff',
  };

  return (
    <Card title="热门产品 Top 10" loading={isLoading} className={styles.chart}>
      {chartData.length > 0 ? (
        <Column {...config} height={300} />
      ) : (
        <div className={styles.empty}>暂无数据</div>
      )}
    </Card>
  );
};
