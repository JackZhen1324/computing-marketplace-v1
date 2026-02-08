import React from 'react';
import { Segmented, Select, Switch, Space } from 'antd';
import { AppstoreOutlined, BarsOutlined, LineChartOutlined } from '@ant-design/icons';
import type { TimeRange, ViewMode } from '../../types/dashboard';
import styles from './ViewSwitcher.module.css';

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  showInsights: boolean;
  onToggleInsights: () => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  viewMode,
  onViewModeChange,
  timeRange,
  onTimeRangeChange,
  showInsights,
  onToggleInsights,
}) => {
  const timeRangeOptions = [
    { label: '今天', value: 'today' as TimeRange },
    { label: '本周', value: 'week' as TimeRange },
    { label: '本月', value: 'month' as TimeRange },
    { label: '全部', value: 'all' as TimeRange },
  ];

  return (
    <div className={styles.switcher}>
      <Space size="large">
        {/* 视图切换 */}
        <Segmented
          value={viewMode}
          onChange={onViewModeChange}
          options={[
            { label: '看板视图', value: 'kanban' as ViewMode, icon: <AppstoreOutlined /> },
            { label: '列表视图', value: 'list' as ViewMode, icon: <BarsOutlined /> },
          ]}
        />

        {/* 时间筛选 */}
        <Select
          value={timeRange}
          onChange={onTimeRangeChange}
          style={{ width: 120 }}
          options={timeRangeOptions}
        />

        {/* 图表开关 */}
        <Space>
          <LineChartOutlined />
          <span>数据洞察</span>
          <Switch checked={showInsights} onChange={onToggleInsights} />
        </Space>
      </Space>
    </div>
  );
};
