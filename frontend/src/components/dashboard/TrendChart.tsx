import React, { useState } from 'react';
import { Card, Radio } from 'antd';
import { Line } from '@ant-design/charts';
import { useTrendData } from '../../hooks/useDashboardData';
import type { TimeRange, TrendGranularity } from '../../types/dashboard';
import styles from './TrendChart.module.css';

interface TrendChartProps {
  timeRange: TimeRange;
}

export const TrendChart: React.FC<TrendChartProps> = ({ timeRange: _timeRange }) => {
  const [granularity, setGranularity] = useState<TrendGranularity>('daily');
  const { data, isLoading } = useTrendData(granularity);

  // 将数据转换为折线图格式
  const inquiriesData = (data?.[granularity] || []).map((item: any) => ({
    date: item.date,
    type: '询价',
    value: item.inquiries,
  }));

  const conversionsData = (data?.[granularity] || []).map((item: any) => ({
    date: item.date,
    type: '成交',
    value: item.conversions,
  }));

  const chartData = [...inquiriesData, ...conversionsData];

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    yAxis: {
      label: {
        formatter: (val: string) => `${val}个`,
      },
    },
    legend: {
      position: 'top' as const,
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in' as const,
        duration: 1000,
      },
    },
  };

  return (
    <Card
      title="趋势分析"
      loading={isLoading}
      extra={
        <Radio.Group
          value={granularity}
          onChange={(e) => setGranularity(e.target.value)}
          size="small"
        >
          <Radio.Button value="daily">日</Radio.Button>
          <Radio.Button value="weekly">周</Radio.Button>
          <Radio.Button value="monthly">月</Radio.Button>
        </Radio.Group>
      }
      className={styles.chart}
    >
      {chartData.length > 0 ? (
        <Line {...config} height={300} />
      ) : (
        <div className={styles.empty}>暂无数据</div>
      )}
    </Card>
  );
};
