/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2026-02-04 13:08:06
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2026-02-04 15:31:49
 * @FilePath: /算力超市demo/.worktrees/computing-marketplace/frontend/src/pages/Home/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import HeroSection from '../../components/home/HeroSection';
import PlatformCapabilities from '../../components/home/PlatformCapabilities';
import ZoneTabs from '../../components/home/ZoneTabs';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <HeroSection />

      {/* Platform Capabilities */}
      <PlatformCapabilities />

      {/* Zone Tabs - Product Services */}
      <ZoneTabs />
    </div>
  );
};

export default Home;
