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
