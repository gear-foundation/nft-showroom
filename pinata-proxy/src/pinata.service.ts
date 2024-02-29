import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PinataClient from '@pinata/sdk';
import { RateLimiter } from 'limiter';

@Injectable()
export class PinataService {
  private logger = new Logger(PinataService.name);
  private readonly pinata: PinataClient;
  private limiter: RateLimiter;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('PINATA_API_KEY');
    const secretKey = this.configService.getOrThrow<string>(
      'PINATA_SECRET_API_KEY',
    );
    this.limiter = new RateLimiter({
      tokensPerInterval: 150,
      interval: 'minute',
    });
    this.pinata = new PinataClient(apiKey, secretKey);
  }

  async uploadFile(file, fileName: string): Promise<string> {
    this.logger.log(`start to uploading file ${fileName} to IPFS`);
    await this.limiter.removeTokens(1);
    this.logger.log(`uploading file ${fileName} to IPFS`);
    const pinataInfo = await this.pinata.pinFileToIPFS(file, {
      pinataMetadata: {
        name: fileName,
      },
      pinataOptions: { cidVersion: 0 },
    });
    this.logger.log(`file ${fileName} uploaded to IPFS`);
    return pinataInfo.IpfsHash;
  }
}
