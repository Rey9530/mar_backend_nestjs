import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import { UPLOADFILE } from 'src/common/const';
import { PrismaService } from 'src/common/services';
import { promisify } from 'util';
import axios, { AxiosResponse } from 'axios';
import { mar_his_historial } from '@prisma/client';

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
    var newPath = UPLOADFILE + "/" + code + ".png";
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
      await this.unlinkAsync(file.path);
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


  async identify(file: any): Promise<any> {
    const exists = await this.fileExists(file.path);
    if (!exists) {
      throw new UnauthorizedException('Ha ocurrido un error al generar el escaneo');
    }
    var name = file.filename.split(".");
    var employee_code = await this.obtenerDatos(name[0]);
    if (employee_code == 'no encontrada') {
      throw new UnauthorizedException('Empleado no encontrado');
    }
    var code = employee_code.replace(".png", "");
    var employe = await this.prisma.mar_emp_empleados.findFirst({
      where: {
        emp_codigo_emp: code,
        emp_estado: 'ACTIVE'
      }
    });
    if (!employe) {
      throw new UnauthorizedException('Empleado no encontrado');
    }
    var empAsig = await this.prisma.mar_asi_asignacion.findFirst({
      where: {
        asi_codemp: employe.emp_codigo,
        asi_estado: 'ACTIVE'
      },
      include: {
        mar_hor_horarios: true
      }
    });
    if (!empAsig) {
      throw new InternalServerErrorException('El empleado no horario asignado, verificar con el administrador del contrato');
    }
    // var days = await this.prisma.mar_dia_dias.findFirst({
    //   where: {
    //     dia_dia_codigo: day,
    //     dia_estado: 'ACTIVE'
    //   },
    // }); 



    var his = await this.prisma.mar_his_historial.findFirst({
      where: {
        his_codasi: empAsig.asi_codigo,
        his_hora_salida: null,
        emp_estado: 'ACTIVE'
      },
    });
    var respApi;
    var marcacion_hora = new Date();
    if (his) {
      // var horDetail = await this.prisma.mar_hde_detalle_ho.findFirst({
      //   where: {
      //     hde_coddia: days.dia_codigo,
      //     hde_codhor: empAsig.mar_hor_horarios.hor_codigo,
      //     hde_estado: 'ACTIVE'
      //   },
      //   include: {
      //     mar_dia_dias: true
      //   }
      // });
      // var h_inicio1 = horDetail.hde_inicio_1.split(":");
      // var inicio_1;
      // if (h_inicio1.length > 1) {
      //   inicio_1 = this.getDate(h_inicio1[0], h_inicio1[1]);
      // }
      // var h_fin1 = horDetail.hde_fin_1.split(":");
      // var fin_1;
      // if (h_fin1.length > 1) {
      //   fin_1 = this.getDate(h_fin1[0], h_fin1[1]);
      // }
      // var h_inicio2 = horDetail.hde_inicio_2.split(":");
      // var inicio_2;
      // if (h_inicio2.length > 1) {
      //   inicio_2 = this.getDate(h_inicio2[0], h_inicio2[1]);
      // }
      // var h_fin2 = horDetail.hde_fin_2.split(":");
      // var fin_2;
      // if (h_fin2.length > 1) {
      //   fin_2 = this.getDate(h_fin2[0], h_fin2[1]);
      // }
      // var horas_deber_cumplir = 0;
      // if (inicio_1 != null && fin_1 != null && inicio_2 == null && h_fin2 == null) {
      //   horas_deber_cumplir = this.calcularHorasEntreFechas(inicio_1, fin_1);
      // }

      // var hora = his.his_hora_entrada.split(":");
      // var start_date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(hora[0]), Number(hora[1]));
      // var end_date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
      // var horas_trabajadas = this.calcularHorasEntreFechas(start_date, end_date);
      var datos = {
        his_hora_salida: marcacion_hora,
        // his_tp_trabajado: horas_trabajadas.toString(),
        // his_tp_extra: (horas_deber_cumplir > 0 ? (horas_trabajadas - horas_deber_cumplir) : "0").toString(),
        his_usrmod: employe.emp_nombres + " " + employe.emp_apellidos,
        his_codasi: empAsig.asi_codigo
      }
      respApi = await this.prisma.mar_his_historial.update({
        where: { his_codigo: his.his_codigo, emp_estado: 'ACTIVE' },
        data: datos
      });
    } else {
      var data = {
        his_hora_entrada: marcacion_hora,
        his_hora_salida: null,
        his_tp_trabajado: '0',
        his_tp_extra: '0',
        his_usrcrea: employe.emp_nombres + " " + employe.emp_apellidos,
        his_usrmod: employe.emp_nombres + " " + employe.emp_apellidos,
        his_codasi: empAsig.asi_codigo
      }
      respApi = await this.prisma.mar_his_historial.create({
        data
      });
    }
    return {
      "empleado": employe.emp_nombres + " " + employe.emp_apellidos,
      "hora": this.formatAMPM(marcacion_hora),
    };


  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  calcularHorasEntreFechas(fechaInicial: Date, fechaFinal: Date): number {
    // Diferencia en milisegundos
    const diferencia = fechaFinal.getTime() - fechaInicial.getTime();

    // Convertir milisegundos en horas
    const horas = diferencia / (1000 * 60 * 60);

    return horas;
  }

  async obtenerDatos(path): Promise<any> {
    try {
      const respuesta: AxiosResponse = await axios.get(`http://python-api:8000/${path}`);
      console.log(respuesta.data)
      return respuesta.data.persona;
    } catch (error) {
      throw new Error(`Error al obtener datos: ${error.message}`);
    }
  }

  getDate(hora: string = '00', minutos: string = '00') {

    var date = new Date();
    var retrunDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(hora), Number(minutos));
    return retrunDate;
  }
}
