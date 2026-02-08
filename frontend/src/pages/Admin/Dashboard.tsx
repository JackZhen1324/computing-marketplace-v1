import { useState } from 'react';
import { Card } from 'antd';
import { QuickStats } from '../../components/dashboard/QuickStats';
import { TaskBoard } from '../../components/dashboard/TaskBoard';
import InquiryAdmin from './InquiryAdmin';
import { ViewSwitcher } from '../../components/dashboard/ViewSwitcher';
import { DataInsights } from '../../components/dashboard/DataInsights';
import { useDashboardStats } from '../../hooks/useDashboardData';
import type { TimeRange, ViewMode } from '../../types/dashboard';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [showInsights, setShowInsights] = useState(true);

  const { data: stats, isLoading } = useDashboardStats(timeRange);

  return (
    <div className={styles.dashboard}>
      {/* 快速统计卡片 */}
      <QuickStats stats={stats?.quickStats} loading={isLoading} />

      {/* 视图切换器和筛选器 */}
      <Card className={styles.controlBar}>
        <ViewSwitcher
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          showInsights={showInsights}
          onToggleInsights={() => setShowInsights(!showInsights)}
        />
      </Card>

      {/* 任务视图 */}
      {viewMode === 'kanban' ? (
        <TaskBoard timeRange={timeRange} />
      ) : (
        <InquiryAdmin />
      )}

      {/* 数据洞察区（可折叠） */}
      {showInsights && (
        <DataInsights timeRange={timeRange} />
      )}
    </div>
  );
};

export default Dashboard;
