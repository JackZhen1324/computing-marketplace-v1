import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getQuickStats = async (req: Request, res: Response) => {
  try {
    const timeRange = req.query.timeRange as string || 'all';

    // 计算时间范围
    const now = new Date();
    let startDate = new Date('2000-01-01');

    if (timeRange === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (timeRange === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === 'month') {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // 获取当前周期的统计数据
    const totalInquiries = await prisma.inquiry.count({
      where: {
        createdAt: { gte: startDate },
      },
    });

    const pendingTasks = await prisma.inquiry.count({
      where: {
        status: 'PENDING',
        createdAt: { gte: startDate },
      },
    });

    const closedDeals = await prisma.inquiry.count({
      where: {
        status: 'CLOSED',
        createdAt: { gte: startDate },
      },
    });

    const conversionRate = totalInquiries > 0
      ? Number(((closedDeals / totalInquiries) * 100).toFixed(1))
      : 0;

    const activeProducts = await prisma.product.count({
      where: { isActive: true },
    });

    // 计算环比变化（与上一个周期对比）
    let inquiriesChange = 0;
    let tasksChange = 0;
    let conversionChange = 0;

    if (timeRange !== 'all') {
      const periodLength = now.getTime() - startDate.getTime();
      const prevStartDate = new Date(startDate.getTime() - periodLength);
      const prevEndDate = new Date(startDate.getTime());

      const prevTotal = await prisma.inquiry.count({
        where: {
          createdAt: {
            gte: prevStartDate,
            lt: prevEndDate,
          },
        },
      });

      const prevPending = await prisma.inquiry.count({
        where: {
          status: 'PENDING',
          createdAt: {
            gte: prevStartDate,
            lt: prevEndDate,
          },
        },
      });

      const prevClosed = await prisma.inquiry.count({
        where: {
          status: 'CLOSED',
          createdAt: {
            gte: prevStartDate,
            lt: prevEndDate,
          },
        },
      });

      const prevConversionRate = prevTotal > 0
        ? (prevClosed / prevTotal) * 100
        : 0;

      inquiriesChange = prevTotal > 0
        ? Number((((totalInquiries - prevTotal) / prevTotal) * 100).toFixed(1))
        : 0;

      tasksChange = prevPending > 0
        ? Number((((pendingTasks - prevPending) / prevPending) * 100).toFixed(1))
        : 0;

      conversionChange = prevConversionRate > 0
        ? Number((((conversionRate - prevConversionRate) / prevConversionRate) * 100).toFixed(1))
        : 0;
    }

    res.json({
      quickStats: {
        totalInquiries,
        pendingTasks,
        conversionRate,
        activeProducts,
        trends: {
          inquiriesChange,
          tasksChange,
          conversionChange,
        },
      },
    });
  } catch (error) {
    console.error('Failed to fetch quick stats:', error);
    res.status(500).json({ error: 'Failed to fetch quick stats' });
  }
};

export const getConversionData = async (req: Request, res: Response) => {
  try {
    const timeRange = req.query.timeRange as string || 'all';

    // 计算时间范围
    const now = new Date();
    let startDate = new Date('2000-01-01');

    if (timeRange === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (timeRange === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === 'month') {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // 获取各阶段数据
    const totalInquiries = await prisma.inquiry.count({
      where: { createdAt: { gte: startDate } },
    });

    const contacted = await prisma.inquiry.count({
      where: {
        status: { in: ['CONTACTED', 'NEGOTIATING', 'CLOSED'] },
        createdAt: { gte: startDate },
      },
    });

    const negotiating = await prisma.inquiry.count({
      where: {
        status: { in: ['NEGOTIATING', 'CLOSED'] },
        createdAt: { gte: startDate },
      },
    });

    const closed = await prisma.inquiry.count({
      where: {
        status: 'CLOSED',
        createdAt: { gte: startDate },
      },
    });

    const funnel = [
      {
        stage: '总咨询',
        count: totalInquiries,
        conversionRate: 100,
      },
      {
        stage: '已联系',
        count: contacted,
        conversionRate: totalInquiries > 0 ? Number(((contacted / totalInquiries) * 100).toFixed(1)) : 0,
      },
      {
        stage: '洽谈中',
        count: negotiating,
        conversionRate: totalInquiries > 0 ? Number(((negotiating / totalInquiries) * 100).toFixed(1)) : 0,
      },
      {
        stage: '已成交',
        count: closed,
        conversionRate: totalInquiries > 0 ? Number(((closed / totalInquiries) * 100).toFixed(1)) : 0,
      },
    ];

    res.json({ funnel });
  } catch (error) {
    console.error('Failed to fetch conversion data:', error);
    res.status(500).json({ error: 'Failed to fetch conversion data' });
  }
};

export const getTrendData = async (req: Request, res: Response) => {
  try {
    const granularity = req.query.granularity as string || 'daily';

    // 计算时间范围
    const now = new Date();
    let startDate = new Date();
    let groupBy: string;

    if (granularity === 'daily') {
      startDate.setDate(now.getDate() - 30);
      groupBy = 'day';
    } else if (granularity === 'weekly') {
      startDate.setDate(now.getDate() - 90);
      groupBy = 'week';
    } else {
      startDate.setMonth(now.getMonth() - 12);
      groupBy = 'month';
    }

    // 获取趋势数据
    const inquiries = await prisma.inquiry.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // 按时间粒度分组
    const trendMap = new Map<string, { inquiries: number; conversions: number }>();

    inquiries.forEach((inquiry) => {
      const date = new Date(inquiry.createdAt);
      let key: string;

      if (granularity === 'daily') {
        key = date.toISOString().split('T')[0];
      } else if (granularity === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!trendMap.has(key)) {
        trendMap.set(key, { inquiries: 0, conversions: 0 });
      }

      const data = trendMap.get(key)!;
      data.inquiries++;
      if (inquiry.status === 'CLOSED') {
        data.conversions++;
      }
    });

    // 转换为数组
    const trendData = Array.from(trendMap.entries()).map(([date, data]) => ({
      date,
      inquiries: data.inquiries,
      conversions: data.conversions,
    }));

    res.json({
      daily: granularity === 'daily' ? trendData : [],
      weekly: granularity === 'weekly' ? trendData : [],
      monthly: granularity === 'monthly' ? trendData : [],
    });
  } catch (error) {
    console.error('Failed to fetch trend data:', error);
    res.status(500).json({ error: 'Failed to fetch trend data' });
  }
};

export const getProductRanking = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const timeRange = req.query.timeRange as string || 'all';

    // 计算时间范围
    const now = new Date();
    let startDate = new Date('2000-01-01');

    if (timeRange === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (timeRange === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === 'month') {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // 获取产品询价统计
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        inquiries: {
          where: {
            createdAt: { gte: startDate },
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    // 计算统计数据
    const productStats = products
      .map((product) => ({
        productId: product.id,
        productName: product.name,
        inquiryCount: product.inquiries.length,
        conversionCount: product.inquiries.filter((i) => i.status === 'CLOSED').length,
        conversionRate:
          product.inquiries.length > 0
            ? Number(((product.inquiries.filter((i) => i.status === 'CLOSED').length / product.inquiries.length) * 100).toFixed(1))
            : 0,
      }))
      .filter((p) => p.inquiryCount > 0)
      .sort((a, b) => b.inquiryCount - a.inquiryCount)
      .slice(0, limit);

    res.json({ topProducts: productStats });
  } catch (error) {
    console.error('Failed to fetch product ranking:', error);
    res.status(500).json({ error: 'Failed to fetch product ranking' });
  }
};

export const getPendingTasks = async (req: Request, res: Response) => {
  try {
    const timeRange = req.query.timeRange as string || 'all';
    const sortBy = req.query.sortBy as string || 'date';

    // 计算时间范围
    const now = new Date();
    let startDate = new Date('2000-01-01');

    if (timeRange === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (timeRange === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === 'month') {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // 获取待处理任务
    const tasks = await prisma.inquiry.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { in: ['PENDING', 'CONTACTED', 'NEGOTIATING', 'CLOSED'] },
      },
      select: {
        id: true,
        companyName: true,
        customerName: true,
        productName: true,
        priority: true,
        status: true,
        createdAt: true,
        contactPhone: true,
      },
      orderBy:
        sortBy === 'priority'
          ? [{ priority: 'desc' }, { createdAt: 'desc' }]
          : sortBy === 'status'
          ? [{ status: 'asc' }, { createdAt: 'desc' }]
          : { createdAt: 'desc' },
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Failed to fetch pending tasks:', error);
    res.status(500).json({ error: 'Failed to fetch pending tasks' });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.inquiry.update({
      where: { id: id as string },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    console.error('Failed to update task status:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
};
