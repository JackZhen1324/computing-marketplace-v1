import { Card } from 'antd';
import type { Spec } from '../../../data/products';
import styles from './SpecTable.module.css';

interface SpecTableProps {
  specifications: Spec[];
  title?: string;
}

const SpecTable = ({ specifications, title = '技术规格' }: SpecTableProps) => {
  return (
    <Card className={styles.card} title={title}>
      <div className={styles.table}>
        {specifications.map((spec, index) => (
          <div key={index} className={styles.row}>
            <div className={styles.label}>{spec.label}</div>
            <div className={styles.value}>{spec.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SpecTable;
