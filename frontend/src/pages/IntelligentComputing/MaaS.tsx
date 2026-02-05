import { useState } from 'react';
import ModelCard from '../../components/common/ModelCard';
import { getModelsByCategory } from '../../data/models';
import type { ModelInfo } from '../../data/models';
import styles from './MaaS.module.css';

const MaaS = () => {
  const [activeTab, setActiveTab] = useState<ModelInfo['category']>('general');

  const tabs = [
    { key: 'general' as const, label: '通用大模型', icon: '🌐' },
    { key: 'vertical' as const, label: '垂直大模型', icon: '📊' },
    { key: 'industry' as const, label: '行业大模型', icon: '🏢' },
    { key: 'tools' as const, label: '开发工具', icon: '🛠️' },
    { key: 'academic' as const, label: '学术研究大模型', icon: '🔬' },
  ];

  const models = getModelsByCategory(activeTab);

  const categoryNames: Record<ModelInfo['category'], string> = {
    general: '通用大模型',
    vertical: '垂直大模型',
    industry: '行业大模型',
    tools: '开发工具',
    academic: '学术研究大模型',
  };

  const categoryDescriptions: Record<ModelInfo['category'], string> = {
    general: '强大的通用语言理解和生成能力，适用于多种场景',
    vertical: '针对特定领域优化，提供专业级解决方案',
    industry: '深入行业场景，助力数字化转型',
    tools: '完整的AI开发工具链，加速模型开发部署',
    academic: '支持前沿科研探索，推动学术创新',
  };

  const features = [
    {
      icon: '🚀',
      title: '快速部署',
      desc: '开箱即用，无需从头训练，快速上线AI能力',
    },
    {
      icon: '🔌',
      title: '标准API',
      desc: '统一的调用接口，降低集成难度',
    },
    {
      icon: '💡',
      title: '灵活定制',
      desc: '支持微调和定制，满足特定业务需求',
    },
    {
      icon: '📈',
      title: '持续优化',
      desc: '模型持续迭代更新，性能不断提升',
    },
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroIcon}>☁️</div>
            <h1 className={styles.heroTitle}>MaaS 平台</h1>
            <p className={styles.heroSubtitle}>
              将通用/行业大模型封装为标准化服务
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className={styles.tabsSection}>
        <div className={styles.tabsContainer}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`${styles.tabButton} ${
                activeTab === tab.key ? styles.active : ''
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Models Section */}
      <section className={styles.modelsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {categoryNames[activeTab]}
          </h2>
          <p className={styles.sectionDesc}>
            {categoryDescriptions[activeTab]}
          </p>
        </div>

        <div className={styles.modelsGrid}>
          {models.map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>平台优势</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MaaS;
