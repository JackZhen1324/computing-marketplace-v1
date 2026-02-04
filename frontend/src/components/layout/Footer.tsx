import { Link } from 'react-router-dom';
import { footerLinks } from '../../data/navigation';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Company Info */}
          <div className={styles.section}>
            <h3 className={styles.title}>联系我们</h3>
            <div className={styles.info}>
              <p><strong>中电信数智科技有限公司</strong></p>
              <p>地址：北京市西城区展览路街道京鼎大厦</p>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className={styles.section}>
              <h3 className={styles.title}>{section.title}</h3>
              <ul className={styles.linkList}>
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p>© {currentYear} 云聚通智一体算力超市. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
