import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PinataService } from './pinata.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
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
    try {
      const results = await Promise.all(
        files.map((file, index) => {
          return this.pinataService.uploadFile(
            Readable.from(file.buffer),
            names[index],
          );
        }),
      );
      return results.map((response, index) => {
        return {
          fileName: names[index],
          ipfsHash: response,
        };
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('failed to upload files');
    }
  }
}
