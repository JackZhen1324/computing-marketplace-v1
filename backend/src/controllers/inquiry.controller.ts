import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export class InquiryController {
  async getAllInquiries(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, priority, search } = req.query;
      const user = req.user!;

      const where: any = {};

      // Customers can only see their own inquiries
      if (user.role === 'CUSTOMER') {
        // For demo purposes, allow customers to see all (in real app, filter by user)
        // where.createdById = user.userId;
      }

      if (status) {
        where.status = status;
      }

      if (priority) {
        where.priority = priority;
      }

      if (search) {
        where.OR = [
          { customerName: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
          { productName: { contains: search, mode: 'insensitive' } },
        ];
      }

      const inquiries = await prisma.inquiry.findMany({
        where,
        include: {
          product: true,
          createdBy: { select: { id: true, fullName: true, email: true } },
          assignedTo: { select: { id: true, fullName: true, email: true } },
          orders: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: inquiries,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInquiryById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const inquiry = await prisma.inquiry.findUnique({
        where: { id },
        include: {
          product: true,
          createdBy: { select: { id: true, fullName: true, email: true } },
          assignedTo: { select: { id: true, fullName: true, email: true } },
          orders: true,
        },
      });

      if (!inquiry) {
        throw new AppError('Inquiry not found', 404);
      }

      res.json({
        success: true,
        data: inquiry,
      });
    } catch (error) {
      next(error);
    }
  }

  async createInquiry(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        productId,
        productName,
        productCategory,
        customerName,
        contactPhone,
        email,
        companyName,
        interestedProducts,
        specification,
        requirements,
        priority,
      } = req.body;

      // Get product info if productId provided
      let finalProductName = productName;
      let finalProductCategory = productCategory;

      if (productId && !productName) {
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (product) {
          finalProductName = product.name;
          finalProductCategory = product.categoryId;
        }
      }

      // Extract requirements and clean them for database storage
      // Remove contact info from requirements as they're stored separately
      const cleanedRequirements = requirements ? {
        ...requirements,
        companyName: undefined,
        customerName: undefined,
        contactPhone: undefined,
        email: undefined,
      } : {};

      const inquiry = await prisma.inquiry.create({
        data: {
          productId,
          productName: finalProductName,
          productCategory: finalProductCategory,
          customerName,
          contactPhone,
          email,
          companyName,
          interestedProducts,
          specification,
          requirements: Object.keys(cleanedRequirements).length > 0 ? cleanedRequirements : null,
          priority: priority || 'MEDIUM',
          status: 'PENDING',
        },
        include: {
          product: true,
        },
      });

      // Log activity
      if (req.user) {
        await prisma.activityLog.create({
          data: {
            userId: req.user.userId,
            action: 'inquiry_created',
            entityType: 'inquiry',
            entityId: inquiry.id,
          },
        });
      }

      res.status(201).json({
        success: true,
        message: 'Inquiry submitted successfully',
        data: inquiry,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateInquiry(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, priority, notes, assigneeId } = req.body;

      const existing = await prisma.inquiry.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError('Inquiry not found', 404);
      }

      const inquiry = await prisma.inquiry.update({
        where: { id },
        data: {
          status,
          priority,
          notes,
          assigneeId,
        },
        include: {
          product: true,
          assignedTo: { select: { id: true, fullName: true, email: true } },
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user!.userId,
          action: 'inquiry_updated',
          entityType: 'inquiry',
          entityId: inquiry.id,
          changes: { updates: { status, priority } },
        },
      });

      res.json({
        success: true,
        message: 'Inquiry updated successfully',
        data: inquiry,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const inquiry = await prisma.inquiry.update({
        where: { id },
        data: { status },
      });

      res.json({
        success: true,
        message: `Inquiry status updated to ${status}`,
        data: inquiry,
      });
    } catch (error) {
      next(error);
    }
  }

  async assignInquiry(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { assigneeId } = req.body;

      // Check if assignee exists
      const assignee = await prisma.user.findUnique({ where: { id: assigneeId } });
      if (!assignee) {
        throw new AppError('Assigned user not found', 404);
      }

      const inquiry = await prisma.inquiry.update({
        where: { id },
        data: { assigneeId },
        include: {
          assignedTo: { select: { id: true, fullName: true, email: true } },
        },
      });

      res.json({
        success: true,
        message: `Inquiry assigned to ${assignee.fullName}`,
        data: inquiry,
      });
    } catch (error) {
      next(error);
    }
  }

  async addNote(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { content } = req.body;

      const inquiry = await prisma.inquiry.findUnique({ where: { id } });
      if (!inquiry) {
        throw new AppError('Inquiry not found', 404);
      }

      const updated = await prisma.inquiry.update({
        where: { id },
        data: {
          notes: inquiry.notes ? `${inquiry.notes}\n\n${content}` : content,
        },
      });

      res.json({
        success: true,
        message: 'Note added successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
