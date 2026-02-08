# Column Configuration System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a reusable column configuration system for all Admin table pages that allows users to show/hide columns, reorder them, adjust widths, and reset to defaults using localStorage.

**Architecture:** Create three core components (useColumnConfig hook, ColumnConfigModal, ConfigurableTable) that integrate with Ant Design Table. The hook manages state and localStorage persistence, the modal provides drag-and-drop UI using @dnd-kit, and the wrapper component ties everything together.

**Tech Stack:** React hooks, Ant Design Table, @dnd-kit (drag-and-drop), localStorage, TypeScript

---

## Prerequisites

### Task 0: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install @dnd-kit packages**

```bash
cd frontend
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Step 2: Verify installation**

```bash
grep "@dnd-kit" package.json
```

Expected: Should see three @dnd-kit packages listed

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @dnd-kit for drag-and-drop column configuration"
```

---

## Phase 1: Foundation

### Task 1: Create Type Definitions

**Files:**
- Create: `src/types/table.ts`

**Step 1: Create type definition file**

```typescript
import type {ColumnType} from 'antd/es/table';

// Column configuration stored in localStorage
export interface ColumnConfig {
  key: string;           // Column key (must match column definition)
  visible: boolean;      // Whether column is shown
  width?: number;        // Custom width (optional)
  order: number;         // Display order (0-based)
}

// Table configuration stored in localStorage
export interface TableConfig {
  columns: ColumnConfig[];
}

// Column definition for ConfigurableTable
export interface ColumnDef extends Omit<ColumnType<any>, 'key'> {
  key: string;           // Required unique identifier
  title: string;         // Column title
  fixed?: boolean;       // If true, column is always visible (e.g., actions)
}
```

**Step 2: Verify file exists**

```bash
ls -la src/types/table.ts
```

Expected: File created successfully

**Step 3: Commit**

```bash
git add src/types/table.ts
git commit -m "feat: add table column configuration types"
```

---

### Task 2: Implement useColumnConfig Hook

**Files:**
- Create: `src/hooks/useColumnConfig.ts`

**Step 1: Create hook with localStorage management**

```typescript
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ColumnConfig, ColumnDef } from '../types/table';

interface UseColumnConfigOptions {
  tableKey: string;              // Unique table identifier for localStorage
  defaultColumns: ColumnDef[];   // Default column definitions
}

const STORAGE_KEY_PREFIX = 'table-column-config-';

export const useColumnConfig = ({ tableKey, defaultColumns }: UseColumnConfigOptions) => {
  const [config, setConfig] = useState<ColumnConfig[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Load config from localStorage on mount
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${tableKey}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as ColumnConfig[];
        setConfig(parsed);
      } else {
        // Initialize with default config (all columns visible)
        const defaultConfig: ColumnConfig[] = defaultColumns.map((col, index) => ({
          key: col.key,
          visible: true,
          order: index,
        }));
        setConfig(defaultConfig);
      }
    } catch (error) {
      console.error('Failed to load column config:', error);
      // Fallback to default config
      const defaultConfig: ColumnConfig[] = defaultColumns.map((col, index) => ({
        key: col.key,
        visible: true,
        order: index,
      }));
      setConfig(defaultConfig);
    }
  }, [tableKey, defaultColumns]);

  // Save config to localStorage
  const saveConfig = useCallback((newConfig: ColumnConfig[]) => {
    const storageKey = `${STORAGE_KEY_PREFIX}${tableKey}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(newConfig));
    } catch (error) {
      console.error('Failed to save column config:', error);
    }
  }, [tableKey]);

  // Merge column definitions with config
  const mergedColumns = useMemo(() => {
    return defaultColumns
      .filter(col => {
        const colConfig = config.find(c => c.key === col.key);
        return colConfig ? colConfig.visible : true;
      })
      .map(col => {
        const colConfig = config.find(c => c.key === col.key);
        return {
          ...col,
          width: colConfig?.width || col.width,
        };
      })
      .sort((a, b) => {
        const aOrder = config.find(c => c.key === a.key)?.order ?? 0;
        const bOrder = config.find(c => c.key === b.key)?.order ?? 0;
        return aOrder - bOrder;
      });
  }, [defaultColumns, config]);

  // Update configuration
  const updateConfig = useCallback((newConfig: ColumnConfig[]) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  }, [saveConfig]);

  // Reset to default
  const resetConfig = useCallback(() => {
    const defaultConfig: ColumnConfig[] = defaultColumns.map((col, index) => ({
      key: col.key,
      visible: true,
      order: index,
    }));
    setConfig(defaultConfig);
    saveConfig(defaultConfig);
  }, [defaultColumns, saveConfig]);

  // Modal controls
  const showConfigModal = useCallback(() => setIsModalVisible(true), []);
  const hideConfigModal = useCallback(() => setIsModalVisible(false), []);

  return {
    columns: mergedColumns,
    config,
    isModalVisible,
    showConfigModal,
    hideConfigModal,
    updateConfig,
    resetConfig,
  };
};
```

**Step 2: Verify file compiles**

```bash
npm run build 2>&1 | grep -A 5 "useColumnConfig"
```

Expected: No TypeScript errors related to useColumnConfig

**Step 3: Commit**

```bash
git add src/hooks/useColumnConfig.ts
git commit -m "feat: implement useColumnConfig hook with localStorage persistence"
```

---

## Phase 2: UI Components

### Task 3: Create ColumnConfigModal Component

**Files:**
- Create: `src/components/ConfigurableTable/ColumnConfigModal.tsx`
- Create: `src/components/ConfigurableTable/ColumnConfigModal.module.css`

**Step 1: Create modal component with drag-and-drop**

```typescript
import { useMemo } from 'react';
import { Modal, Checkbox, InputNumber, Button, Space } from 'antd';
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
}

function SortableItem({ config, allTitles }: SortableItemProps) {
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
          onChange={(e) => {
            // Parent will handle the update
            const event = new CustomEvent('visibilityChange', {
              detail: { key: config.key, visible: e.target.checked }
            });
            window.dispatchEvent(event);
          }}
        >
          {allTitles[config.key] || config.key}
        </Checkbox>
      </div>
      <div className={styles.itemActions}>
        <span className={styles.widthLabel}>宽度:</span>
        <InputNumber
          size="small"
          value={config.width}
          onChange={(value) => {
            const event = new CustomEvent('widthChange', {
              detail: { key: config.key, width: value || undefined }
            });
            window.dispatchEvent(event);
          }}
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
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [localConfig, setLocalConfig] = useMemo(() => {
    // We'll use state to manage local changes
    return [config, (newConfig: ColumnConfig[]) => setLocalConfig(newConfig)];
  }, [config]);

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

  return (
    <Modal
      title="列配置"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={500}
      footer={[
        <Button key="reset" icon={<ReloadOutlined />} onClick={onReset}>
          重置
        </Button>,
        <Button key="cancel" onClick={onCancel}>
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
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Modal>
  );
};
```

**Step 2: Create modal styles**

```css
.columnList {
  max-height: 400px;
  overflow-y: auto;
}

.sortableItem {
  display: flex;
  flex-direction: column;
  padding: 12px;
  margin-bottom: 8px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: background 0.2s;
}

.sortableItem:hover {
  background: #fafafa;
}

.itemHeader {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dragHandle {
  cursor: grab;
  padding: 4px;
  border: none;
  background: transparent;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dragHandle:hover {
  color: #333;
}

.dragHandle:active {
  cursor: grabbing;
}

.itemActions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  margin-left: 28px;
}

.widthLabel {
  font-size: 12px;
  color: #666;
}
```

**Step 3: Verify file compiles**

```bash
npm run build 2>&1 | grep -A 5 "ColumnConfigModal"
```

Expected: No TypeScript errors

**Step 4: Commit**

```bash
git add src/components/ConfigurableTable/
git commit -m "feat: create ColumnConfigModal with drag-and-drop functionality"
```

---

### Task 4: Create ConfigurableTable Component

**Files:**
- Create: `src/components/ConfigurableTable/index.tsx`
- Create: `src/components/ConfigurableTable/ConfigurableTable.module.css`

**Step 1: Create ConfigurableTable wrapper component**

```typescript
import { useMemo } from 'react';
import { Table, Button, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd/es/table';
import { useColumnConfig } from '../../hooks/useColumnConfig';
import { ColumnConfigModal } from './ColumnConfigModal';
import type { ColumnDef } from '../../types/table';
import styles from './ConfigurableTable.module.css';

interface ConfigurableTableProps extends TableProps<any> {
  tableKey: string;        // Required: unique table identifier
  columns: ColumnDef[];    // Required: column definitions
}

export const ConfigurableTable = ({
  tableKey,
  columns: columnDefinitions,
  ...tableProps
}: ConfigurableTableProps) => {
  // Split columns into regular and fixed (action) columns
  const [regularColumns, actionColumns] = useMemo(() => {
    return columnDefinitions.reduce((acc, col) => {
      if (col.key === 'actions' || col.fixed === 'right') {
        acc[1].push(col);
      } else {
        acc[0].push(col);
      }
      return acc;
    }, [[], []] as [ColumnDef[], ColumnDef[]]);
  }, [columnDefinitions]);

  // Create column title mapping for modal
  const columnTitles = useMemo(() => {
    return regularColumns.reduce((acc, col) => {
      acc[col.key] = col.title;
      return acc;
    }, {} as Record<string, string>);
  }, [regularColumns]);

  // Use column config hook for regular columns only
  const {
    columns: configuredColumns,
    config,
    isModalVisible,
    showConfigModal,
    hideConfigModal,
    updateConfig,
    resetConfig,
  } = useColumnConfig({
    tableKey,
    defaultColumns: regularColumns,
  });

  // Merge configured columns with action columns
  const finalColumns = [...configuredColumns, ...actionColumns];

  // Build the title with config button
  const title = tableProps.title ? (
    <div className={styles.tableHeaderWithConfig}>
      <div>{tableProps.title}</div>
      <Button
        icon={<SettingOutlined />}
        onClick={showConfigModal}
        size="small"
        className={styles.configButton}
      >
        列配置
      </Button>
    </div>
  ) : undefined;

  return (
    <>
      <Table
        {...tableProps}
        columns={finalColumns}
        title={tableProps.title ? () => title : undefined}
      />
      <ColumnConfigModal
        visible={isModalVisible}
        config={config}
        allTitles={columnTitles}
        onOk={updateConfig}
        onCancel={hideConfigModal}
        onReset={resetConfig}
      />
    </>
  );
};
```

**Step 2: Create ConfigurableTable styles**

```css
.tableHeaderWithConfig {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.configButton {
  margin-left: auto;
}
```

**Step 3: Create barrel export**

```bash
cat > src/components/ConfigurableTable/index.ts << 'EOF'
export { ConfigurableTable } from './index';
export type { ColumnDef } from '../../types/table';
EOF
```

**Step 4: Verify files compile**

```bash
npm run build 2>&1 | grep -A 5 "ConfigurableTable"
```

Expected: No TypeScript errors

**Step 5: Commit**

```bash
git add src/components/ConfigurableTable/
git commit -m "feat: create ConfigurableTable wrapper component"
```

---

## Phase 3: Integration

### Task 5: Migrate InquiryAdmin to Use ConfigurableTable

**Files:**
- Modify: `src/pages/Admin/InquiryAdmin.tsx`

**Step 1: Add ConfigurableTable import**

At top of file, replace Table import:
```typescript
import { Table, Button, Modal, Form, Select, Input, message, Card, Statistic, Row, Col } from 'antd';
```

With:
```typescript
import { Button, Modal, Form, Select, Input, message, Card, Statistic, Row, Col } from 'antd';
import { ConfigurableTable } from '../../components/ConfigurableTable';
import type { ColumnDef } from '../../types/table';
```

**Step 2: Convert columns to ColumnDef array**

Replace the columns definition (around line 95) with:
```typescript
const columnDefinitions: ColumnDef[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 200,
    render: (id: string) => (
      <span style={{ fontSize: '12px', color: '#666' }}>{id}</span>
    ),
  },
  {
    title: '企业名称',
    dataIndex: 'companyName',
    key: 'companyName',
    width: 150,
  },
  {
    title: '联系人',
    key: 'customer',
    width: 150,
    render: (_: any, record: Inquiry) => (
      <div>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{record.customerName}</div>
        <div style={{ fontSize: '13px', color: '#666' }}>{record.contactPhone}</div>
      </div>
    ),
  },
  {
    title: '意向产品',
    key: 'productName',
    width: 200,
    render: (_: any, record: Inquiry) => (
      <div>
        <Tag color="blue" style={{ fontSize: '12px' }}>
          {record.productName}
        </Tag>
      </div>
    ),
  },
  {
    title: '意向规格',
    dataIndex: 'specification',
    key: 'specification',
    width: 150,
    render: (value: string) => value || '-',
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
    width: 100,
    render: (priority: keyof typeof priorityConfig) => (
      <Tag color={priorityConfig[priority]?.color || 'default'}>
        {priorityConfig[priority]?.text || priority}
      </Tag>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    render: (status: keyof typeof statusConfig) => (
      <Tag icon={statusConfig[status]?.icon} color={statusConfig[status]?.color || 'default'}>
        {statusConfig[status]?.text || status}
      </Tag>
    ),
  },
  {
    title: '提交时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    render: (date: string) => new Date(date).toLocaleString('zh-CN'),
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right' as const,
    render: (_: any, record: Inquiry) => (
      <Space>
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>
      </Space>
    ),
  },
];
```

**Step 3: Replace Table with ConfigurableTable**

Find the Table component (around line 251) and replace:
```typescript
<Table
  columns={columns}
  dataSource={inquiries}
  rowKey="id"
  loading={loading}
  pagination={{
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }}
  scroll={{ x: 1500 }}
/>
```

With:
```typescript
<ConfigurableTable
  tableKey="inquiry-admin"
  columns={columnDefinitions}
  dataSource={inquiries}
  rowKey="id"
  loading={loading}
  pagination={{
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }}
  scroll={{ x: 1500 }}
/>
```

**Step 4: Remove unused columns variable**

The `columns` constant is no longer needed, ensure it's removed.

**Step 5: Verify build**

```bash
npm run build
```

Expected: Build succeeds without errors

**Step 6: Commit**

```bash
git add src/pages/Admin/InquiryAdmin.tsx
git commit -m "refactor: migrate InquiryAdmin to use ConfigurableTable"
```

---

### Task 6: Migrate ProductAdmin to Use ConfigurableTable

**Files:**
- Read: `src/pages/Admin/ProductAdmin.tsx`
- Modify: `src/pages/Admin/ProductAdmin.tsx`

**Step 1: Read ProductAdmin to understand column structure**

```bash
grep -n "const columns = " src/pages/Admin/ProductAdmin.tsx -A 50
```

**Step 2: Add ConfigurableTable import and convert columns**

Following the same pattern as InquiryAdmin:
1. Import ConfigurableTable and ColumnDef
2. Convert columns array to columnDefinitions
3. Replace Table with ConfigurableTable using tableKey="product-admin"
4. Ensure actions column has `fixed: 'right'`

**Step 3: Verify build**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add src/pages/Admin/ProductAdmin.tsx
git commit -m "refactor: migrate ProductAdmin to use ConfigurableTable"
```

---

### Task 7: Migrate NewsAdmin to Use ConfigurableTable

**Files:**
- Modify: `src/pages/Admin/NewsAdmin.tsx`

**Step 1: Follow same migration pattern**

1. Import ConfigurableTable and ColumnDef
2. Convert columns array (around line 80) to columnDefinitions
3. Replace Table with ConfigurableTable using tableKey="news-admin"
4. Ensure actions column has `fixed: 'right'`

**Step 2: Verify build**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/pages/Admin/NewsAdmin.tsx
git commit -m "refactor: migrate NewsAdmin to use ConfigurableTable"
```

---

### Task 8: Migrate SolutionAdmin to Use ConfigurableTable

**Files:**
- Modify: `src/pages/Admin/SolutionAdmin.tsx`

**Step 1: Follow same migration pattern**

1. Import ConfigurableTable and ColumnDef
2. Convert columns array to columnDefinitions
3. Replace Table with ConfigurableTable using tableKey="solution-admin"
4. Ensure actions column has `fixed: 'right'`

**Step 2: Verify build**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/pages/Admin/SolutionAdmin.tsx
git commit -m "refactor: migrate SolutionAdmin to use ConfigurableTable"
```

---

### Task 9: Migrate CategoryAdmin to Use ConfigurableTable

**Files:**
- Modify: `src/pages/Admin/CategoryAdmin.tsx`

**Step 1: Follow same migration pattern**

1. Import ConfigurableTable and ColumnDef
2. Convert columns array to columnDefinitions
3. Replace Table with ConfigurableTable using tableKey="category-admin"
4. Ensure actions column has `fixed: 'right'`

**Step 2: Verify build**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/pages/Admin/CategoryAdmin.tsx
git commit -m "refactor: migrate CategoryAdmin to use ConfigurableTable"
```

---

## Phase 4: Testing and Documentation

### Task 10: Manual Testing

**Files:**
- None (testing only)

**Step 1: Start development server**

```bash
cd frontend
npm run dev
```

**Step 2: Test InquiryAdmin**

Open http://localhost:5177/admin/inquiries

Test cases:
- [ ] Click "列配置" button, modal opens
- [ ] Uncheck a column, click OK, column hides
- [ ] Refresh page, column stays hidden
- [ ] Drag columns to reorder, click OK, order changes
- [ ] Set custom width, click OK, width applies
- [ ] Click Reset, all columns visible and restored
- [ ] Actions column always visible and can't be hidden

**Step 3: Test other Admin pages**

Repeat for ProductAdmin, NewsAdmin, SolutionAdmin, CategoryAdmin

**Step 4: Test localStorage persistence**

```javascript
// In browser console on any admin page
localStorage.getItem('table-column-config-inquiry-admin')
// Should return JSON with column config
```

**Step 5: Test responsive behavior**

Resize browser to mobile width, verify modal still usable

**Step 6: Document any issues found**

If issues found, create tasks to fix them

---

### Task 11: Create Documentation

**Files:**
- Create: `docs/features/column-config-usage.md`

**Step 1: Write usage documentation**

```markdown
# Column Configuration Feature

## Overview

All Admin table pages now support column configuration, allowing users to:
- Show/hide columns
- Reorder columns via drag-and-drop
- Adjust column widths
- Reset to default configuration

## Usage

### For Users

1. Click the "列配置" button in the top-right of any table
2. In the modal:
   - Drag columns using the drag handle to reorder
   - Check/uncheck columns to show/hide
   - Set custom widths in the input field
   - Click "重置" to restore defaults
3. Click "确定" to apply changes

### For Developers

To add column configuration to a new table:

```typescript
import { ConfigurableTable } from '../../components/ConfigurableTable';
import type { ColumnDef } from '../../types/table';

// Define your columns
const columnDefinitions: ColumnDef[] = [
  {
    key: 'id',
    title: 'ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
  },
  {
    key: 'actions',
    title: 'Actions',
    fixed: 'right',  // Action columns are always visible
    render: (_, record) => <Button>Edit</Button>
  },
];

// Use ConfigurableTable
<ConfigurableTable
  tableKey="my-table"  // Unique identifier for localStorage
  columns={columnDefinitions}
  dataSource={data}
  rowKey="id"
/>
```

## Storage

Column configurations are stored in `localStorage` with keys like:
- `table-column-config-inquiry-admin`
- `table-column-config-product-admin`

To clear all column configurations:
```javascript
Object.keys(localStorage)
  .filter(key => key.startsWith('table-column-config-'))
  .forEach(key => localStorage.removeItem(key));
```

## Notes

- Action columns (with `fixed: 'right'`) are always visible
- Configurations persist across browser sessions
- Each table has independent configuration
```

**Step 2: Verify documentation**

```bash
cat docs/features/column-config-usage.md
```

**Step 3: Commit**

```bash
git add docs/features/column-config-usage.md
git commit -m "docs: add column configuration feature documentation"
```

---

## Final Steps

### Task 12: Final Build and Verification

**Files:**
- All

**Step 1: Run full build**

```bash
cd frontend
npm run build
```

Expected: Build succeeds with no errors (warnings are OK)

**Step 2: Rebuild Docker images**

```bash
docker-compose build
```

**Step 3: Restart services**

```bash
docker-compose up -d
```

**Step 4: Verify services**

```bash
docker-compose ps
curl http://localhost:9211/health
curl -s -o /dev/null -w "%{http_code}" http://localhost:9210/
```

Expected: All services healthy

**Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete column configuration system for all admin tables"
```

---

## Success Criteria

- [x] All Admin pages use ConfigurableTable
- [x] Column config persists across page refreshes
- [x] Drag-and-drop reordering works
- [x] Custom widths apply correctly
- [x] Reset functionality works
- [x] Action columns always visible
- [x] No TypeScript errors
- [x] Docker build succeeds
- [x] All services healthy
