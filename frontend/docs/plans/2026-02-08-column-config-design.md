# Column Configuration System Design

## Overview
A reusable column configuration system for all Admin table pages, allowing users to show/hide columns, reorder them, adjust widths, and reset to defaults.

## Requirements
- **Configuration Method**: Column config button + Modal
- **Storage**: localStorage (browser-based, per-user)
- **Default State**: Show all columns on first visit
- **Features**:
  - Show/hide columns
  - Drag to reorder columns
  - Adjust column widths
  - Reset to default configuration

## Architecture

### Core Components

#### 1. useColumnConfig Hook
**Purpose**: Manages column configuration state and persistence

**Location**: `frontend/src/hooks/useColumnConfig.ts`

**Interface**:
```typescript
interface UseColumnConfigOptions {
  tableKey: string;              // Unique table identifier
  defaultColumns: ColumnDef[];   // Default column definitions
}

interface ColumnDef {
  key: string;
  title: string;
  visible?: boolean;
  width?: number;
  fixed?: boolean;  // For fixed columns (e.g., actions)
}

interface ColumnConfig {
  key: string;
  visible: boolean;
  width?: number;
  order: number;
}
```

**Returns**:
```typescript
{
  columns: any[];              // Configured and sorted columns
  config: ColumnConfig[];      // Current configuration
  isModalVisible: boolean;
  showConfigModal: () => void;
  hideConfigModal: () => void;
  updateConfig: (newConfig: ColumnConfig[]) => void;
  resetConfig: () => void;
}
```

**Workflow**:
1. Load config from localStorage on mount
2. Create default config if none exists (all columns visible)
3. Filter and sort columns based on config
4. Save to localStorage on config change

#### 2. ColumnConfigModal Component
**Purpose**: Modal UI for configuring column display

**Location**: `frontend/src/components/ConfigurableTable/ColumnConfigModal.tsx`

**UI Layout**:
- **Header**: Title "列配置" + Reset button
- **Body**: Draggable column list
  - Drag handle icon
  - Checkbox (show/hide)
  - Column title
  - Width input (optional)
- **Footer**: Confirm/Cancel buttons

**Interactions**:
- Drag to reorder using `@dnd-kit`
- Toggle visibility with checkbox
- Input custom width
- Reset to defaults

#### 3. ConfigurableTable Component
**Purpose**: Enhanced Ant Design Table with column configuration

**Location**: `frontend/src/components/ConfigurableTable/index.tsx`

**Interface**:
```typescript
interface ConfigurableTableProps extends TableProps {
  tableKey: string;        // Required: unique table identifier
  columns: ColumnDef[];    // Required: column definitions
  // ... other Table props
}
```

**Features**:
- Wraps Ant Design Table
- Shows config button in top-right corner (SettingOutlined icon)
- Uses useColumnConfig internally
- Applies column config automatically

### Data Structure

#### Storage Key Format
```
table-column-config-{pageName}
```

Examples:
- `table-column-config-inquiry-admin`
- `table-column-config-product-admin`

#### Config Object
```typescript
interface TableConfig {
  columns: ColumnConfig[];
}
```

## Implementation Strategy

### Phase 1: Foundation
1. Install dependencies: `@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
2. Create type definitions in `types/table.ts`
3. Implement `useColumnConfig` hook
4. Create `ColumnConfigModal` component

### Phase 2: Component Development
1. Build `ConfigurableTable` wrapper component
2. Implement drag-and-drop functionality
3. Add width adjustment inputs
4. Implement reset functionality

### Phase 3: Integration
1. Migrate **InquiryAdmin** (10+ columns)
2. Migrate **ProductAdmin**
3. Migrate **NewsAdmin**
4. Migrate **SolutionAdmin**
5. Migrate **CategoryAdmin**

### Migration Pattern

**Before**:
```typescript
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 200,
    render: (id: string) => <span>{id}</span>
  },
  // ...
];

<Table columns={columns} dataSource={data} rowKey="id" />
```

**After**:
```typescript
const columnDefinitions: ColumnDef[] = [
  {
    key: 'id',
    title: 'ID',
    width: 200,
    render: (id: string) => <span>{id}</span>
  },
  // ...
];

<ConfigurableTable
  tableKey="inquiry-admin"
  columns={columnDefinitions}
  dataSource={data}
  rowKey="id"
/>
```

## Key Implementation Details

### 1. Column Merging Logic
```typescript
const mergedColumns = useMemo(() => {
  return columnDefinitions
    .filter(col => {
      const config = columnConfig.find(c => c.key === col.key);
      return config ? config.visible : true;
    })
    .map(col => {
      const config = columnConfig.find(c => c.key === col.key);
      return {
        ...col,
        width: config?.width || col.width,
      };
    })
    .sort((a, b) => {
      const aOrder = columnConfig.find(c => c.key === a.key)?.order ?? 0;
      const bOrder = columnConfig.find(c => c.key === b.key)?.order ?? 0;
      return aOrder - bOrder;
    });
}, [columnDefinitions, columnConfig]);
```

### 2. Handling Fixed/Action Columns
```typescript
const [regularColumns, actionColumns] = useMemo(() => {
  return columns.reduce((acc, col) => {
    if (col.key === 'actions' || col.fixed === 'right') {
      acc[1].push(col);
    } else {
      acc[0].push(col);
    }
    return acc;
  }, [[], []]);
}, [columns]);

// Only configure regular columns
const { columns: configuredColumns } = useColumnConfig({
  tableKey,
  defaultColumns: regularColumns,
});

// Merge: configured columns + action columns
const finalColumns = [...configuredColumns, ...actionColumns];
```

### 3. LocalStorage Error Handling
```typescript
const saveConfig = (tableKey: string, config: ColumnConfig[]) => {
  try {
    localStorage.setItem(`table-column-config-${tableKey}`, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save column config:', error);
    // Silent fail, don't break UX
  }
};

const loadConfig = (tableKey: string): ColumnConfig[] | null => {
  try {
    const stored = localStorage.getItem(`table-column-config-${tableKey}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load column config:', error);
    return null;
  }
};
```

## Testing Checklist

- [x] Config persists after page refresh
- [x] Hidden columns don't show in table
- [x] Drag reordering works correctly
- [x] Custom widths apply correctly
- [x] Reset restores defaults
- [x] Action columns always visible and non-configurable
- [x] Graceful degradation when localStorage quota full
- [x] Mobile responsive (modal usable on small screens)

## Performance Optimizations

- Use `useMemo` for column filtering/sorting
- Use `requestAnimationFrame` for drag operations
- Debounce localStorage writes (avoid frequent writes)

## File Structure

```
frontend/src/
├── components/
│   └── ConfigurableTable/
│       ├── index.tsx
│       ├── ColumnConfigModal.tsx
│       └── ConfigurableTable.module.css
├── hooks/
│   └── useColumnConfig.ts
├── types/
│   └── table.ts
└── pages/
    └── Admin/
        ├── InquiryAdmin.tsx       # To be migrated
        ├── ProductAdmin.tsx       # To be migrated
        ├── NewsAdmin.tsx          # To be migrated
        ├── SolutionAdmin.tsx      # To be migrated
        └── CategoryAdmin.tsx      # To be migrated
```

## Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Why @dnd-kit?**
- Modern and lightweight
- Excellent accessibility support
- Great TypeScript support
- Better performance than react-dnd

## Notes

- Fixed columns (actions) are always visible and cannot be configured
- Config is per-table, not global
- No backend integration required (localStorage only)
- Graceful degradation if localStorage unavailable
