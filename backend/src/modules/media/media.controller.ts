import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Media & File Storage (MinIO S3)')
@Controller(['api/v1/media', 'api/media', 'media'])
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPPLIER)
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a single media file to MinIO S3 storage' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    return this.mediaService.uploadFile(file, user?.id);
  }

  @Post('upload-multiple')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 15))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload multiple media files simultaneously to MinIO S3' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User,
  ) {
    return this.mediaService.uploadMultipleFiles(files, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List and filter media files with pagination and search' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for filename' })
  @ApiQuery({ name: 'type', required: false, description: 'File type filter (images, webp, png, 3d, all)' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'size', 'originalName'] })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('sortBy') sortBy?: 'createdAt' | 'size' | 'originalName',
    @Query('order') order?: 'asc' | 'desc',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.mediaService.findAll({ search, type, sortBy, order, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single media file' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a single media file from MinIO and database' })
  async deleteFile(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.deleteFile(id);
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete multiple media files in batch' })
  async bulkDelete(@Body('ids') ids: number[]) {
    return this.mediaService.bulkDelete(ids);
  }
}

