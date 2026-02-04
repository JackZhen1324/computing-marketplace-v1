import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { navigationData } from '../../data/navigation';
import DropdownPanel from './DropdownPanel';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navItemRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get active key based on current path
  const getActiveKey = () => {
    const path = location.pathname;

    // Check intelligent computing sub-pages
    if (path.startsWith('/intelligent/')) {
      return 'intelligent';
    }

    // Check solutions sub-pages
    if (path.startsWith('/solutions/')) {
      return 'solutions';
    }

    // Direct matches
    for (const item of navigationData) {
      if (item.path === path) {
        return path.replace('/', '') || 'home';
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.path === path) {
            return item.path.replace('/', '');
          }
        }
      }
    }

    return 'home';
  };

  const activeKey = getActiveKey();

  // Helper function to check if a nav item is active
  const isNavItemActive = (item: any) => {
    const itemKey = item.path === '/' ? 'home' : item.path.replace('/', '');
    return activeKey === itemKey;
  };

  // Handle dropdown mouse events
  const handleDropdownEnter = (itemPath: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(itemPath);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleDropdownContentEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
  };

  const handleDropdownContentLeave = () => {
    setOpenDropdown(null);
  };

  // Desktop navigation
  const renderDesktopNav = () => (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        {navigationData.map((item) => {
          const isActive = isNavItemActive(item);
          const hasChildren = item.children && item.children.length > 0;
          const isDropdownOpen = openDropdown === item.path;

          return (
            <li
              key={item.path}
              className={styles.navItem}
              ref={(el) => {
                if (el) navItemRefs.current.set(item.path, el);
              }}
              onMouseEnter={() => hasChildren && handleDropdownEnter(item.path)}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                to={item.path}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                {item.label}
              </Link>

              {hasChildren && isDropdownOpen && (
                <div
                  className={styles.dropdownWrapper}
                  onMouseEnter={handleDropdownContentEnter}
                  onMouseLeave={handleDropdownContentLeave}
                >
                  <DropdownPanel items={item.children!} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  // Mobile navigation
  const renderMobileNav = () => (
    <>
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={styles.mobileMenuButton}
      />

      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {navigationData.map((item) => {
            const isActive = isNavItemActive(item);

            if (item.children) {
              return (
                <div key={item.path} className={styles.mobileNavItem}>
                  <div className={`${styles.mobileNavLabel} ${isActive ? styles.active : ''}`}>
                    {item.label}
                  </div>
                  <div className={styles.mobileSubMenu}>
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={styles.mobileSubLink}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src="/images/首页/u3.png" alt="Logo" className={styles.logoImage} />
        </Link>

        {!isMobile ? renderDesktopNav() : renderMobileNav()}
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
