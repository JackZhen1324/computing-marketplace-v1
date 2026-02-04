import { Link } from 'react-router-dom';
import { NavItem } from '../../data/navigation';
import styles from './DropdownPanel.module.css';

interface DropdownPanelProps {
  items: NavItem[];
  onClose?: () => void;
}

const DropdownPanel = ({ items, onClose }: DropdownPanelProps) => {
  return (
    <div className={styles.dropdownPanel}>
      <div className={styles.dropdownGrid}>
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={styles.dropdownItem}
            onClick={onClose}
          >
            <div className={styles.itemTitle}>{item.label}</div>
            {item.description && (
              <div className={styles.itemDescription}>{item.description}</div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DropdownPanel;
