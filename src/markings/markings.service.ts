import { Injectable } from '@nestjs/common';
import { CreateMarkingDto } from './dto/create-marking.dto';
import { UpdateMarkingDto } from './dto/update-marking.dto';
import { PrismaService } from 'src/common/services';
import { FilterDTO } from './dto/filter.dto';
import { TimeType, convert_date } from 'src/common/helpers';

import * as Excel from 'exceljs';

@Injectable()
export class MarkingsService {


  constructor(private readonly prisma: PrismaService) { }

  create(createMarkingDto: CreateMarkingDto) {
    return 'This action adds a new marking';
  }

  async getAllMarkings(id: string, filterDTO: FilterDTO) {

    var startDate = convert_date(filterDTO.date_start, TimeType.Inicio);
    var endDate = convert_date(filterDTO.date_end, TimeType.Fin);
    var data = await this.prisma.mar_hor_horarios.findMany({
      where: {
        hor_codctro: id,
        hor_estado: 'ACTIVE',
      },
      include: {
        mar_asi_asignacion: {
          orderBy: {
            asi_codemp: 'asc'
          },
          where: {
            asi_estado: 'ACTIVE',
          },
          select: {
            asi_codigo: true,
            mar_his_historial: {
              where: {
                his_feccrea: {
                  gte: startDate, // Mayor o igual que startDate
                  lte: endDate
                }
              },
              orderBy: {
                his_feccrea: 'asc'
              }
            },
            mar_emp_empleados: true
          }
        },
        mar_hde_detalle_ho: {
          where: { hde_estado: 'ACTIVE' },
        }
      }
    });
    var dataResp = [];
    for (let index = 0; index < data.length; index++) {
      const horarios = data[index];
      for (let e = 0; e < horarios.mar_asi_asignacion.length; e++) {
        const asig = horarios.mar_asi_asignacion[e];
        if (asig.mar_his_historial.length == 0) {
          continue;
        }
        for (let a = 0; a < asig.mar_his_historial.length; a++) {
          const hora = asig.mar_his_historial[a];
          var registro = {
            nombres: asig.mar_emp_empleados.emp_nombres,
            apellidos: asig.mar_emp_empleados.emp_apellidos,
            codigo: asig.mar_emp_empleados.emp_codigo_emp,
            id: asig.mar_emp_empleados.emp_codigo,
            fecha: hora.his_feccrea,
            entrada: hora.his_hora_entrada,
            salida: hora.his_hora_salida,
            tiempo_extra: hora.his_tp_extra,
            tiempo_trabajado: hora.his_tp_trabajado,
          }
          dataResp.push(registro);
        }
      }
    }
    return dataResp;
  }


  async excelAllMarkings(id: string, filterDTO: FilterDTO) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');

    // Añade algunas columnas y filas aquí
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      // otros campos...
    ];

    worksheet.addRow({ id: 1, name: 'John Doe' });
    // Añadir más filas...

    // Guardar en un buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
    // var startDate = convert_date(filterDTO.date_start, TimeType.Inicio);
    // var endDate = convert_date(filterDTO.date_end, TimeType.Fin);
    // var data = await this.prisma.mar_hor_horarios.findMany({
    //   where: {
    //     hor_codctro: id,
    //     hor_estado: 'ACTIVE',
    //   },
    //   include: {
    //     mar_asi_asignacion: {
    //       orderBy: {
    //         asi_codemp: 'asc'
    //       },
    //       where: {
    //         asi_estado: 'ACTIVE',
    //       },
    //       select: {
    //         asi_codigo: true,
    //         mar_his_historial: {
    //           where: {
    //             his_feccrea: {
    //               gte: startDate, // Mayor o igual que startDate
    //               lte: endDate
    //             }
    //           },
    //           orderBy: {
    //             his_feccrea: 'asc'
    //           }
    //         },
    //         mar_emp_empleados: true
    //       }
    //     },
    //     mar_hde_detalle_ho: {
    //       where: { hde_estado: 'ACTIVE' },
    //     }
    //   }
    // });
    // var dataResp = [];
    // for (let index = 0; index < data.length; index++) {
    //   const horarios = data[index];
    //   for (let e = 0; e < horarios.mar_asi_asignacion.length; e++) {
    //     const asig = horarios.mar_asi_asignacion[e];
    //     if (asig.mar_his_historial.length == 0) {
    //       continue;
    //     }
    //     for (let a = 0; a < asig.mar_his_historial.length; a++) {
    //       const hora = asig.mar_his_historial[a];
    //       var registro = {
    //         nombres: asig.mar_emp_empleados.emp_nombres,
    //         apellidos: asig.mar_emp_empleados.emp_apellidos,
    //         codigo: asig.mar_emp_empleados.emp_codigo_emp,
    //         id: asig.mar_emp_empleados.emp_codigo,
    //         fecha: hora.his_feccrea,
    //         entrada: hora.his_hora_entrada,
    //         salida: hora.his_hora_salida,
    //         tiempo_extra: hora.his_tp_extra,
    //         tiempo_trabajado: hora.his_tp_trabajado,
    //       }
    //       dataResp.push(registro);
    //     }
    //   }
    // }
    // return dataResp;
  }

  findOne(id: number) {
    return `This action returns a #${id} marking`;
  }

  update(id: number, updateMarkingDto: UpdateMarkingDto) {
    return `This action updates a #${id} marking`;
  }

  remove(id: number) {
    return `This action removes a #${id} marking`;
  }
}
