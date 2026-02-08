import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export class SolutionController {
  async getAllSolutions(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const solutions = await prisma.solution.findMany({
        where: { isActive: true },
        include: {
          benefits: { orderBy: { displayOrder: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: solutions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSolutionById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const solution = await prisma.solution.findUnique({
        where: { id: id as string },
        include: {
          benefits: { orderBy: { displayOrder: 'asc' } },
        },
      });

      if (!solution) {
        throw new AppError('Solution not found', 404);
      }

      res.json({
        success: true,
        data: solution,
      });
    } catch (error) {
      next(error);
    }
  }

  async createSolution(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        id,
        title,
        subtitle,
        description,
        highlights,
        architecture,
        imageUrl,
        features,
        benefits,
      } = req.body;

      const solution = await prisma.solution.create({
        data: {
          id,
          title,
          subtitle,
          description,
          highlights,
          architecture,
          imageUrl,
          features,
          benefits: {
            create: (benefits || []).map((b: any, i: number) => ({
              benefitTitle: b.title,
              benefitDescription: b.description,
              iconUrl: b.icon,
              displayOrder: i,
            })),
          },
        },
        include: { benefits: true },
      });

      res.status(201).json({
        success: true,
        message: 'Solution created successfully',
        data: solution,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSolution(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const {
        title,
        subtitle,
        description,
        highlights,
        architecture,
        imageUrl,
        features,
        isActive,
        benefits,
      } = req.body;

      const existing = await prisma.solution.findUnique({ where: { id: id as string } });
      if (!existing) {
        throw new AppError('Solution not found', 404);
      }

      await prisma.solutionBenefit.deleteMany({ where: { solutionId: id as string } });

      const solution = await prisma.solution.update({
        where: { id: id as string },
        data: {
          title,
          subtitle,
          description,
          highlights,
          architecture,
          imageUrl,
          features,
          isActive,
          benefits: {
            create: (benefits || []).map((b: any, i: number) => ({
              benefitTitle: b.title,
              benefitDescription: b.description,
              iconUrl: b.icon,
              displayOrder: i,
            })),
          },
        },
        include: { benefits: true },
      });

      res.json({
        success: true,
        message: 'Solution updated successfully',
        data: solution,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSolution(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const solution = await prisma.solution.delete({ where: { id: id as string } });

      res.json({
        success: true,
        message: 'Solution deleted successfully',
        data: solution,
      });
    } catch (error) {
      next(error);
    }
  }
}
