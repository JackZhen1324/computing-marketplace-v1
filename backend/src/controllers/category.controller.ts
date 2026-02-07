import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export class CategoryController {
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { displayOrder: 'asc' },
        include: {
          _count: {
            select: { products: true },
          },
        },
      });

      res.json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      logger.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error.message,
      });
    }
  }

  async getCategoryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: true,
        },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      res.json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      logger.error('Error fetching category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch category',
        error: error.message,
      });
    }
  }

  async createCategory(req: Request, res: Response) {
    try {
      const {
        id,
        name,
        nameEn,
        description,
        iconUrl,
        displayOrder = 0,
        isActive = true,
      } = req.body;

      // Check if category ID already exists
      const existing = await prisma.category.findUnique({
        where: { id },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Category with this ID already exists',
        });
      }

      const category = await prisma.category.create({
        data: {
          id,
          name,
          nameEn,
          description,
          iconUrl,
          displayOrder,
          isActive,
        },
      });

      res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully',
      });
    } catch (error: any) {
      logger.error('Error creating category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create category',
        error: error.message,
      });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        name,
        nameEn,
        description,
        iconUrl,
        displayOrder,
        isActive,
      } = req.body;

      const category = await prisma.category.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(nameEn !== undefined && { nameEn }),
          ...(description !== undefined && { description }),
          ...(iconUrl !== undefined && { iconUrl }),
          ...(displayOrder !== undefined && { displayOrder }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      res.json({
        success: true,
        data: category,
        message: 'Category updated successfully',
      });
    } catch (error: any) {
      logger.error('Error updating category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update category',
        error: error.message,
      });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if category has products
      const productCount = await prisma.product.count({
        where: { categoryId: id },
      });

      if (productCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete category with ${productCount} products. Please reassign or delete the products first.`,
        });
      }

      await prisma.category.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error: any) {
      logger.error('Error deleting category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete category',
        error: error.message,
      });
    }
  }

  async toggleCategoryStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      const updated = await prisma.category.update({
        where: { id },
        data: { isActive: !category.isActive },
      });

      res.json({
        success: true,
        data: updated,
        message: `Category ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      logger.error('Error toggling category status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle category status',
        error: error.message,
      });
    }
  }
}
