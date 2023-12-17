import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaService } from 'src/common/services';

@Module({
  controllers: [FilesController],
  providers: [FilesService,PrismaService],
})
export class FilesModule {}
