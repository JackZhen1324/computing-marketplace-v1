export interface Benefit {
  title: string;
  description: string;
  icon?: string;
}

export interface Solution {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  benefits: Benefit[];
  architecture?: string;
  features: string[];
  image: string;
}

export const solutionsData: Solution[] = [
  // 解决方案首页
  {
    id: 'solutions-home',
    title: '解决方案',
    subtitle: '为各行各业提供专业的算力解决方案',
    description: '依托强大的算力基础设施和丰富的行业经验，为不同行业客户提供定制化的算力解决方案，助力企业数字化转型。',
    highlights: [
      '算力服务平台',
      '算力网络体系',
      '算力融合底座',
    ],
    benefits: [
      {
        title: '专业服务',
        description: '7x24小时专业技术支持，快速响应客户需求',
      },
      {
        title: '灵活配置',
        description: '根据业务需求，灵活配置算力资源',
      },
      {
        title: '安全可靠',
        description: '多重安全防护，保障数据安全',
      },
      {
        title: '成本优化',
        description: '弹性计费模式，降低总体拥有成本',
      },
    ],
    features: [
      '强大的算力基础设施',
      '完善的网络架构',
      '丰富的行业经验',
      '专业的技术团队',
      '灵活的服务模式',
    ],
    image: '/images/common/解决方案首页/hero-bg.png',
  },
  // 算力服务平台
  {
    id: 'service-platform',
    title: '算力服务平台解决方案',
    subtitle: '构建高效、智能的算力服务平台',
    description: '提供从算力资源管理、任务调度到应用部署的全流程算力服务平台，支持多种算力类型，满足不同业务场景需求。',
    highlights: [
      '统一算力管理',
      '智能任务调度',
      '弹性资源分配',
      '全栈监控运维',
    ],
    benefits: [
      {
        title: '统一管理',
        description: '统一管理多种算力资源，提高资源利用率',
      },
      {
        title: '智能调度',
        description: 'AI驱动的智能调度算法，优化任务执行效率',
      },
      {
        title: '快速部署',
        description: '一键部署应用，分钟级上线',
      },
      {
        title: '可视化运维',
        description: '全链路监控，实时掌握系统状态',
      },
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
    image: '/images/common/解决方案-算力服务平台/hero-bg.png',
  },
  // 算力网络体系
  {
    id: 'network-system',
    title: '算力网络体系解决方案',
    subtitle: '构建算网融合的新型信息基础设施',
    description: '基于算力网络理念，构建"算力+网络"融合的新型信息基础设施，实现算力资源的高效调度和优化配置。',
    highlights: [
      '算网融合',
      '统一调度',
      '智能路由',
      '低时延保障',
    ],
    benefits: [
      {
        title: '算网一体',
        description: '算力与网络深度融合，实现协同优化',
      },
      {
        title: '全局调度',
        description: '全网算力资源统一调度，资源利用率提升30%+',
      },
      {
        title: '智能选路',
        description: '基于AI的智能路由算法，实现最优算力分配',
      },
      {
        title: '低时延',
        description: '端到端时延优化，满足实时业务需求',
      },
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
    image: '/images/common/解决方案-算力网络体系/hero-bg.png',
  },
  // 算力融合底座
  {
    id: 'fusion-base',
    title: '算力融合底座解决方案',
    subtitle: '打造自主可控的算力融合底座',
    description: '构建国产化算力融合底座，实现异构算力统一管理，支持国产芯片和操作系统，保障信息安全和产业链安全。',
    highlights: [
      '异构融合',
      '国产适配',
      '安全可控',
      '开放生态',
    ],
    benefits: [
      {
        title: '异构统一',
        description: '统一管理GPU、CPU、NPU等多种算力',
      },
      {
        title: '国产化',
        description: '全面支持国产芯片和操作系统',
      },
      {
        title: '安全可靠',
        description: '多重安全机制，保障信息安全',
      },
      {
        title: '生态开放',
        description: '兼容主流AI框架，降低迁移成本',
      },
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
    image: '/images/common/解决方案-算力融合底座/hero-bg.png',
  },
];

export const getSolutionById = (id: string): Solution | undefined => {
  return solutionsData.find(s => s.id === id);
};
