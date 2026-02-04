export interface Stat {
  value: string;
  label: string;
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface PageContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    cta?: {
      text: string;
      link: string;
    };
  };
  features?: Feature[];
  statistics?: Stat[];
}

export const homeContent: PageContent = {
  hero: {
    title: '算力超市 - 一站式算力服务市场',
    subtitle: '提供高性能、弹性、安全的算力服务，助力AI时代业务创新',
    backgroundImage: '/images/common/首页/hero-bg.png',
    cta: {
      text: '立即体验',
      link: '/intelligent',
    },
  },
  statistics: [
    { value: '10000+', label: '算力实例' },
    { value: '99.9%', label: '服务可用性' },
    { value: '24/7', label: '技术支持' },
    { value: '50+', label: '合作伙伴' },
  ],
  features: [
    {
      title: '智算专区',
      description: '提供GPU裸金属、GPU云主机、智算一体机、MaaS平台等智能计算服务，满足AI训练、推理、科学计算等高性能计算需求',
      icon: '/images/common/首页/intelligent-icon.png',
    },
    {
      title: '通算专区',
      description: '提供通用计算云主机，安全稳定、弹性伸缩、灵活计费，适用于Web应用、企业应用等多种场景',
      icon: '/images/common/首页/general-icon.png',
    },
    {
      title: '解决方案',
      description: '为不同行业提供专业的算力解决方案，包括算力服务平台、算力网络体系、算力融合底座等',
      icon: '/images/common/首页/solution-icon.png',
    },
  ],
};

export const intelligentContent: PageContent = {
  hero: {
    title: '智算专区',
    subtitle: '提供强大的智能计算服务，加速AI创新',
    backgroundImage: '/images/common/首页/intelligent-hero-bg.png',
    cta: {
      text: '查看产品',
      link: '/intelligent/gpu-bare-metal',
    },
  },
  features: [
    {
      title: 'GPU裸金属',
      description: '无虚拟化损耗，极致性能释放',
    },
    {
      title: 'GPU云主机',
      description: '弹性GPU计算，按需使用',
    },
    {
      title: '智算一体机',
      description: '开箱即用，一体化解决方案',
    },
    {
      title: 'MaaS平台',
      description: '一站式AI模型开发与部署平台',
    },
  ],
};

export const generalContent: PageContent = {
  hero: {
    title: '通算专区',
    subtitle: '提供安全稳定、可随时自助获取、弹性伸缩的计算服务',
    backgroundImage: '/images/common/通算专区/hero-bg.png',
  },
};

export const solutionsHomeContent: PageContent = {
  hero: {
    title: '解决方案',
    subtitle: '为各行各业提供专业的算力解决方案',
    backgroundImage: '/images/common/解决方案首页/hero-bg.png',
  },
};
