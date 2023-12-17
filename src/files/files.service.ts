import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import { UPLOADFILE } from 'src/common/const';
import { PrismaService } from 'src/common/services';
import { promisify } from 'util';

@Injectable()
export class FilesService {
  private readonly renameAsync = promisify(fs.rename);
  private readonly unlinkAsync = promisify(fs.unlink);
  private readonly accessAsync = promisify(fs.access);
  constructor(private readonly prisma: PrismaService) { }


  async fileExists(filePath: string): Promise<boolean> {
    try {
      await this.accessAsync(filePath, fs.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }
  async renameFile(file: any, code: string): Promise<void> {
    var newPath = UPLOADFILE + code + ".png";
    var user = await this.prisma.mar_emp_empleados.findFirst({
      where: {
        emp_codigo_emp: code,
        emp_estado: 'ACTIVE'
      }
    });
    if (!user) {
      await this.unlinkAsync(file.path);
      throw new UnauthorizedException('Empleado no encontrado');
    }

    const exists = await this.fileExists(newPath);

    if (exists) {
      throw new UnauthorizedException('Empleado ya esta enrolado');
    }


    try {
      await this.renameAsync(file.path, newPath);
      console.log(`Archivo renombrado de ${file.path} a ${newPath}`);
    } catch (error) {
      // Manejo de errores
      console.error('Error al renombrar el archivo:', error);
      throw error;
    }
  }
}
