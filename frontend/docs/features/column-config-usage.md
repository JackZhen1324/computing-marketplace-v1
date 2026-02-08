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
    fixed: true,  // Action columns are always visible
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

- Action columns (with `fixed: true`) are always visible
- Configurations persist across browser sessions
- Each table has independent configuration
