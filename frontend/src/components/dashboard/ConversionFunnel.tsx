import React from 'react';
import { Card } from 'antd';
import { Funnel } from '@ant-design/charts';
import { useConversionData } from '../../hooks/useDashboardData';
import type { TimeRange } from '../../types/dashboard';
import styles from './ConversionFunnel.module.css';

interface ConversionFunnelProps {
  timeRange: TimeRange;
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ timeRange }) => {
  const { data, isLoading } = useConversionData(timeRange);

  const chartData = data?.funnel?.map((item: any) => ({
    stage: item.stage,
    value: item.count,
  })) || [];

  const config = {
    data: chartData,
    xField: 'stage',
    yField: 'value',
    label: {
      formatter: (datum: any) => `${datum.stage}: ${datum.value}`,
    },
  };

  return (
    <Card title="转化漏斗" loading={isLoading} className={styles.chart}>
      {chartData.length > 0 ? (
        <Funnel {...config} height={300} />
      ) : (
        <div className={styles.empty}>暂无数据</div>
      )}
    </Card>
  );
};
