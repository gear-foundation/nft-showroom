import { Event } from '../processor';
import { DnsEventsParser } from './dns.events';

export class DnsService {
  private dnsContract: string | null = null;
  private nameToAddressMap: Map<string, string> = new Map();
  private parser = new DnsEventsParser();

  constructor(private readonly dnsApiUrl: string) {}

  async init() {
    console.log(`[dns] init`);
    await this.parser.init();
    console.log(`[dns] init: parser initialized`);
    console.log(`[dns] init: fetching contract address`);
    const response = await fetch(`${this.dnsApiUrl}/api/dns/contract`);
    const data: { contract: string } = await response.json();
    this.dnsContract = data.contract;
    console.log(`[dns] init: contract address fetched: ${this.dnsContract}`);
  }

  async getAddressByName(name: string): Promise<string | null> {
    const cachedAddress = this.nameToAddressMap.get(name);
    if (cachedAddress) {
      return cachedAddress;
    }
    console.log(`[dns] getAddressByName: fetching address for ${name}`);
    const response = await fetch(`${this.dnsApiUrl}/api/dns/by_name/${name}`);
    const data: { address: string } = await response.json();
    const address = data.address;
    if (!address) {
      throw new Error(`[dns] Address not found for ${name}`);
    }
    console.log(
      `[dns] getAddressByName: address for ${name} fetched: ${address}`,
    );
    this.nameToAddressMap.set(name, address);
    return address;
  }

  async handleEvent(event: Event) {
    if (!this.dnsContract) {
      throw new Error('[dns] DNS contract not initialized');
    }
    const {
      message: { source, payload },
    } = event.args;
    if (source !== this.dnsContract) {
      return;
    }
    const dnsEvent = this.parser.getDnsEvent(payload);
    if (!dnsEvent) {
      return;
    }
    console.log(
      `[dns] ${dnsEvent.type} event detected, program id: ${dnsEvent.name} -> ${dnsEvent.program}`,
    );
    this.nameToAddressMap.set(dnsEvent.name, dnsEvent.program);
    return {
      name: dnsEvent.name,
      address: dnsEvent.program,
    };
  }
}
