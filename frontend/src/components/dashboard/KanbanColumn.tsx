import React from 'react';
import { TaskCard } from './TaskCard';
import type { Task } from '../../types/dashboard';
import styles from './KanbanColumn.module.css';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  loading?: boolean;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id: _id,
  title,
  color,
  tasks,
  loading,
}) => {
  return (
    <div className={styles.column}>
      <div className={styles.header} style={{ borderBottomColor: color }}>
        <span className={styles.title}>{title}</span>
        <span className={styles.count}>{loading ? '...' : tasks.length}</span>
      </div>
      <div className={styles.tasks}>
        {loading ? (
          <div className={styles.empty}>加载中...</div>
        ) : tasks.length === 0 ? (
          <div className={styles.empty}>暂无任务</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              companyName={task.companyName}
              customerName={task.customerName}
              productName={task.productName}
              priority={task.priority}
              createdAt={task.createdAt}
              contactPhone={task.contactPhone}
            />
          ))
        )}
      </div>
    </div>
  );
};
