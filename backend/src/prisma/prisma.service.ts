import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../dist/generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const configs = {
      connectionString: process.env['DATABASE_URL'],
    };
    const adapter = new PrismaPg(configs, {
      onConnectionError(err) {
        console.error('Database connection error', err);
      },
    });
    super({
      adapter,
      errorFormat: 'pretty',
      log: ['warn', 'error', 'info', { emit: 'event', level: 'query' }],
    });
  }

  async onModuleInit() {
    console.log('Connecting to database...');
    await this.$connect();
    console.log('Connected successfully');
  }

  async onModuleDestroy() {
    console.log('Disconnecting from the database...');
    await this.$disconnect();
    console.log('Database disconnected successfully');
  }
}
