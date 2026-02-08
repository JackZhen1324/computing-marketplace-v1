/**
 * 产品类别咨询表单配置
 * 为不同产品类型定义差异化的表单字段和选项
 */

export interface FormFieldOption {
  label: string;
  value: string;
  icon?: string;
}

export interface FormFieldConfig {
  label: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  validation?: {
    pattern?: RegExp;
    message?: string;
  };
  defaultValue?: any;
  icon?: string;
}

export interface CategoryFormConfig {
  title: string;
  description: string;
  fields: FormFieldConfig[];
}

/**
 * 产品类别与表单配置映射
 */
export const categoryFormConfigs: Record<string, CategoryFormConfig> = {
  // GPU裸金属服务器
  'gpu-bare-metal': {
    title: 'GPU裸金属服务器咨询',
    description: '请填写您的需求，我们将为您提供专属算力解决方案',
    fields: [
      {
        label: '意向GPU型号',
        name: 'gpuModel',
        type: 'select',
        required: true,
        placeholder: '请选择GPU型号',
        options: [
          { label: 'NVIDIA H100', value: 'H100' },
          { label: 'NVIDIA A100', value: 'A100' },
          { label: 'NVIDIA H800', value: 'H800' },
          { label: 'NVIDIA A800', value: 'A800' },
          { label: 'NVIDIA V100', value: 'V100' },
          { label: 'NVIDIA 4090', value: '4090' },
          { label: 'NVIDIA 5090', value: '5090' },
          { label: '华为昇腾910', value: 'Ascend910' },
          { label: '寒武纪MLU', value: 'MLU' },
        ],
      },
      {
        label: 'GPU数量',
        name: 'gpuCount',
        type: 'select',
        required: true,
        placeholder: '请选择GPU数量',
        options: [
          { label: '1卡', value: '1' },
          { label: '2卡', value: '2' },
          { label: '4卡', value: '4' },
          { label: '8卡', value: '8' },
          { label: '16卡', value: '16' },
          { label: '32卡及以上', value: '32+' },
        ],
      },
      {
        label: '租赁时长',
        name: 'duration',
        type: 'select',
        required: true,
        placeholder: '请选择租赁时长',
        options: [
          { label: '按小时计费', value: 'hourly' },
          { label: '1-3个月', value: '1-3m' },
          { label: '3-6个月', value: '3-6m' },
          { label: '6-12个月', value: '6-12m' },
          { label: '1年以上', value: '1y+' },
        ],
      },
      {
        label: '应用场景',
        name: 'useCase',
        type: 'select',
        required: true,
        placeholder: '请选择应用场景',
        options: [
          { label: '大模型训练', value: 'llm-training' },
          { label: '深度学习', value: 'deep-learning' },
          { label: '科学计算', value: 'scientific-computing' },
          { label: '图形渲染', value: 'rendering' },
          { label: 'AI推理', value: 'inference' },
          { label: '其他', value: 'other' },
        ],
      },
      {
        label: '特殊需求',
        name: 'specialRequirements',
        type: 'textarea',
        placeholder: '请描述您的特殊需求（如：网络带宽、存储、环境配置等）',
      },
    ],
  },

  // GPU云主机
  'gpu-cloud': {
    title: 'GPU云主机咨询',
    description: '弹性GPU云服务，按需使用，灵活配置',
    fields: [
      {
        label: 'GPU型号',
        name: 'gpuModel',
        type: 'select',
        required: true,
        placeholder: '请选择GPU型号',
        options: [
          { label: 'NVIDIA T4', value: 'T4' },
          { label: 'NVIDIA A10', value: 'A10' },
          { label: 'NVIDIA A30', value: 'A30' },
          { label: 'NVIDIA V100', value: 'V100' },
          { label: 'NVIDIA 4090', value: '4090' },
        ],
      },
      {
        label: 'vCPU核数',
        name: 'vcpu',
        type: 'select',
        required: true,
        placeholder: '请选择vCPU核数',
        options: [
          { label: '4核', value: '4' },
          { label: '8核', value: '8' },
          { label: '16核', value: '16' },
          { label: '32核', value: '32' },
          { label: '64核', value: '64' },
          { label: '96核', value: '96' },
        ],
      },
      {
        label: '内存大小',
        name: 'memory',
        type: 'select',
        required: true,
        placeholder: '请选择内存大小',
        options: [
          { label: '16GB', value: '16GB' },
          { label: '32GB', value: '32GB' },
          { label: '64GB', value: '64GB' },
          { label: '128GB', value: '128GB' },
          { label: '256GB', value: '256GB' },
          { label: '512GB', value: '512GB' },
        ],
      },
      {
        label: '系统盘类型',
        name: 'storageType',
        type: 'radio',
        defaultValue: 'ssd',
        options: [
          { label: 'SSD云硬盘', value: 'ssd' },
          { label: '高性能NVMe SSD', value: 'nvme' },
        ],
      },
    ],
  },

  // 智算一体机
  'appliance': {
    title: '智算一体机咨询',
    description: '开箱即用的AI算力一体化解决方案',
    fields: [
      {
        label: '产品类型',
        name: 'applianceType',
        type: 'select',
        required: true,
        placeholder: '请选择产品类型',
        options: [
          { label: '训练一体机', value: 'training' },
          { label: '推理一体机', value: 'inference' },
          { label: '训推一体机', value: 'training-inference' },
          { label: '边缘计算一体机', value: 'edge' },
        ],
      },
      {
        label: '算力规模',
        name: 'computeScale',
        type: 'select',
        required: true,
        placeholder: '请选择算力规模',
        options: [
          { label: '入门级 (100 TFLOPS)', value: 'entry' },
          { label: '标准级 (500 TFLOPS)', value: 'standard' },
          { label: '性能级 (1 PFLOPS)', value: 'performance' },
          { label: '企业级 (10+ PFLOPS)', value: 'enterprise' },
        ],
      },
      {
        label: '部署环境',
        name: 'deploymentEnv',
        type: 'select',
        required: true,
        placeholder: '请选择部署环境',
        options: [
          { label: '数据中心', value: 'datacenter' },
          { label: '机房托管', value: 'hosting' },
          { label: '企业内部', value: 'on-premise' },
          { label: '边缘节点', value: 'edge' },
        ],
      },
      {
        label: '软件栈需求',
        name: 'softwareStack',
        type: 'checkbox',
        options: [
          { label: 'AI框架 (TensorFlow/PyTorch)', value: 'ai-framework' },
          { label: '容器编排 (Kubernetes)', value: 'k8s' },
          { label: 'MLOps平台', value: 'mlops' },
          { label: '模型管理', value: 'model-management' },
          { label: '任务调度', value: 'job-scheduler' },
        ],
      },
    ],
  },

  // MaaS平台
  'maas': {
    title: 'MaaS平台咨询',
    description: '模型即服务平台，快速部署和调用AI模型',
    fields: [
      {
        label: '服务类型',
        name: 'serviceType',
        type: 'checkbox',
        required: true,
        options: [
          { label: '模型推理API', value: 'inference-api' },
          { label: '模型微调', value: 'fine-tuning' },
          { label: '模型训练', value: 'training' },
          { label: '私有化部署', value: 'private-deployment' },
        ],
      },
      {
        label: '基础模型',
        name: 'baseModel',
        type: 'select',
        placeholder: '请选择基础模型',
        options: [
          { label: 'GPT系列', value: 'gpt' },
          { label: 'LLaMA系列', value: 'llama' },
          { label: 'ChatGLM', value: 'chatglm' },
          { label: '文心一言', value: 'ernie' },
          { label: '通义千问', value: 'qwen' },
          { label: 'Stable Diffusion', value: 'sd' },
          { label: '其他', value: 'other' },
        ],
      },
      {
        label: '预计调用量 (QPS)',
        name: 'expectedQPS',
        type: 'select',
        placeholder: '请选择预计调用量',
        options: [
          { label: '10以下', value: '<10' },
          { label: '10-50', value: '10-50' },
          { label: '50-200', value: '50-200' },
          { label: '200以上', value: '200+' },
        ],
      },
      {
        label: '数据安全要求',
        name: 'securityLevel',
        type: 'radio',
        defaultValue: 'standard',
        options: [
          { label: '标准', value: 'standard' },
          { label: '私有化部署', value: 'private' },
          { label: '专有云部署', value: 'dedicated' },
        ],
      },
    ],
  },

  // 通用计算
  'general': {
    title: '通用计算云主机咨询',
    description: '稳定可靠的弹性计算服务',
    fields: [
      {
        label: '实例规格',
        name: 'instanceType',
        type: 'select',
        required: true,
        placeholder: '请选择实例规格',
        options: [
          { label: '通用型 (1-4核)', value: 'general-small' },
          { label: '通用型 (4-16核)', value: 'general-medium' },
          { label: '通用型 (16-64核)', value: 'general-large' },
          { label: '内存优化型', value: 'memory-optimized' },
          { label: '计算优化型', value: 'compute-optimized' },
          { label: '存储优化型', value: 'storage-optimized' },
        ],
      },
      {
        label: 'vCPU核数',
        name: 'vcpu',
        type: 'select',
        placeholder: '请选择vCPU核数',
        options: [
          { label: '1核', value: '1' },
          { label: '2核', value: '2' },
          { label: '4核', value: '4' },
          { label: '8核', value: '8' },
          { label: '16核', value: '16' },
          { label: '32核', value: '32' },
          { label: '64核', value: '64' },
          { label: '128核', value: '128' },
        ],
      },
      {
        label: '内存大小',
        name: 'memory',
        type: 'select',
        placeholder: '请选择内存大小',
        options: [
          { label: '1GB', value: '1GB' },
          { label: '2GB', value: '2GB' },
          { label: '4GB', value: '4GB' },
          { label: '8GB', value: '8GB' },
          { label: '16GB', value: '16GB' },
          { label: '32GB', value: '32GB' },
          { label: '64GB', value: '64GB' },
          { label: '128GB', value: '128GB' },
        ],
      },
      {
        label: '磁盘类型',
        name: 'diskType',
        type: 'radio',
        defaultValue: 'ssd',
        options: [
          { label: 'SSD云硬盘', value: 'ssd' },
          { label: '高效云硬盘', value: 'high-efficiency' },
        ],
      },
      {
        label: '带宽配置',
        name: 'bandwidth',
        type: 'select',
        placeholder: '请选择带宽',
        options: [
          { label: '1Mbps', value: '1Mbps' },
          { label: '3Mbps', value: '3Mbps' },
          { label: '5Mbps', value: '5Mbps' },
          { label: '10Mbps', value: '10Mbps' },
          { label: '20Mbps及以上', value: '20Mbps+' },
        ],
      },
    ],
  },

  // 存储服务
  'storage': {
    title: '存储服务咨询',
    description: '安全可靠的云存储解决方案',
    fields: [
      {
        label: '存储类型',
        name: 'storageType',
        type: 'checkbox',
        required: true,
        options: [
          { label: '对象存储 (OSS)', value: 'oss' },
          { label: '块存储 (EBS)', value: 'ebs' },
          { label: '文件存储 (NAS)', value: 'nas' },
        ],
      },
      {
        label: '存储容量',
        name: 'storageCapacity',
        type: 'select',
        required: true,
        placeholder: '请选择存储容量',
        options: [
          { label: '1TB以下', value: '<1TB' },
          { label: '1TB - 10TB', value: '1-10TB' },
          { label: '10TB - 100TB', value: '10-100TB' },
          { label: '100TB以上', value: '100TB+' },
        ],
      },
      {
        label: '性能要求',
        name: 'performance',
        type: 'radio',
        defaultValue: 'standard',
        options: [
          { label: '标准性能', value: 'standard' },
          { label: '高性能', value: 'high-performance' },
          { label: '极速型', value: 'ultra' },
        ],
      },
    ],
  },

  // 网络服务
  'network': {
    title: '网络服务咨询',
    description: '灵活配置的网络解决方案',
    fields: [
      {
        label: '服务类型',
        name: 'networkService',
        type: 'checkbox',
        required: true,
        options: [
          { label: '负载均衡', value: 'lb' },
          { label: 'NAT网关', value: 'nat' },
          { label: '弹性公网IP', value: 'eip' },
          { label: 'VPN连接', value: 'vpn' },
          { label: '专线接入', value: 'direct-connect' },
        ],
      },
      {
        label: '带宽需求',
        name: 'bandwidth',
        type: 'select',
        placeholder: '请选择带宽',
        options: [
          { label: '10Mbps以下', value: '<10Mbps' },
          { label: '10Mbps - 100Mbps', value: '10-100Mbps' },
          { label: '100Mbps - 1Gbps', value: '100M-1G' },
          { label: '1Gbps以上', value: '1G+' },
        ],
      },
    ],
  },
};

/**
 * 获取产品类别的表单配置
 */
export const getCategoryFormConfig = (category: string): CategoryFormConfig => {
  return categoryFormConfigs[category] || categoryFormConfigs['general'];
};

/**
 * 根据产品ID获取类别
 */
export const getCategoryFromProductId = (productId: string): string => {
  if (productId.startsWith('gpu-bare-metal')) return 'gpu-bare-metal';
  if (productId.startsWith('gpu-cloud')) return 'gpu-cloud';
  if (productId.startsWith('appliance') || productId.startsWith('a100')) return 'appliance';
  if (productId.startsWith('maas')) return 'maas';
  if (productId.startsWith('general')) return 'general';
  if (productId.includes('storage') || productId.includes('nas') || productId.includes('oss')) return 'storage';
  if (productId.includes('nat') || productId.includes('lb') || productId.includes('eip')) return 'network';
  return 'general'; // 默认
};
