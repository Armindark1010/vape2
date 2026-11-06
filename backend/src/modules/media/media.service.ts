import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MediaService implements OnModuleInit {
  private readonly logger = new Logger(MediaService.name);
  private s3Client: S3Client | null = null;
  private readonly bucket: string;
  private readonly endpoint: string;
  private readonly publicUrlBase: string;
  private s3Available = false;
  private readonly localUploadDir: string;

  constructor(private readonly prisma: PrismaService) {
    const rawEndpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = process.env.MINIO_PORT || '9000';
    const useSSL = process.env.MINIO_USE_SSL === 'true';
    const protocol = useSSL ? 'https' : 'http';

    // Format endpoint url
    this.endpoint = rawEndpoint.startsWith('http')
      ? rawEndpoint
      : `${protocol}://${rawEndpoint}:${port}`;

    this.bucket = process.env.MINIO_BUCKET || 'vapelab-media';
    const rawPublicUrl = process.env.MINIO_PUBLIC_URL || `${this.endpoint}/${this.bucket}`;
    this.publicUrlBase = rawPublicUrl.replace(/\/+$/, '');

    const accessKeyId = process.env.MINIO_ACCESS_KEY || 'admin';
    const secretAccessKey =
      process.env.MINIO_SECRET_KEY || 'vapelabpassword123';

    try {
      this.s3Client = new S3Client({
        endpoint: this.endpoint,
        region: process.env.MINIO_REGION || 'us-east-1',
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        forcePathStyle: true, // Required for MinIO
      });
      this.logger.log(`Initialized S3 Client for MinIO at ${this.endpoint}`);
    } catch (err: any) {
      this.logger.warn(`Failed to initialize S3 Client: ${err.message}`);
    }

    // Local fallback directory for offline development
    this.localUploadDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.localUploadDir)) {
      try {
        fs.mkdirSync(this.localUploadDir, { recursive: true });
      } catch (e: any) {
        this.logger.warn(`Could not create local upload dir: ${e.message}`);
      }
    }
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  /**
   * Check MinIO bucket availability and auto-provision if needed
   */
  async ensureBucketExists() {
    if (!this.s3Client) return;

    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.s3Available = true;
      this.logger.log(`MinIO bucket '${this.bucket}' is ready and accessible.`);
    } catch (err: any) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        try {
          this.logger.log(
            `Bucket '${this.bucket}' does not exist. Creating...`,
          );
          await this.s3Client.send(
            new CreateBucketCommand({ Bucket: this.bucket }),
          );

          // Configure public read policy on the bucket
          const publicPolicy = {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'PublicRead',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${this.bucket}/*`],
              },
            ],
          };

          await this.s3Client.send(
            new PutBucketPolicyCommand({
              Bucket: this.bucket,
              Policy: JSON.stringify(publicPolicy),
            }),
          );

          this.s3Available = true;
          this.logger.log(
            `Bucket '${this.bucket}' created with public read policy.`,
          );
        } catch (createErr: any) {
          this.logger.warn(
            `MinIO bucket creation failed: ${createErr.message}`,
          );
          this.s3Available = false;
        }
      } else {
        this.logger.warn(
          `MinIO connection check failed (${err.message}). Local fallback will be active if MinIO is not running.`,
        );
        this.s3Available = false;
      }
    }
  }

  /**
   * Validate and upload a single file
   */
  async uploadFile(file: Express.Multer.File, userId?: number) {
    if (!file) {
      throw new BadRequestException('هیچ فایلی برای آپلود ارسال نشده است');
    }

    // 1. File Type Validation
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
      'model/gltf-binary', // 3D models (.glb)
      'model/gltf+json', // 3D models (.gltf)
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `فرمت فایل نامعتبر است (${file.mimetype}). فرمت‌های مجاز: JPG, PNG, WebP, GIF, SVG, AVIF, GLB`,
      );
    }

    // 2. Max File Size (15 MB)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('حداکثر حجم مجاز فایل ۱۵ مگابایت است');
    }

    // 3. Generate sanitized key & filename
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.originalname) || '.webp';
    const cleanOriginalName = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    const sanitizedBase = path
      .basename(cleanOriginalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF_-]/gi, '-')
      .replace(/-+/g, '-');

    const generatedFilename = `vape-${Date.now()}-${randomSuffix}${ext}`;
    const key = `uploads/${year}/${month}/${generatedFilename}`;

    let publicUrl = '';

    // 4. Upload to MinIO S3
    let s3Success = false;
    if (this.s3Client) {
      if (!this.s3Available) {
        await this.ensureBucketExists().catch(() => {});
      }
      try {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            CacheControl: 'max-age=31536000', // 1 year cache
          }),
        );
        publicUrl = `${this.publicUrlBase}/${key}`;
        s3Success = true;
        this.s3Available = true;
        this.logger.log(`Uploaded to MinIO: ${key}`);
      } catch (s3Err: any) {
        this.logger.warn(
          `MinIO upload failed (${s3Err.message}), switching to local storage fallback...`,
        );
      }
    }

    // Fallback: Store locally if MinIO is not running
    if (!s3Success) {
      try {
        const destFolder = path.join(this.localUploadDir, `${year}`, `${month}`);
        if (!fs.existsSync(destFolder)) {
          fs.mkdirSync(destFolder, { recursive: true });
        }
        const filePath = path.join(destFolder, generatedFilename);
        fs.writeFileSync(filePath, file.buffer);
        const host = process.env.BACKEND_PUBLIC_URL || 'http://localhost:4000';
        publicUrl = `${host}/uploads/${year}/${month}/${generatedFilename}`;
        this.logger.log(`Saved to local fallback storage: ${filePath}`);
      } catch (localErr: any) {
        throw new InternalServerErrorException(
          `خطا در ذخیره‌سازی فایل: ${localErr.message}`,
        );
      }
    }

    // 5. Save metadata to Database
    const mediaRecord = await this.prisma.mediaFile.create({
      data: {
        filename: generatedFilename,
        originalName: cleanOriginalName,
        mimeType: file.mimetype,
        size: file.size,
        url: publicUrl,
        bucket: this.bucket,
        key,
        uploadedBy: userId || null,
      },
    });

    return mediaRecord;
  }

  /**
   * Upload multiple files in parallel
   */
  async uploadMultipleFiles(files: Express.Multer.File[], userId?: number) {
    if (!files || files.length === 0) {
      throw new BadRequestException('حداقل یک فایل برای آپلود انتخاب کنید');
    }

    const results = [];
    const errors: { filename: string; error: string }[] = [];

    for (const file of files) {
      try {
        const uploaded = await this.uploadFile(file, userId);
        results.push(uploaded);
      } catch (err: any) {
        errors.push({
          filename: file.originalname,
          error: err.message,
        });
      }
    }

    return {
      uploaded: results,
      errors,
      totalUploaded: results.length,
      totalFailed: errors.length,
    };
  }

  /**
   * List media files with search, filtering, sorting and pagination
   */
  async findAll(query: {
    search?: string;
    type?: string;
    sortBy?: 'createdAt' | 'size' | 'originalName';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 24));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search?.trim()) {
      where.OR = [
        { originalName: { contains: query.search.trim(), mode: 'insensitive' } },
        { filename: { contains: query.search.trim(), mode: 'insensitive' } },
      ];
    }

    if (query.type && query.type !== 'all') {
      if (query.type === 'images') {
        where.mimeType = { startsWith: 'image/' };
      } else if (query.type === '3d') {
        where.mimeType = { in: ['model/gltf-binary', 'model/gltf+json'] };
      } else {
        where.mimeType = { contains: query.type };
      }
    }

    const sortBy = query.sortBy || 'createdAt';
    const order = query.order || 'desc';

    const [items, total, aggregate] = await Promise.all([
      this.prisma.mediaFile.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      }),
      this.prisma.mediaFile.count({ where }),
      this.prisma.mediaFile.aggregate({
        _sum: { size: true },
        _count: { id: true },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalFiles: aggregate._count.id || 0,
        totalBytes: aggregate._sum.size || 0,
        s3Available: this.s3Available,
        bucketName: this.bucket,
      },
    };
  }

  /**
   * Get single media file by ID
   */
  async findById(id: number) {
    const file = await this.prisma.mediaFile.findUnique({
      where: { id },
    });
    if (!file) {
      throw new NotFoundException(`فایل با شناسه #${id} یافت نشد`);
    }
    return file;
  }

  /**
   * Delete single media file from MinIO and Database
   */
  async deleteFile(id: number) {
    const file = await this.findById(id);

    // Delete from MinIO
    if (this.s3Client && file.key) {
      try {
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: file.bucket || this.bucket,
            Key: file.key,
          }),
        );
        this.logger.log(`Deleted from MinIO: ${file.key}`);
      } catch (err: any) {
        this.logger.warn(`Could not delete object from MinIO: ${err.message}`);
      }
    }

    // Delete from database
    await this.prisma.mediaFile.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'فایل با موفقیت حذف گردید',
      id,
    };
  }

  /**
   * Bulk delete media files
   */
  async bulkDelete(ids: number[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('شناسه‌ای برای حذف انتخاب نشده است');
    }

    const files = await this.prisma.mediaFile.findMany({
      where: { id: { in: ids } },
    });

    // Delete from MinIO in parallel
    if (this.s3Client) {
      await Promise.allSettled(
        files.map((file) =>
          this.s3Client!.send(
            new DeleteObjectCommand({
              Bucket: file.bucket || this.bucket,
              Key: file.key,
            }),
          ),
        ),
      );
    }

    // Delete from database
    const deleteResult = await this.prisma.mediaFile.deleteMany({
      where: { id: { in: ids } },
    });

    return {
      success: true,
      deletedCount: deleteResult.count,
    };
  }
}

