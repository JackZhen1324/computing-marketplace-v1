import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export class NewsController {
  async getAllNews(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, isPublished } = req.query;

      const where: any = {};

      if (type) {
        where.type = type.toUpperCase();
      }

      if (isPublished !== undefined) {
        where.isPublished = isPublished === 'true';
      }

      const news = await prisma.newsArticle.findMany({
        where,
        orderBy: [{ displayOrder: 'asc' }, { publishDate: 'desc' }],
      });

      res.json({
        success: true,
        data: news,
      });
    } catch (error) {
      next(error);
    }
  }

  async getNewsById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const news = await prisma.newsArticle.findUnique({
        where: { id },
      });

      if (!news) {
        throw new AppError('News article not found', 404);
      }

      res.json({
        success: true,
        data: news,
      });
    } catch (error) {
      next(error);
    }
  }

  async createNews(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        type,
        title,
        summary,
        content,
        source,
        publishDate,
        tag,
        imageUrl,
        isPublished,
        displayOrder,
      } = req.body;

      const news = await prisma.newsArticle.create({
        data: {
          type: type.toUpperCase(),
          title,
          summary,
          content,
          source,
          publishDate: new Date(publishDate),
          tag,
          imageUrl,
          isPublished,
          displayOrder,
        },
      });

      res.status(201).json({
        success: true,
        message: 'News article created successfully',
        data: news,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateNews(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const {
        type,
        title,
        summary,
        content,
        source,
        publishDate,
        tag,
        imageUrl,
        isPublished,
        displayOrder,
      } = req.body;

      const existing = await prisma.newsArticle.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError('News article not found', 404);
      }

      const news = await prisma.newsArticle.update({
        where: { id },
        data: {
          type: type?.toUpperCase(),
          title,
          summary,
          content,
          source,
          publishDate: publishDate ? new Date(publishDate) : undefined,
          tag,
          imageUrl,
          isPublished,
          displayOrder,
        },
      });

      res.json({
        success: true,
        message: 'News article updated successfully',
        data: news,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteNews(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const news = await prisma.newsArticle.delete({ where: { id } });

      res.json({
        success: true,
        message: 'News article deleted successfully',
        data: news,
      });
    } catch (error) {
      next(error);
    }
  }

  async togglePublish(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const news = await prisma.newsArticle.findUnique({ where: { id } });
      if (!news) {
        throw new AppError('News article not found', 404);
      }

      const updated = await prisma.newsArticle.update({
        where: { id },
        data: { isPublished: !news.isPublished },
      });

      res.json({
        success: true,
        message: `Article ${updated.isPublished ? 'published' : 'unpublished'}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
