import { Link } from 'react-router-dom';
import { NavigationItem } from '../../services/api/navigation';
import styles from './DropdownPanel.module.css';

interface DropdownPanelProps {
  items: NavigationItem[];
  onClose?: () => void;
}

const DropdownPanel = ({ items, onClose }: DropdownPanelProps) => {
  return (
    <div className={styles.dropdownPanel}>
      <div className={styles.dropdownGrid}>
        {items.filter(item => item.path).map((item) => (
          <Link
            key={item.path}
            to={item.path!}
            className={styles.dropdownItem}
            onClick={onClose}
          >
            <div className={styles.itemTitle}>{item.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DropdownPanel;
