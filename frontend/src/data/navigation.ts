export interface NavItem {
  label: string;
  path: string;
  description?: string;
  children?: NavItem[];
  badge?: string;
}

export const navigationData: NavItem[] = [
  {
    label: '首页',
    path: '/',
  },
  {
    label: '智算专区',
    path: '/intelligent',
    children: [
      {
        label: 'GPU裸金属',
        path: '/intelligent/gpu-bare-metal',
        description: '资源独享、稳定可靠同时提供强劲算力',
      },
      {
        label: 'GPU云主机',
        path: '/intelligent/gpu-cloud',
        description: '视频解码、图形渲染、深度学习、科学计算等场景',
      },
      {
        label: '智算一体机',
        path: '/intelligent/appliance',
        description: '软硬一体的智算产品，整合大模型训推应用全流程',
      },
      {
        label: 'MaaS平台',
        path: '/intelligent/maas',
        description: '根据业务所需，选择接入业界主流开源大模型',
      },
    ],
  },
  {
    label: '通算专区',
    path: '/general',
  },
  {
    label: '解决方案',
    path: '/solutions',
    children: [
      {
        label: '算力服务平台',
        path: '/solutions/service-platform',
        description: '提供一站式算力服务，助力企业数字化转型',
      },
      {
        label: '算力网络体系',
        path: '/solutions/network-system',
        description: '构建高效协同的算力网络，实现资源优化配置',
      },
      {
        label: '算力融合底座',
        path: '/solutions/fusion-base',
        description: '打造统一的算力基础设施，支撑多样化应用场景',
      },
    ],
  },
  {
    label: '政策&新闻',
    path: '/news',
  },
  {
    label: '关于我们',
    path: '/about',
  },
];

export const footerLinks = {
  product: {
    title: '产品中心',
    links: [
      { label: 'GPU裸金属', path: '/intelligent/gpu-bare-metal' },
      { label: 'GPU云主机', path: '/intelligent/gpu-cloud' },
      { label: '智算一体机', path: '/intelligent/appliance' },
      { label: '通用计算', path: '/general' },
    ],
  },
  solutions: {
    title: '解决方案',
    links: [
      { label: '算力服务平台', path: '/solutions/service-platform' },
      { label: '算力网络体系', path: '/solutions/network-system' },
      { label: '算力融合底座', path: '/solutions/fusion-base' },
    ],
  },
  company: {
    title: '关于我们',
    links: [
      { label: '公司简介', path: '/about' },
      { label: '联系我们', path: '/about#contact' },
      { label: '加入我们', path: '/about#careers' },
    ],
  },
};
