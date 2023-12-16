import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { imageFileFilter } from 'src/common/helpers';



@Controller('files')
@ApiTags('Upload')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir',
    type: 'multipart/form-data',
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      // fileFilter: imageFileFilter
    }),
  )
  uploadFile(@UploadedFile() file) {
    return file;
  }
}

