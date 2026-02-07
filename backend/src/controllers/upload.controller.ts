import { Response, Request } from 'express';

export class UploadController {
  async uploadSingle(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '没有上传文件',
        });
      }

      res.json({
        success: true,
        message: '图片上传成功',
        data: {
          url: req.body.imageUrl,
          filename: req.file.filename,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: '上传失败',
      });
    }
  }

  async uploadMultiple(req: Request, res: Response) {
    try {
      if (!req.body.imageUrls || req.body.imageUrls.length === 0) {
        return res.status(400).json({
          success: false,
          message: '没有上传文件',
        });
      }

      res.json({
        success: true,
        message: '图片上传成功',
        data: {
          urls: req.body.imageUrls,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: '上传失败',
      });
    }
  }
}
