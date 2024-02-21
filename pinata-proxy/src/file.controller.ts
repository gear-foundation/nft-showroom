import {
  Controller,
  Logger,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PinataService } from './pinata.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Readable } from 'stream';

export type Result = {
  fileName: string;
  ipfsHash?: string;
  error?: string;
};

@Controller('files')
export class FileController {
  private logger = new Logger(FileController.name);

  constructor(private readonly pinataService: PinataService) {}

  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor())
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Result[]> {
    const names = files.map((file) => file.filename ?? file.originalname);
    const results = await Promise.allSettled(
      files.map((file, index) => {
        return this.pinataService.uploadFile(
          Readable.from(file.buffer),
          names[index],
        );
      }),
    );
    return results.map((response, index) => {
      const result = {
        fileName: names[index],
      };
      if (response.status === 'fulfilled') {
        return {
          ...result,
          ipfsHash: response.value,
        };
      }
      this.logger.error(response.reason);
      console.error(response.reason);
      return {
        ...result,
        error: response.reason.message ?? 'unknown error',
      };
    });
  }
}
