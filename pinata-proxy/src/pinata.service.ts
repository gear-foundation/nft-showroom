import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PinataClient from '@pinata/sdk';

@Injectable()
export class PinataService {
  private readonly pinata: PinataClient;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('PINATA_API_KEY');
    const secretKey = this.configService.getOrThrow<string>(
      'PINATA_SECRET_API_KEY',
    );
    this.pinata = new PinataClient(apiKey, secretKey);
  }

  async uploadFile(file, fileName: string): Promise<string> {
    const pinataInfo = await this.pinata.pinFileToIPFS(file, {
      pinataMetadata: {
        name: fileName,
      },
      pinataOptions: { cidVersion: 0 },
    });
    return pinataInfo.IpfsHash;
  }
}
