import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export class ProductController {
  async getAllProducts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, tags, region, search } = req.query;

      const where: any = { isActive: true };

      if (category) {
        where.categoryId = category;
      }

      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        where.tags = { hasSome: tagArray };
      }

      if (region) {
        where.region = region;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          features: { orderBy: { displayOrder: 'asc' } },
          specifications: { orderBy: { displayOrder: 'asc' } },
          pricing: { orderBy: { displayOrder: 'asc' } },
          useCases: { orderBy: { displayOrder: 'asc' } },
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id: id as string },
        include: {
          features: { orderBy: { displayOrder: 'asc' } },
          specifications: { orderBy: { displayOrder: 'asc' } },
          pricing: { orderBy: { displayOrder: 'asc' } },
          useCases: { orderBy: { displayOrder: 'asc' } },
          category: true,
        },
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        id,
        categoryId,
        name,
        title,
        subtitle,
        description,
        imageUrl,
        priceDisplay,
        source,
        region,
        tags,
        cpuMemoryRatio,
        vcpuRange,
        baseFreq,
        features,
        specifications,
        pricing,
        useCases,
      } = req.body;

      const product = await prisma.product.create({
        data: {
          id,
          categoryId,
          name,
          title,
          subtitle,
          description,
          imageUrl,
          priceDisplay,
          source,
          region,
          tags: tags || [],
          cpuMemoryRatio,
          vcpuRange,
          baseFreq,
          features: {
            create: (features || []).map((f: string, i: number) => ({
              featureText: f,
              displayOrder: i,
            })),
          },
          specifications: {
            create: (specifications || []).map((s: { label: string; value: string }, i: number) => ({
              specLabel: s.label,
              specValue: s.value,
              displayOrder: i,
            })),
          },
          pricing: {
            create: (pricing || []).map((p: any, i: number) => ({
              planName: p.plan,
              price: p.price,
              features: p.features,
              displayOrder: i,
            })),
          },
          useCases: {
            create: (useCases || []).map((u: string, i: number) => ({
              useCase: u,
              displayOrder: i,
            })),
          },
        },
        include: {
          features: true,
          specifications: true,
          pricing: true,
          useCases: true,
          category: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const {
        categoryId,
        name,
        title,
        subtitle,
        description,
        imageUrl,
        priceDisplay,
        source,
        region,
        tags,
        cpuMemoryRatio,
        vcpuRange,
        baseFreq,
        isActive,
        features,
        specifications,
        pricing,
        useCases,
      } = req.body;

      // Check if product exists
      const existing = await prisma.product.findUnique({ where: { id: id as string } });
      if (!existing) {
        throw new AppError('Product not found', 404);
      }

      // Delete existing related records
      await prisma.productFeature.deleteMany({ where: { productId: id as string } });
      await prisma.productSpecification.deleteMany({ where: { productId: id as string } });
      await prisma.productPricing.deleteMany({ where: { productId: id as string } });
      await prisma.productUseCase.deleteMany({ where: { productId: id as string } });

      // Update product with new data
      const product = await prisma.product.update({
        where: { id: id as string },
        data: {
          categoryId,
          name,
          title,
          subtitle,
          description,
          imageUrl,
          priceDisplay,
          source,
          region,
          tags,
          cpuMemoryRatio,
          vcpuRange,
          baseFreq,
          isActive,
          features: {
            create: (features || []).map((f: string, i: number) => ({
              featureText: f,
              displayOrder: i,
            })),
          },
          specifications: {
            create: (specifications || []).map((s: { label: string; value: string }, i: number) => ({
              specLabel: s.label,
              specValue: s.value,
              displayOrder: i,
            })),
          },
          pricing: {
            create: (pricing || []).map((p: any, i: number) => ({
              planName: p.plan,
              price: p.price,
              features: p.features,
              displayOrder: i,
            })),
          },
          useCases: {
            create: (useCases || []).map((u: string, i: number) => ({
              useCase: u,
              displayOrder: i,
            })),
          },
        },
        include: {
          features: true,
          specifications: true,
          pricing: true,
          useCases: true,
          category: true,
        },
      });

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const product = await prisma.product.delete({
        where: { id: id as string },
      });

      res.json({
        success: true,
        message: 'Product deleted successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleProductStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({ where: { id: id as string } });
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const updated = await prisma.product.update({
        where: { id: id as string },
        data: { isActive: !product.isActive },
      });

      res.json({
        success: true,
        message: `Product ${updated.isActive ? 'activated' : 'deactivated'}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
