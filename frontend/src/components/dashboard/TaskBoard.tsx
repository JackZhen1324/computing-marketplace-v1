import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import { usePendingTasks } from '../../hooks/useDashboardData';
import type { TimeRange } from '../../types/dashboard';
import styles from './TaskBoard.module.css';

const COLUMNS = [
  { id: 'PENDING', title: '待联系', color: '#faad14' },
  { id: 'CONTACTED', title: '已联系', color: '#1890ff' },
  { id: 'NEGOTIATING', title: '洽谈中', color: '#13c2c2' },
  { id: 'CLOSED', title: '已成交', color: '#52c41a' },
];

export const TaskBoard: React.FC<{ timeRange: TimeRange }> = ({ timeRange }) => {
  const { data: tasksData, isLoading } = usePendingTasks({ timeRange, sortBy: 'date' });
  const tasks = tasksData?.tasks || [];

  const tasksByColumn = COLUMNS.reduce((acc, column) => {
    acc[column.id] = tasks.filter((t: any) => t.status === column.id);
    return acc;
  }, {} as Record<string, typeof tasks>);

  return (
    <div className={styles.board}>
      {COLUMNS.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          color={column.color}
          tasks={tasksByColumn[column.id] || []}
          loading={isLoading}
        />
      ))}
    </div>
  );
};
