import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

// Import data from frontend
const productsData = [
  {
    id: 'general-001',
    categoryId: 'general',
    name: '鲲鹏通用计算型kC2',
    title: '鲲鹏通用计算型kC2',
    subtitle: '搭载鲲鹏920处理器，提供强劲鲲鹏算力',
    description: '搭载鲲鹏920处理器及25GE智能高速网卡，提供强劲鲲鹏算力和高性能网络。',
    features: [
      '弹性伸缩',
      '安全稳定',
      '自助服务',
      '灵活计费',
      '极简运维',
      '降低成本',
    ],
    specifications: [
      { label: '处理器', value: '鲲鹏920' },
      { label: '内存', value: '1GB - 128GB' },
      { label: '存储', value: 'SSD云硬盘，支持扩容' },
      { label: '网络', value: '25GE智能高速网卡' },
      { label: '操作系统', value: 'Linux 多种系统' },
      { label: '适用场景', value: 'Web应用、企业应用、开发测试' },
    ],
    pricing: [
      { plan: '基础型', price: '¥410/月起', features: ['1核2G', '40GB SSD', '1Mbps带宽'] },
      { plan: '标准型', price: '¥620/月起', features: ['2核4G', '60GB SSD', '3Mbps带宽'] },
      { plan: '增强型', price: '¥1240/月起', features: ['4核8G', '100GB SSD', '5Mbps带宽'] },
    ],
    useCases: ['企业网站托管', 'Web应用程序', '开发测试环境', '小型数据库', '轻量级应用服务'],
    imageUrl: '/images/common/通算专区/u918.svg',
    priceDisplay: '¥410/月起',
    source: '中电信',
    region: '北京',
    tags: ['热销'],
    cpuMemoryRatio: '1:2 / 1:4',
    vcpuRange: '1 ~ 160',
    baseFreq: '2.9GHz',
  },
  {
    id: 'general-002',
    categoryId: 'general',
    name: '鲲鹏内存优化型km1',
    title: '鲲鹏内存优化型km1',
    subtitle: '大内存实例，擅长处理大型内存数据集',
    description: '提供最大480GiB基于DDR4的内存实例和高性能网络，擅长处理大型内存数据集。',
    features: ['大内存配置', '高性能网络', '弹性伸缩', '安全稳定', '灵活计费'],
    specifications: [
      { label: '处理器', value: '鲲鹏920' },
      { label: '内存', value: '1GB - 480GB' },
      { label: '存储', value: 'SSD云硬盘，支持扩容' },
      { label: '网络', value: '25GE智能高速网卡' },
      { label: '操作系统', value: 'Linux 多种系统' },
      { label: '适用场景', value: '大数据处理、内存数据库' },
    ],
    pricing: [
      { plan: '基础型', price: '¥660/月起', features: ['2核16G', '60GB SSD', '3Mbps带宽'] },
      { plan: '标准型', price: '¥1320/月起', features: ['4核32G', '100GB SSD', '5Mbps带宽'] },
    ],
    useCases: ['大数据处理', '内存数据库', '高性能计算', '企业应用'],
    imageUrl: '/images/common/通算专区/u918.svg',
    priceDisplay: '¥660/月起',
    source: '中电信',
    region: '上海',
    tags: ['推荐'],
    cpuMemoryRatio: '1:4 / 1:8',
    vcpuRange: '2 ~ 60',
    baseFreq: '2.9GHz',
  },
  {
    id: 'general-003',
    categoryId: 'general',
    name: '鲲鹏超高I/O型ki2',
    title: '鲲鹏超高I/O型ki2',
    subtitle: '高性能NVMe SSD本地磁盘',
    description: '使用高性能NVMe SSD本地磁盘，提供高存储IOPS以及低读写时延。',
    features: ['超高IOPS', '低时延', 'NVMe SSD', '高性能', '弹性伸缩'],
    specifications: [
      { label: '处理器', value: '鲲鹏920' },
      { label: '内存', value: '1GB - 128GB' },
      { label: '存储', value: 'NVMe SSD本地磁盘' },
      { label: '网络', value: '25GE智能高速网卡' },
      { label: '操作系统', value: 'Linux 多种系统' },
      { label: '适用场景', value: '高性能数据库、NoSQL服务' },
    ],
    pricing: [
      { plan: '基础型', price: '¥870/月起', features: ['2核8G', '120GB NVMe', '3Mbps带宽'] },
      { plan: '标准型', price: '¥1740/月起', features: ['4核16G', '240GB NVMe', '5Mbps带宽'] },
    ],
    useCases: ['高性能数据库', 'NoSQL服务', 'Elasticsearch', '数据仓库'],
    imageUrl: '/images/common/通算专区/u918.svg',
    priceDisplay: '¥870/月起',
    source: '中电信',
    region: '广州',
    tags: [],
    cpuMemoryRatio: '1:2 / 1:4',
    vcpuRange: '8 ~ 64',
    baseFreq: '2.9GHz',
  },
  {
    id: 'general-004',
    categoryId: 'general',
    name: '鲲鹏通用计算型kC1',
    title: '鲲鹏通用计算型kC1',
    subtitle: '经济实惠的通用计算实例',
    description: '搭载鲲鹏920处理器，提供经济实惠的通用计算服务，适合中小企业使用。',
    features: ['经济实惠', '性能稳定', '弹性伸缩', '灵活计费'],
    specifications: [
      { label: '处理器', value: '鲲鹏920' },
      { label: '内存', value: '1GB - 64GB' },
      { label: '存储', value: 'SSD云硬盘' },
      { label: '网络', value: '千兆网络' },
      { label: '操作系统', value: 'Linux / Windows' },
      { label: '适用场景', value: 'Web应用、开发测试' },
    ],
    pricing: [{ plan: '基础型', price: '¥390/月起', features: ['1核2G', '40GB SSD', '1Mbps带宽'] }],
    useCases: ['个人网站', '开发测试', '小型应用'],
    imageUrl: '/images/common/通算专区/u918.svg',
    priceDisplay: '¥390/月起',
    source: '中电信',
    region: '北京',
    tags: [],
    cpuMemoryRatio: '1:2 / 1:4',
    vcpuRange: '1 ~ 160',
    baseFreq: '2.9GHz',
  },
  {
    id: 'general-005',
    categoryId: 'general',
    name: '通用计算型s6',
    title: '通用计算型s6',
    subtitle: '均衡性能与价格',
    description: '采用Intel Xeon处理器，提供均衡的计算、内存、网络资源，适用于各种Web应用。',
    features: ['性能均衡', '稳定可靠', '弹性伸缩', '易于管理'],
    specifications: [
      { label: '处理器', value: 'Intel Xeon Cascade Lake' },
      { label: '内存', value: '1GB - 128GB' },
      { label: '存储', value: 'SSD云硬盘' },
      { label: '网络', value: '千兆网络' },
      { label: '操作系统', value: 'Windows / Linux' },
      { label: '适用场景', value: 'Web应用、企业应用' },
    ],
    pricing: [{ plan: '基础型', price: '¥450/月起', features: ['1核2G', '40GB SSD', '1Mbps带宽'] }],
    useCases: ['Web应用', '企业应用', 'API服务'],
    imageUrl: '/images/common/通算专区/u918.svg',
    priceDisplay: '¥450/月起',
    source: '中电信',
    region: '上海',
    tags: [],
    cpuMemoryRatio: '1:2 / 1:4',
    vcpuRange: '1 ~ 160',
    baseFreq: '2.5GHz',
  },
  {
    id: 'general-006',
    categoryId: 'general',
    name: '内存优化型s6e',
    title: '内存优化型s6e',
    subtitle: '超大内存，适合内存型业务',
    description: '提供超大内存配置，适合内存数据库、分布式缓存等内存型业务场景。',
    features: ['超大内存', '高性能', '稳定可靠'],
    specifications: [
      { label: '处理器', value: 'Intel Xeon Cascade Lake' },
      { label: '内存', value: '1GB - 512GB' },
      { label: '存储', value: 'SSD云硬盘' },
      { label: '网络', value: '千兆网络' },
      { label: '操作系统', value: 'Linux / Windows' },
      { label: '适用场景', value: '数据库、缓存' },
    ],
    pricing: [{ plan: '基础型', price: '¥1200/月起', features: ['2核16G', '60GB SSD', '3Mbps带宽'] }],
    useCases: ['内存数据库', '分布式缓存', '大数据分析'],
    imageUrl: '/images/common/通算专区/u918.svg',
    priceDisplay: '¥1200/月起',
    source: '中电信',
    region: '广州',
    tags: [],
    cpuMemoryRatio: '1:8',
    vcpuRange: '2 ~ 32',
    baseFreq: '2.5GHz',
  },
  {
    id: 'gpu-bare-metal-001',
    categoryId: 'gpu-bare-metal',
    name: '昇腾910B4服务器',
    title: '昇腾910B4 GPU裸金属服务器',
    subtitle: '国产AI算力，高性能计算',
    description: '搭载华为昇腾910B4芯片，提供强劲的国产AI算力，无虚拟化损耗，释放全部算力。',
    features: ['无虚拟化损耗', '极致性能', 'GPU直通', '高速网络', '灵活配置', '企业级可靠性'],
    specifications: [
      { label: 'GPU型号', value: '昇腾910B4 x 2' },
      { label: 'GPU显存', value: '141GB' },
      { label: 'CPU', value: '2 * 48核' },
      { label: '内存', value: '2048GB' },
      { label: '存储', value: '2 * 2TB SSD' },
      { label: '网络', value: '25Gb/100Gb 高速网络' },
    ],
    pricing: [{ plan: '标准配置', price: '¥63000/月起', features: ['2x 910B4', '2TB SSD', '2048GB 内存'] }],
    useCases: ['深度学习训练', '科学计算', '图形渲染', '视频编解码', 'AI推理'],
    imageUrl: '/images/common/gpu裸金属/hero-bg.png',
    priceDisplay: '¥63000/月起',
    source: '中电信',
    region: '北京',
    tags: ['热销'],
  },
  {
    id: 'gpu-bare-metal-002',
    categoryId: 'gpu-bare-metal',
    name: '壁仞BR106M服务器',
    title: '壁仞科技BR106M GPU裸金属服务器',
    subtitle: '国产高性能GPU计算',
    description: '搭载壁仞科技BR106M GPU，提供强大的国产GPU算力，适用于AI训练和推理。',
    features: ['国产GPU', '高性能计算', '灵活配置', '稳定可靠'],
    specifications: [
      { label: 'GPU型号', value: '壁仞BR106M x 8' },
      { label: 'GPU显存', value: '32GB per GPU' },
      { label: 'CPU', value: '2 * 32核' },
      { label: '内存', value: '512GB' },
      { label: '存储', value: '2 * 2TB SSD' },
      { label: '网络', value: '25Gb 高速网络' },
    ],
    pricing: [{ plan: '标准配置', price: '¥20000/月起', features: ['8x BR106M', '2TB SSD', '512GB 内存'] }],
    useCases: ['AI模型训练', '图形渲染', '科学计算'],
    imageUrl: '/images/common/gpu裸金属/hero-bg.png',
    priceDisplay: '¥20000/月起',
    source: '中电信',
    region: '上海',
    tags: ['上新'],
  },
  {
    id: 'gpu-bare-metal-003',
    categoryId: 'gpu-bare-metal',
    name: 'NVIDIA A100服务器',
    title: 'NVIDIA A100 GPU裸金属服务器',
    subtitle: '顶级AI算力，企业级性能',
    description: '搭载NVIDIA A100 GPU，提供业界领先的AI算力，适合大规模AI训练和推理。',
    features: ['顶级性能', 'A100 GPU', 'NVLink互联', '企业级'],
    specifications: [
      { label: 'GPU型号', value: 'NVIDIA A100 x 8' },
      { label: 'GPU显存', value: '80GB per GPU' },
      { label: 'CPU', value: 'Intel Xeon Platinum' },
      { label: '内存', value: '1TB' },
      { label: '存储', value: 'NVMe SSD阵列' },
      { label: '网络', value: '100Gb 高速网络' },
    ],
    pricing: [{ plan: '标准配置', price: '¥120000/月起', features: ['8x A100 80GB', '4TB SSD', '1TB 内存'] }],
    useCases: ['大模型训练', '深度学习', 'AI推理', '科学计算'],
    imageUrl: '/images/common/gpu裸金属/hero-bg.png',
    priceDisplay: '¥120000/月起',
    source: '中电信',
    region: '北京',
    tags: [],
  },
  {
    id: 'gpu-bare-metal-004',
    categoryId: 'gpu-bare-metal',
    name: '摩尔线程MTT S5000服务器',
    title: '摩尔线程MTT S5000 GPU裸金属服务器',
    subtitle: '国产GPU，高性能计算',
    description: '搭载摩尔线程MTT S5000 GPU，提供强大的国产GPU算力，适用于AI推理、图形渲染等场景。',
    features: ['国产GPU', '高性能推理', '图形渲染加速', '性价比高', '稳定可靠'],
    specifications: [
      { label: 'GPU型号', value: 'MTT S5000 x 8' },
      { label: 'GPU显存', value: '32GB per GPU' },
      { label: 'CPU', value: '2 * 32核' },
      { label: '内存', value: '512GB' },
      { label: '存储', value: '2 * 2TB SSD' },
      { label: '网络', value: '25Gb 高速网络' },
    ],
    pricing: [{ plan: '标准配置', price: '¥81000/月起', features: ['8x MTT S5000', '2TB SSD', '512GB 内存'] }],
    useCases: ['AI推理服务', '图形渲染', '视频处理', '科学计算'],
    imageUrl: '/images/common/gpu裸金属/hero-bg.png',
    priceDisplay: '¥81000/月起',
    source: '中电信',
    region: '上海',
    tags: ['热销'],
  },
  {
    id: 'gpu-cloud-001',
    categoryId: 'gpu-cloud',
    name: 'NVIDIA T4 GPU云主机',
    title: 'NVIDIA T4 GPU云主机',
    subtitle: '弹性GPU计算，按需使用',
    description: '提供弹性NVIDIA T4 GPU云主机，性价比高，适合AI推理、图形渲染等场景。',
    features: ['弹性伸缩', '多种GPU规格', '按需计费', '快速部署', '便捷管理', '高可用性'],
    specifications: [
      { label: 'GPU型号', value: 'NVIDIA T4 x 1' },
      { label: 'GPU显存', value: '16GB' },
      { label: 'vCPU', value: '8核' },
      { label: '内存', value: '32GB' },
      { label: '存储', value: '100GB SSD' },
      { label: '网络', value: '5Mbps' },
    ],
    pricing: [{ plan: '按需计费', price: '¥12/小时', features: ['1x T4', '8核32G', '100GB SSD'] }],
    useCases: ['AI模型训练', 'AI推理服务', '图形渲染', '视频处理', '科学计算'],
    imageUrl: '/images/common/gpu云主机/hero-bg.png',
    priceDisplay: '¥12/小时',
    source: '中电信',
    region: '北京',
    tags: ['推荐'],
  },
  {
    id: 'gpu-cloud-002',
    categoryId: 'gpu-cloud',
    name: 'NVIDIA V100 GPU云主机',
    title: 'NVIDIA V100 GPU云主机',
    subtitle: '高性能GPU计算',
    description: '提供高性能NVIDIA V100 GPU云主机，适合深度学习训练和大规模AI推理。',
    features: ['高性能', 'V100 GPU', '按需计费', '快速部署'],
    specifications: [
      { label: 'GPU型号', value: 'NVIDIA V100 x 1' },
      { label: 'GPU显存', value: '32GB' },
      { label: 'vCPU', value: '16核' },
      { label: '内存', value: '64GB' },
      { label: '存储', value: '200GB SSD' },
      { label: '网络', value: '10Mbps' },
    ],
    pricing: [{ plan: '按需计费', price: '¥35/小时', features: ['1x V100', '16核64G', '200GB SSD'] }],
    useCases: ['深度学习训练', 'AI推理', '科学计算'],
    imageUrl: '/images/common/gpu云主机/hero-bg.png',
    priceDisplay: '¥35/小时',
    source: '中电信',
    region: '上海',
    tags: ['热销'],
  },
  {
    id: 'gpu-cloud-003',
    categoryId: 'gpu-cloud',
    name: 'NVIDIA A100 GPU云主机',
    title: 'NVIDIA A100 GPU云主机',
    subtitle: '顶级AI算力',
    description: '提供顶级NVIDIA A100 GPU云主机，适合大模型训练和高性能AI计算。',
    features: ['顶级性能', 'A100 GPU', '高速网络', '企业级'],
    specifications: [
      { label: 'GPU型号', value: 'NVIDIA A100 x 1' },
      { label: 'GPU显存', value: '80GB' },
      { label: 'vCPU', value: '32核' },
      { label: '内存', value: '128GB' },
      { label: '存储', value: '400GB SSD' },
      { label: '网络', value: '20Mbps' },
    ],
    pricing: [{ plan: '按需计费', price: '¥80/小时', features: ['1x A100 80GB', '32核128G', '400GB SSD'] }],
    useCases: ['大模型训练', '深度学习', 'AI推理'],
    imageUrl: '/images/common/gpu云主机/hero-bg.png',
    priceDisplay: '¥80/小时',
    source: '中电信',
    region: '广州',
    tags: [],
  },
  {
    id: 'gpu-cloud-004',
    categoryId: 'gpu-cloud',
    name: '昇腾910B GPU云主机',
    title: '昇腾910B GPU云主机',
    subtitle: '国产GPU云主机',
    description: '提供华为昇腾910B GPU云主机，国产AI算力，性价比高。',
    features: ['国产GPU', '性价比高', '按需计费', '稳定可靠'],
    specifications: [
      { label: 'GPU型号', value: '昇腾910B x 1' },
      { label: 'GPU显存', value: '64GB' },
      { label: 'vCPU', value: '16核' },
      { label: '内存', value: '64GB' },
      { label: '存储', value: '200GB SSD' },
      { label: '网络', value: '10Mbps' },
    ],
    pricing: [{ plan: '按需计费', price: '¥25/小时', features: ['1x 910B', '16核64G', '200GB SSD'] }],
    useCases: ['AI模型训练', 'AI推理', '科学计算'],
    imageUrl: '/images/common/gpu云主机/hero-bg.png',
    priceDisplay: '¥25/小时',
    source: '中电信',
    region: '北京',
    tags: [],
  },
  {
    id: 'appliance-001',
    categoryId: 'appliance',
    name: '智算一体机',
    title: '智算一体机',
    subtitle: '开箱即用，一体化解决方案',
    description: '提供软硬一体的智算一体机解决方案，预装AI框架和工具，开箱即用，快速部署AI业务。',
    features: ['开箱即用', '软硬件一体化', '预装AI框架', '快速部署', '易于管理', '高性价比'],
    specifications: [
      { label: 'GPU', value: 'NVIDIA GPU多卡配置' },
      { label: 'CPU', value: '高性能处理器' },
      { label: '内存', value: '大容量内存配置' },
      { label: '存储', value: '高速SSD存储' },
      { label: '软件栈', value: '预装主流AI框架' },
      { label: '管理', value: '统一管理平台' },
    ],
    useCases: ['AI训练平台', '边缘计算', '企业私有云', 'AI推理服务', '数据中台'],
    imageUrl: '/images/common/智算一体机/hero-bg.png',
    priceDisplay: '询价',
    source: '中电信',
    region: '北京',
    tags: [],
    pricing: [{ plan: '标准配置', price: '询价', features: ['多卡GPU', '高性能CPU', '大容量内存'] }],
  },
  {
    id: 'appliance-deepseek-pro',
    categoryId: 'appliance',
    name: 'DeepSeek 专业版 Pro',
    title: 'DeepSeek 专业版 Pro (单机)',
    subtitle: 'DeepSeek-R1-Distill-Qwen-32B 一体机',
    description: '针对 DeepSeek-R1-Distill-Qwen-32B 模型优化的训推一体机，单机部署，快速上手。',
    features: ['预装 DeepSeek-R1-Distill-Qwen-32B', '昇腾910B GPU', '开箱即用', '高性能推理', '本地部署', '数据安全'],
    specifications: [
      { label: 'GPU', value: '昇腾910B x 2-8卡' },
      { label: 'CPU', value: '2 * 48核' },
      { label: '内存', value: '512GB - 1TB' },
      { label: '存储', value: '2TB NVMe SSD' },
      { label: '模型', value: 'DeepSeek-R1-Distill-Qwen-32B' },
      { label: '场景', value: '推理 / 轻量训练' },
    ],
    pricing: [{ plan: '基础配置', price: '询价', features: ['2x 910B', '512GB', '2TB SSD'] }],
    useCases: ['企业私有化部署', 'AI推理服务', '内容生成', '智能客服'],
    imageUrl: '/images/common/智算一体机/deepseek.png',
    tags: ['推荐'],
  },
  {
    id: 'appliance-deepseek-ultra-dual',
    categoryId: 'appliance',
    name: 'DeepSeek 旗舰版 Ultra (双机)',
    title: 'DeepSeek 旗舰版 Ultra (双机)',
    subtitle: 'DeepSeek-R1 671B 大模型训推一体机',
    description: '针对 DeepSeek-R1 671B 大模型优化的训推一体机，双机集群，支持大模型训练和推理。',
    features: ['预装 DeepSeek-R1 671B', '昇腾910B GPU集群', '双机部署', '大模型训练', '高性能推理', '企业级'],
    specifications: [
      { label: 'GPU', value: '昇腾910B x 16-32卡' },
      { label: 'CPU', value: '4 * 48核' },
      { label: '内存', value: '2TB - 4TB' },
      { label: '存储', value: '8TB NVMe SSD阵列' },
      { label: '模型', value: 'DeepSeek-R1 671B' },
      { label: '场景', value: '训练 + 推理' },
    ],
    pricing: [{ plan: '标准配置', price: '询价', features: ['16x 910B', '2TB', '8TB SSD'] }],
    useCases: ['大模型训练', '企业级AI服务', '知识库问答', '复杂推理任务'],
    imageUrl: '/images/common/智算一体机/deepseek.png',
    tags: ['热销'],
  },
  {
    id: 'appliance-deepseek-ultra-multi',
    categoryId: 'appliance',
    name: 'DeepSeek 旗舰版 Ultra (多机)',
    title: 'DeepSeek 旗舰版 Ultra (多机)',
    subtitle: '大规模 DeepSeek 训推集群',
    description: '针对大规模 DeepSeek 模型训练和推理的多机集群方案，支持横向扩展，满足企业级需求。',
    features: ['预装 DeepSeek 全系列', '昇腾910B 大规模集群', '多机部署', '分布式训练', '超高并发', '弹性扩展'],
    specifications: [
      { label: 'GPU', value: '昇腾910B x 64卡+' },
      { label: '节点', value: '8节点+' },
      { label: '内存', value: '8TB+' },
      { label: '存储', value: 'PB级存储' },
      { label: '模型', value: 'DeepSeek 全系列' },
      { label: '场景', value: '大规模训练 + 推理' },
    ],
    pricing: [{ plan: '企业配置', price: '询价', features: ['64x 910B+', '8TB+', 'PB级存储'] }],
    useCases: ['超大规模训练', 'AI研发中心', '云服务提供商', '科研机构'],
    imageUrl: '/images/common/智算一体机/deepseek.png',
    tags: [],
  },
  {
    id: 'maas-001',
    categoryId: 'maas',
    name: 'MaaS平台',
    title: 'MaaS模型服务平台',
    subtitle: '一站式AI模型开发与部署平台',
    description: '提供从模型开发、训练、部署到推理的一站式MaaS平台，支持主流AI框架，降低AI应用门槛。',
    features: ['一站式服务', '多框架支持', '可视化开发', '自动化训练', '快速部署', '弹性扩展'],
    specifications: [
      { label: '支持框架', value: 'TensorFlow, PyTorch, MXNet等' },
      { label: '开发环境', value: 'Jupyter Notebook / VS Code' },
      { label: '训练资源', value: 'GPU集群 / 分布式训练' },
      { label: '模型管理', value: '版本管理 / 模型仓库' },
      { label: '部署方式', value: '在线推理 / 批量推理 / 边缘部署' },
      { label: '监控运维', value: '实时监控 / 日志分析' },
    ],
    useCases: ['AI模型开发', '模型训练', '模型部署', '模型推理', 'A/B测试'],
    imageUrl: '/images/common/maas__/hero-bg.png',
    priceDisplay: '询价',
    source: '中电信',
    region: '北京',
    tags: [],
    pricing: [{ plan: '标准版', price: '询价', features: ['多框架支持', 'GPU集群', '模型管理'] }],
  },
];

const categories = [
  { id: 'general', name: '通用计算', nameEn: 'General Computing' },
  { id: 'gpu-bare-metal', name: 'GPU裸金属', nameEn: 'GPU Bare Metal' },
  { id: 'gpu-cloud', name: 'GPU云主机', nameEn: 'GPU Cloud' },
  { id: 'appliance', name: '智算一体机', nameEn: 'Intelligent Appliance' },
  { id: 'maas', name: 'MaaS平台', nameEn: 'MaaS Platform' },
];

const newsData = [
  {
    type: 'POLICY' as const,
    title: '算力产业发展三年行动计划（2024-2026年）',
    summary:
      '国家发展改革委等部门联合印发算力产业发展行动计划，明确提出到2026年，算力规模超过300 EFLOPS，智能算力占比达到35%。',
    source: '国家发展改革委',
    publishDate: new Date('2024-01-15'),
    tag: '政策文件',
    displayOrder: 1,
  },
  {
    type: 'NEWS' as const,
    title: '算力超市正式上线，打造一站式算力交易平台',
    summary:
      '中电信数智科技有限公司推出算力超市平台，整合GPU裸金属、GPU云主机、智算一体机等多种算力资源，为企业提供便捷的算力采购服务。',
    source: '算力超市',
    publishDate: new Date('2024-01-10'),
    tag: '产品动态',
    displayOrder: 2,
  },
  {
    type: 'POLICY' as const,
    title: '关于加快推进算力基础设施高质量发展的实施意见',
    summary:
      '工信部发布实施意见，提出加强算力基础设施建设，优化算力资源布局，提升算力服务能力，支撑数字经济发展。',
    source: '工业和信息化部',
    publishDate: new Date('2024-01-05'),
    tag: '产业政策',
    displayOrder: 3,
  },
  {
    type: 'NEWS' as const,
    title: '国产GPU芯片实现重大突破，性能达到国际先进水平',
    summary:
      '多款国产GPU芯片在AI训练和推理性能上取得突破，算力超市率先引入昇腾、壁仞等国产GPU服务器，助力自主可控。',
    source: '科技日报',
    publishDate: new Date('2023-12-28'),
    tag: '技术前沿',
    displayOrder: 4,
  },
  {
    type: 'NEWS' as const,
    title: 'DeepSeek大模型正式入驻算力超市MaaS平台',
    summary:
      '算力超市MaaS平台引入DeepSeek系列大模型API服务，包括DeepSeek-R1等主流模型，为企业AI应用开发提供强大支撑。',
    source: '算力超市',
    publishDate: new Date('2023-12-20'),
    tag: '产品动态',
    displayOrder: 5,
  },
  {
    type: 'POLICY' as const,
    title: '数字经济发展规划（2023-2027年）',
    summary:
      '国务院印发数字经济发展规划，强调加快新型数字基础设施建设，提升算力服务供给能力，推动数字经济与实体经济深度融合。',
    source: '国务院',
    publishDate: new Date('2023-12-15'),
    tag: '国家规划',
    displayOrder: 6,
  },
  {
    type: 'NEWS' as const,
    title: '算力服务价格大幅下降，企业AI应用成本降低40%',
    summary:
      '随着国产算力资源快速发展和算力网络优化，算力服务成本持续下降，算力超市推出多项优惠措施，惠及广大中小企业。',
    source: '算力超市',
    publishDate: new Date('2023-12-10'),
    tag: '市场动态',
    displayOrder: 7,
  },
  {
    type: 'POLICY' as const,
    title: '关于促进人工智能产业发展的若干措施',
    summary:
      '多部门联合发布促进AI产业发展措施，从算力支撑、数据资源、技术创新等方面提出具体政策，推动AI产业高质量发展。',
    source: '科技部',
    publishDate: new Date('2023-12-05'),
    tag: '产业扶持',
    displayOrder: 8,
  },
];

const solutionsData = [
  {
    id: 'solutions-home',
    title: '解决方案',
    subtitle: '为各行各业提供专业的算力解决方案',
    description:
      '依托强大的算力基础设施和丰富的行业经验，为不同行业客户提供定制化的算力解决方案，助力企业数字化转型。',
    highlights: ['算力服务平台', '算力网络体系', '算力融合底座'],
    benefits: [
      { title: '专业服务', description: '7x24小时专业技术支持，快速响应客户需求' },
      { title: '灵活配置', description: '根据业务需求，灵活配置算力资源' },
      { title: '安全可靠', description: '多重安全防护，保障数据安全' },
      { title: '成本优化', description: '弹性计费模式，降低总体拥有成本' },
    ],
    features: [
      '强大的算力基础设施',
      '完善的网络架构',
      '丰富的行业经验',
      '专业的技术团队',
      '灵活的服务模式',
    ],
    displayOrder: 1,
  },
  {
    id: 'service-platform',
    title: '算力服务平台解决方案',
    subtitle: '构建高效、智能的算力服务平台',
    description:
      '提供从算力资源管理、任务调度到应用部署的全流程算力服务平台，支持多种算力类型，满足不同业务场景需求。',
    highlights: ['统一算力管理', '智能任务调度', '弹性资源分配', '全栈监控运维'],
    benefits: [
      { title: '统一管理', description: '统一管理多种算力资源，提高资源利用率' },
      { title: '智能调度', description: 'AI驱动的智能调度算法，优化任务执行效率' },
      { title: '快速部署', description: '一键部署应用，分钟级上线' },
      { title: '可视化运维', description: '全链路监控，实时掌握系统状态' },
    ],
    features: [
      '多类型算力资源统一管理',
      '智能任务调度与负载均衡',
      '弹性伸缩与资源池化',
      '应用生命周期管理',
      '完善的监控告警体系',
      '开放的API接口',
    ],
    architecture: '采用微服务架构，支持水平扩展，高可用部署',
    displayOrder: 2,
  },
  {
    id: 'network-system',
    title: '算力网络体系解决方案',
    subtitle: '构建算网融合的新型信息基础设施',
    description:
      '基于算力网络理念，构建"算力+网络"融合的新型信息基础设施，实现算力资源的高效调度和优化配置。',
    highlights: ['算网融合', '统一调度', '智能路由', '低时延保障'],
    benefits: [
      { title: '算网一体', description: '算力与网络深度融合，实现协同优化' },
      { title: '全局调度', description: '全网算力资源统一调度，资源利用率提升30%+' },
      { title: '智能选路', description: '基于AI的智能路由算法，实现最优算力分配' },
      { title: '低时延', description: '端到端时延优化，满足实时业务需求' },
    ],
    features: [
      '算力网络统一编排',
      '多维度算力感知',
      '智能算力路由',
      '端到端质量保障',
      '网络切片技术',
      'SDN智能管控',
    ],
    architecture: '采用SDN/NFV技术，构建云网边协同的算力网络架构',
    displayOrder: 3,
  },
  {
    id: 'fusion-base',
    title: '算力融合底座解决方案',
    subtitle: '打造自主可控的算力融合底座',
    description:
      '构建国产化算力融合底座，实现异构算力统一管理，支持国产芯片和操作系统，保障信息安全和产业链安全。',
    highlights: ['异构融合', '国产适配', '安全可控', '开放生态'],
    benefits: [
      { title: '异构统一', description: '统一管理GPU、CPU、NPU等多种算力' },
      { title: '国产化', description: '全面支持国产芯片和操作系统' },
      { title: '安全可靠', description: '多重安全机制，保障信息安全' },
      { title: '生态开放', description: '兼容主流AI框架，降低迁移成本' },
    ],
    features: [
      '异构算力统一编排',
      '国产芯片适配（鲲鹏、昇腾等）',
      '国产操作系统支持',
      '全栈安全防护',
      '丰富的中间件支持',
      '平滑的应用迁移',
    ],
    architecture: '采用分层解耦架构，支持灵活扩展和定制',
    displayOrder: 4,
  },
];

const navigationData = [
  { id: 'home', label: '首页', path: '/', icon: 'HomeOutlined', displayOrder: 1 },
  { id: 'general', label: '通算专区', path: '/general-computing', icon: 'CloudOutlined', displayOrder: 2 },
  {
    id: 'intelligent',
    label: '智算专区',
    path: '/intelligent-computing',
    icon: 'RocketOutlined',
    displayOrder: 3,
  },
  { id: 'solutions', label: '解决方案', path: '/solutions', icon: 'SolutionOutlined', displayOrder: 4 },
  { id: 'news', label: '政策&新闻', path: '/news', icon: 'NewsOutlined', displayOrder: 5 },
  { id: 'about', label: '关于我们', path: '/about', icon: 'InfoOutlined', displayOrder: 6 },
];

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create categories
    console.log('Creating categories...');
    for (const category of categories) {
      await prisma.category.upsert({
        where: { id: category.id },
        update: {},
        create: category,
      });
    }
    console.log(`✅ Created ${categories.length} categories`);

    // Create products
    console.log('Creating products...');
    let productCount = 0;
    for (const product of productsData) {
      await prisma.product.upsert({
        where: { id: product.id },
        update: {},
        create: {
          id: product.id,
          categoryId: product.categoryId,
          name: product.name,
          title: product.title,
          subtitle: product.subtitle,
          description: product.description,
          imageUrl: product.imageUrl,
          priceDisplay: product.priceDisplay,
          source: product.source,
          region: product.region,
          tags: product.tags || [],
          cpuMemoryRatio: product.cpuMemoryRatio,
          vcpuRange: product.vcpuRange,
          baseFreq: product.baseFreq,
          features: {
            create: product.features.map((f, i) => ({
              featureText: f,
              displayOrder: i,
            })),
          },
          specifications: {
            create: product.specifications.map((s, i) => ({
              specLabel: s.label,
              specValue: s.value,
              displayOrder: i,
            })),
          },
          ...(product.pricing && {
            pricing: {
              create: product.pricing.map((p, i) => ({
                planName: p.plan,
                price: p.price,
                features: p.features,
                displayOrder: i,
              })),
            },
          }),
          useCases: {
            create: product.useCases.map((u, i) => ({
              useCase: u,
              displayOrder: i,
            })),
          },
        },
      });
      productCount++;
    }
    console.log(`✅ Created ${productCount} products`);

    // Create news
    console.log('Creating news articles...');
    let newsCount = 0;
    for (const news of newsData) {
      await prisma.newsArticle.upsert({
        where: { id: news.type + '-' + news.displayOrder },
        update: {},
        create: {
          id: news.type + '-' + news.displayOrder,
          type: news.type,
          title: news.title,
          summary: news.summary,
          source: news.source,
          publishDate: news.publishDate,
          tag: news.tag,
          isPublished: true,
          displayOrder: news.displayOrder,
        },
      });
      newsCount++;
    }
    console.log(`✅ Created ${newsCount} news articles`);

    // Create solutions
    console.log('Creating solutions...');
    let solutionCount = 0;
    for (const solution of solutionsData) {
      await prisma.solution.upsert({
        where: { id: solution.id },
        update: {},
        create: {
          id: solution.id,
          title: solution.title,
          subtitle: solution.subtitle,
          description: solution.description,
          highlights: solution.highlights,
          architecture: solution.architecture,
          features: solution.features,
          benefits: {
            create: solution.benefits.map((b, i) => ({
              benefitTitle: b.title,
              benefitDescription: b.description,
              displayOrder: i,
            })),
          },
        },
      });
      solutionCount++;
    }
    console.log(`✅ Created ${solutionCount} solutions`);

    // Create navigation
    console.log('Creating navigation items...');
    let navCount = 0;
    for (const nav of navigationData) {
      await prisma.navigationItem.upsert({
        where: { id: nav.id },
        update: {},
        create: nav,
      });
      navCount++;
    }
    console.log(`✅ Created ${navCount} navigation items`);

    console.log('\n✨ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
