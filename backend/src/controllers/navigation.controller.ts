import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export class NavigationController {
  async getNavigation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const navigation = await prisma.navigationItem.findMany({
        where: { isVisible: true },
        orderBy: { displayOrder: 'asc' },
        include: {
          children: {
            where: { isVisible: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });

      // Build tree structure
      const buildTree = (items: any[], parentId: string | null = null): any[] => {
        return items
          .filter((item) => {
            if (parentId === null) {
              return item.parentId === null;
            }
            return item.parentId === parentId;
          })
          .map((item) => ({
            ...item,
            children: buildTree(items, item.id),
          }));
      };

      const tree = buildTree(navigation);

      res.json({
        success: true,
        data: tree,
      });
    } catch (error) {
      next(error);
    }
  }

  async createNavigationItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, label, path, parentId, icon, displayOrder, isVisible, requiresAuth, allowedRoles } =
        req.body;

      const item = await prisma.navigationItem.create({
        data: {
          id,
          label,
          path,
          parentId,
          icon,
          displayOrder,
          isVisible,
          requiresAuth,
          allowedRoles,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Navigation item created successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateNavigationItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { label, path, parentId, icon, displayOrder, isVisible, requiresAuth, allowedRoles } =
        req.body;

      const existing = await prisma.navigationItem.findUnique({ where: { id: id as string } });
      if (!existing) {
        throw new AppError('Navigation item not found', 404);
      }

      const item = await prisma.navigationItem.update({
        where: { id: id as string },
        data: {
          label,
          path,
          parentId,
          icon,
          displayOrder,
          isVisible,
          requiresAuth,
          allowedRoles,
        },
      });

      res.json({
        success: true,
        message: 'Navigation item updated successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteNavigationItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const item = await prisma.navigationItem.delete({ where: { id: id as string } });

      res.json({
        success: true,
        message: 'Navigation item deleted successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }
}
