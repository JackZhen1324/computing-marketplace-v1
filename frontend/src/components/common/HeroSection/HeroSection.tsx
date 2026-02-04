import { Button } from 'antd';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  cta?: {
    text: string;
    link: string;
  };
}

const HeroSection = ({
  title,
  subtitle,
  backgroundImage,
  cta,
}: HeroSectionProps) => {
  return (
    <div
      className={styles.hero}
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : { background: 'linear-gradient(135deg, #3F58FA 0%, #5B75FF 100%)' }
      }
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          {cta && (
            <Link to={cta.link}>
              <Button type="primary" size="large" className={styles.cta}>
                {cta.text}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
