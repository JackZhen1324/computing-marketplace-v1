import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting extra data seed...');

  try {
    // Create default admin user
    console.log('Creating default admin user...');
    const adminPassword = await bcrypt.hash('Admin@123', 10);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@computing-marketplace.com' },
      update: {},
      create: {
        email: 'admin@computing-marketplace.com',
        passwordHash: adminPassword,
        fullName: '系统管理员',
        role: 'ADMIN',
        isActive: true,
        emailVerified: true,
        phone: '13800138000',
        companyName: '中电信数智科技有限公司',
      },
    });
    console.log(`✅ Admin user created: ${admin.email} / Admin@123`);

    // Create test customer user
    console.log('Creating test customer user...');
    const customerPassword = await bcrypt.hash('Customer@123', 10);

    const customer = await prisma.user.upsert({
      where: { email: 'customer@example.com' },
      update: {},
      create: {
        email: 'customer@example.com',
        passwordHash: customerPassword,
        fullName: '测试客户',
        role: 'CUSTOMER',
        isActive: true,
        emailVerified: true,
        phone: '13900139000',
        companyName: '测试科技有限公司',
      },
    });
    console.log(`✅ Customer user created: ${customer.email} / Customer@123`);

    // Create sample inquiries
    console.log('Creating sample inquiries...');

    const inquiry1 = await prisma.inquiry.upsert({
      where: { id: 'inquiry-sample-001' },
      update: {},
      create: {
        id: 'inquiry-sample-001',
        productId: 'gpu-bare-metal-001',
        productName: '昇腾910B4服务器',
        productCategory: 'gpu-bare-metal',
        customerName: '张三',
        contactPhone: '13800138001',
        email: 'zhangsan@example.com',
        companyName: 'AI科技有限公司',
        interestedProducts: ['昇腾910B4服务器', '壁仞BR106M服务器'],
        specification: '我们需要采购10台用于大模型训练',
        status: 'PENDING',
        priority: 'HIGH',
        createdById: admin.id,
      },
    });

    const inquiry2 = await prisma.inquiry.upsert({
      where: { id: 'inquiry-sample-002' },
      update: {},
      create: {
        id: 'inquiry-sample-002',
        productId: 'appliance-deepseek-pro',
        productName: 'DeepSeek 专业版 Pro',
        productCategory: 'appliance',
        customerName: '李四',
        contactPhone: '13800138002',
        email: 'lisi@example.com',
        companyName: '智能应用研发中心',
        interestedProducts: ['DeepSeek 专业版 Pro', 'DeepSeek 旗舰版 Ultra'],
        specification: '需要部署私有化DeepSeek环境',
        status: 'CONTACTED',
        priority: 'MEDIUM',
        notes: '客户已经多次咨询，有采购意向',
        assigneeId: admin.id,
        createdById: admin.id,
      },
    });

    const inquiry3 = await prisma.inquiry.upsert({
      where: { id: 'inquiry-sample-003' },
      update: {},
      create: {
        id: 'inquiry-sample-003',
        productId: 'general-001',
        productName: '鲲鹏通用计算型kC2',
        productCategory: 'general',
        customerName: '王五',
        contactPhone: '13800138003',
        email: 'wangwu@example.com',
        companyName: '云服务创业公司',
        interestedProducts: ['鲲鹏通用计算型kC2', '通用计算型s6'],
        specification: '需要用于Web应用部署',
        status: 'NEGOTIATING',
        priority: 'LOW',
        createdById: admin.id,
        assigneeId: admin.id,
      },
    });

    console.log(`✅ Created 3 sample inquiries`);

    // Create sample orders
    console.log('Creating sample orders...');

    const order1 = await prisma.order.upsert({
      where: { orderNumber: 'ORD-2024-001' },
      update: {},
      create: {
        orderNumber: 'ORD-2024-001',
        customerId: customer.id,
        inquiryId: inquiry1.id,
        productId: 'gpu-bare-metal-001',
        productName: '昇腾910B4服务器',
        quantity: 10,
        unitPrice: 63000,
        totalPrice: 630000,
        currency: 'CNY',
        status: 'CONFIRMED',
        billingCycle: 'yearly',
        contractStartDate: new Date('2024-02-01'),
        contractEndDate: new Date('2025-02-01'),
        notes: '年度合同，包含技术支持服务',
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order1.id,
        productId: 'gpu-bare-metal-001',
        productName: '昇腾910B4服务器',
        quantity: 10,
        unitPrice: 63000,
        totalPrice: 630000,
        specifications: { config: '2x 910B4', support: 'included' },
      },
    });

    const order2 = await prisma.order.upsert({
      where: { orderNumber: 'ORD-2024-002' },
      update: {},
      create: {
        orderNumber: 'ORD-2024-002',
        customerId: customer.id,
        productId: 'gpu-cloud-001',
        productName: 'NVIDIA T4 GPU云主机',
        quantity: 1,
        unitPrice: 12,
        totalPrice: 12,
        currency: 'CNY',
        status: 'IN_PROGRESS',
        billingCycle: 'on_demand',
        notes: '按需计费测试订单',
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order2.id,
        productId: 'gpu-cloud-001',
        productName: 'NVIDIA T4 GPU云主机',
        quantity: 1,
        unitPrice: 12,
        totalPrice: 12,
        specifications: { plan: '按需计费', gpu: '1x T4' },
      },
    });

    console.log(`✅ Created 2 sample orders`);

    // Create activity logs
    console.log('Creating activity logs...');

    await prisma.activityLog.createMany({
      data: [
        {
          userId: admin.id,
          action: 'inquiry_created',
          entityType: 'inquiry',
          entityId: inquiry1.id,
          changes: { status: 'created', priority: 'HIGH' },
        },
        {
          userId: admin.id,
          action: 'order_created',
          entityType: 'order',
          entityId: order1.id,
          changes: { value: 630000, status: 'CONFIRMED' },
        },
        {
          userId: admin.id,
          action: 'inquiry_updated',
          entityType: 'inquiry',
          entityId: inquiry2.id,
          changes: { from: 'PENDING', to: 'CONTACTED' },
        },
      ],
    });
    console.log(`✅ Created 3 activity logs`);

    // Create additional navigation items (sub-navigation)
    console.log('Creating additional navigation items...');

    await prisma.navigationItem.upsert({
      where: { id: 'gpu-bare-metal' },
      update: {},
      create: {
        id: 'gpu-bare-metal',
        label: 'GPU裸金属',
        path: '/intelligent-computing/gpu-bare-metal',
        parentId: 'intelligent',
        icon: 'HddOutlined',
        displayOrder: 1,
      },
    });

    await prisma.navigationItem.upsert({
      where: { id: 'gpu-cloud' },
      update: {},
      create: {
        id: 'gpu-cloud',
        label: 'GPU云主机',
        path: '/intelligent-computing/gpu-cloud',
        parentId: 'intelligent',
        icon: 'CloudOutlined',
        displayOrder: 2,
      },
    });

    await prisma.navigationItem.upsert({
      where: { id: 'appliance' },
      update: {},
      create: {
        id: 'appliance',
        label: '智算一体机',
        path: '/intelligent-computing/appliance',
        parentId: 'intelligent',
        icon: 'AppstoreOutlined',
        displayOrder: 3,
      },
    });

    await prisma.navigationItem.upsert({
      where: { id: 'maas' },
      update: {},
      create: {
        id: 'maas',
        label: 'MaaS平台',
        path: '/intelligent-computing/maas',
        parentId: 'intelligent',
        icon: 'ApiOutlined',
        displayOrder: 4,
      },
    });

    console.log(`✅ Created 4 sub-navigation items`);

    console.log('\n✨ Extra data seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin: admin@computing-marketplace.com / Admin@123');
    console.log('   Customer: customer@example.com / Customer@123');
  } catch (error) {
    console.error('❌ Error seeding extra data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
