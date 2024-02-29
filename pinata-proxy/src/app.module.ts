import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { PinataService } from './pinata.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [FileController],
  providers: [PinataService],
})
export class AppModule {}
