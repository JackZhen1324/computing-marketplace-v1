// 产品类型定义
export interface Product {
  id: string
  name: string
  category: 'gpu-bare-metal' | 'gpu-cloud' | 'appliance' | 'maas' | 'general-computing'
  description: string
  specifications: Record<string, string>
  pricing: {
    type: 'hourly' | 'monthly' | 'contact'
    price?: number
    unit?: string
  }
  source: string
  region: string
  image: string
  tags: string[]
  featured: boolean
}

// 解决方案类型定义
export interface Solution {
  id: string
  title: string
  description: string
  icon: string
  image: string
  features: string[]
  applications: string[]
  link: string
}

// 新闻类型定义
export interface News {
  id: string
  title: string
  summary: string
  category: 'policy' | 'news'
  date: string
  image: string
}

// GPU裸金属产品数据
export const gpuBareMetalProducts: Product[] = [
  {
    id: 'gpu-bm-001',
    name: 'NVIDIA A100 80GB 裸金属',
    category: 'gpu-bare-metal',
    description: '拥有极致性能的云上独立物理服务器，资源独享、稳定可靠同时提供强劲算力，适用于大数据、核心数据库、高性能计算等场景。',
    specifications: {
      'GPU型号': 'NVIDIA A100 80GB',
      'GPU数量': '8卡',
      'CPU': 'Intel Xeon Gold 6348',
      '内存': '1TB DDR4',
      '存储': '15TB NVMe SSD',
      '网络': '100Gbps'
    },
    pricing: { type: 'hourly', price: 120, unit: '元/小时' },
    source: '中电信',
    region: '北京',
    image: '/images/gpu裸金属/u227.jpg',
    tags: ['高性能', 'AI训练', '推荐'],
    featured: true
  },
  {
    id: 'gpu-bm-002',
    name: 'NVIDIA H100 80GB 裸金属',
    category: 'gpu-bare-metal',
    description: '最新一代H100 GPU，提供前所未有的AI计算性能，适合大规模深度学习训练。',
    specifications: {
      'GPU型号': 'NVIDIA H100 80GB',
      'GPU数量': '8卡',
      'CPU': 'Intel Xeon Platinum 8480+',
      '内存': '2TB DDR5',
      '存储': '30TB NVMe SSD',
      '网络': '200Gbps'
    },
    pricing: { type: 'contact' },
    source: '中电信',
    region: '上海',
    image: '/images/gpu裸金属/u227.jpg',
    tags: ['顶配', 'AI训练', '推荐'],
    featured: true
  },
  {
    id: 'gpu-bm-003',
    name: 'NVIDIA V100 32GB 裸金属',
    category: 'gpu-bare-metal',
    description: '成熟稳定的V100 GPU，性价比高，适合中小规模AI训练和推理。',
    specifications: {
      'GPU型号': 'NVIDIA V100 32GB',
      'GPU数量': '4卡',
      'CPU': 'Intel Xeon Silver 4314',
      '内存': '512GB DDR4',
      '存储': '8TB NVMe SSD',
      '网络': '50Gbps'
    },
    pricing: { type: 'hourly', price: 45, unit: '元/小时' },
    source: '中电信',
    region: '广州',
    image: '/images/gpu裸金属/u227.jpg',
    tags: ['性价比', 'AI推理'],
    featured: false
  }
]

// GPU云主机产品数据
export const gpuCloudProducts: Product[] = [
  {
    id: 'gpu-cloud-001',
    name: 'A100 云主机',
    category: 'gpu-cloud',
    description: '灵活弹性的GPU云主机，按需付费，快速部署。',
    specifications: {
      'GPU型号': 'NVIDIA A100 40GB',
      'GPU数量': '1-4卡可选',
      'vCPU': '32-128核',
      '内存': '128-512GB',
      '存储': '1-20TB云盘'
    },
    pricing: { type: 'hourly', price: 15, unit: '元/小时' },
    source: '中电信',
    region: '北京',
    image: '/images/gpu云主机/u627.png',
    tags: ['弹性', '快速部署'],
    featured: true
  },
  {
    id: 'gpu-cloud-002',
    name: 'T4 GPU 云主机',
    category: 'gpu-cloud',
    description: '适合AI推理和轻量级训练的GPU云主机。',
    specifications: {
      'GPU型号': 'NVIDIA T4 16GB',
      'GPU数量': '1-4卡可选',
      'vCPU': '8-32核',
      '内存': '32-128GB',
      '存储': '500GB-5TB云盘'
    },
    pricing: { type: 'hourly', price: 5, unit: '元/小时' },
    source: '中电信',
    region: '上海',
    image: '/images/gpu云主机/u627.png',
    tags: ['性价比', 'AI推理'],
    featured: false
  }
]

// 解决方案数据
export const solutions: Solution[] = [
  {
    id: 'solution-001',
    title: '算力服务平台',
    description: '打造一体化算力服务能力，实现算力资源统一调度、按需分配、智能运维。',
    icon: 'cloud-server',
    image: '/images/solutions/platform.jpg',
    features: ['统一算力调度', '弹性资源分配', '智能运维监控', '多租户隔离'],
    applications: ['AI训练', '科学计算', '渲染农场', '大数据分析'],
    link: '/solutions/platform'
  },
  {
    id: 'solution-002',
    title: '算力网络体系',
    description: '构建覆盖全国的算力网络，实现跨地域算力协同调度。',
    icon: 'cluster',
    image: '/images/solutions/network.jpg',
    features: ['跨地域调度', '低延迟传输', '智能路由', '网络优化'],
    applications: ['分布式训练', '边缘计算', '数据协同', '灾备容灾'],
    link: '/solutions/network'
  },
  {
    id: 'solution-003',
    title: '算力融合底座',
    description: '通智一体算力融合底座，打通异构算力全链路。',
    icon: 'api',
    image: '/images/solutions/foundation.jpg',
    features: ['异构算力融合', '统一接口', '灵活扩展', '开放生态'],
    applications: ['混合云部署', '多云管理', '算力交易', '资源共享'],
    link: '/solutions/foundation'
  }
]

// 新闻数据
export const newsData: News[] = [
  {
    id: 'news-001',
    title: '关于加快算力基础设施建设的政策指导意见',
    summary: '国家发改委等部门联合发布指导意见，加快全国一体化算力网络国家枢纽节点建设。',
    category: 'policy',
    date: '2025-01-15',
    image: '/images/news/policy-001.jpg'
  },
  {
    id: 'news-002',
    title: '算力超市平台正式上线，助力AI产业发展',
    summary: '云聚通智一体算力超市平台今日正式上线，汇聚各类算力资源，为用户提供一站式算力服务。',
    category: 'news',
    date: '2025-01-10',
    image: '/images/news/launch.jpg'
  },
  {
    id: 'news-003',
    title: '中国电信发布新一代智算中心建设方案',
    summary: '中国电信发布基于通智一体架构的新一代智算中心建设方案，全面支持AI大模型训练和推理。',
    category: 'news',
    date: '2025-01-05',
    image: '/images/news/datacenter.jpg'
  }
]
