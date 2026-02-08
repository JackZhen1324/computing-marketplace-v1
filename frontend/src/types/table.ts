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
  fixed?: boolean | 'left' | 'right';  // Column fixed position or always-visible flag
}
