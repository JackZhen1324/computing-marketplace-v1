import { useState } from 'react';
import { Modal, Checkbox, InputNumber, Button } from 'antd';
import { ReloadOutlined, DragOutlined } from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ColumnConfig } from '../../types/table';
import styles from './ColumnConfigModal.module.css';

interface SortableItemProps {
  config: ColumnConfig;
  allTitles: Record<string, string>;
  onVisibilityChange: (key: string, visible: boolean) => void;
  onWidthChange: (key: string, width: number | undefined) => void;
}

function SortableItem({ config, allTitles, onVisibilityChange, onWidthChange }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: config.key });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={itemStyle} className={styles.sortableItem}>
      <div className={styles.itemHeader}>
        <button
          className={styles.dragHandle}
          {...attributes}
          {...listeners}
          type="button"
        >
          <DragOutlined />
        </button>
        <Checkbox
          checked={config.visible}
          onChange={(e) => onVisibilityChange(config.key, e.target.checked)}
        >
          {allTitles[config.key] || config.key}
        </Checkbox>
      </div>
      <div className={styles.itemActions}>
        <span className={styles.widthLabel}>宽度:</span>
        <InputNumber
          size="small"
          value={config.width}
          onChange={(value) => onWidthChange(config.key, value || undefined)}
          min={50}
          max={1000}
          placeholder="自动"
        />
      </div>
    </div>
  );
}

interface ColumnConfigModalProps {
  visible: boolean;
  config: ColumnConfig[];
  allTitles: Record<string, string>;
  onOk: (newConfig: ColumnConfig[]) => void;
  onCancel: () => void;
  onReset: () => void;
}

export const ColumnConfigModal = ({
  visible,
  config,
  allTitles,
  onOk,
  onCancel,
  onReset,
}: ColumnConfigModalProps) => {
  const [localConfig, setLocalConfig] = useState<ColumnConfig[]>(config);

  // Reset local config when modal opens
  useState(() => {
    if (visible) {
      setLocalConfig(config);
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = localConfig.findIndex((c) => c.key === active.id);
      const newIndex = localConfig.findIndex((c) => c.key === over.id);
      const newConfig = arrayMove(localConfig, oldIndex, newIndex).map((col, index) => ({
        ...col,
        order: index,
      }));
      setLocalConfig(newConfig);
    }
  };

  const handleVisibilityChange = (key: string, visible: boolean) => {
    const newConfig = localConfig.map((col) =>
      col.key === key ? { ...col, visible } : col
    );
    setLocalConfig(newConfig);
  };

  const handleWidthChange = (key: string, width?: number) => {
    const newConfig = localConfig.map((col) =>
      col.key === key ? { ...col, width } : col
    );
    setLocalConfig(newConfig);
  };

  const handleOk = () => {
    onOk(localConfig);
  };

  const handleReset = () => {
    onReset();
    setLocalConfig(config);
  };

  const handleCancel = () => {
    setLocalConfig(config);
    onCancel();
  };

  return (
    <Modal
      title="列配置"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={500}
      footer={[
        <Button key="reset" icon={<ReloadOutlined />} onClick={handleReset}>
          重置
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          确定
        </Button>,
      ]}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localConfig.map((c) => c.key)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.columnList}>
            {localConfig.map((colConfig) => (
              <SortableItem
                key={colConfig.key}
                config={colConfig}
                allTitles={allTitles}
                onVisibilityChange={handleVisibilityChange}
                onWidthChange={handleWidthChange}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Modal>
  );
};
