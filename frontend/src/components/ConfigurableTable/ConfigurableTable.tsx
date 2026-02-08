import { useMemo } from 'react';
import { Table, Button } from 'antd';
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
  title,
  ...tableProps
}: ConfigurableTableProps) => {
  // Split columns into regular and fixed (action) columns
  const [regularColumns, actionColumns] = useMemo(() => {
    return columnDefinitions.reduce((acc, col) => {
      if (col.key === 'actions' || col.fixed === true) {
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

  return (
    <>
      <Table
        {...tableProps}
        columns={finalColumns}
        title={title ? () => (
          <div className={styles.tableHeaderWithConfig}>
            <div>{typeof title === 'string' ? title : '表格'}</div>
            <Button
              icon={<SettingOutlined />}
              onClick={showConfigModal}
              size="small"
              className={styles.configButton}
            >
              列配置
            </Button>
          </div>
        ) : undefined}
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
