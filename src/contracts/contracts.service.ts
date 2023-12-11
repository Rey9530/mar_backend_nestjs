import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/services';
import { mar_hde_detalle_ho, mar_hor_horarios, mar_usr_usuario, mar_ctr_contratos, mar_asi_asignacion, mar_epr_empresas } from '@prisma/client';
import { convert_date } from 'src/common/helpers/conver_date.heper';
import { CreateProjectDto, CreateScheduleDto, UpdateProjectDto } from './dto';
import { PaginationDto } from 'src/common/dto/Pagination-dto';

@Injectable()
export class ContractsService {
  private readonly logger = new Logger('EmployesService');

  constructor(private readonly prisma: PrismaService) { }

  async create(createProjectDto: CreateProjectDto, user: mar_usr_usuario) {
    var ctr_fecha_inicio = convert_date(createProjectDto.ctr_fecha_inicio);
    var ctr_fecha_fin = convert_date(createProjectDto.ctr_fecha_fin);

    ctr_fecha_fin.setHours(ctr_fecha_fin.getHours() + 23);
    ctr_fecha_fin.setMinutes(ctr_fecha_fin.getMinutes() + 59);
    if (ctr_fecha_inicio.getTime() > ctr_fecha_fin.getTime()) {
      throw new InternalServerErrorException(
        'Las fecha de inicio del proyecto no debe ser mayor a la fecha final',
      );
    }
    try {
      var data = {
        ctr_codusr: user.usr_codigo,
        ctr_nombre: createProjectDto.ctr_nombre,
        ctr_num_contrato: createProjectDto.ctr_numero_contrato,
        ctr_fecha_inicio,
        ctr_fecha_fin,
        ctr_usrcrea: user.usr_nombres + ' ' + user.usr_apellidos,
        ctr_usrmod: user.usr_nombres + ' ' + user.usr_apellidos,
        ctr_codepr: createProjectDto.marca_ctr_empre,
        ctr_horas_extras: createProjectDto.horas_extras,
        ctr_fecha_inipro:
          createProjectDto.ctr_fecha_inicio_pro != null
            ? convert_date(createProjectDto.ctr_fecha_inicio_pro)
            : null,
        ctr_fecha_finpro:
          createProjectDto.ctr_fecha_fin_pro != null
            ? convert_date(createProjectDto.ctr_fecha_fin_pro)
            : null,
      };
      return await this.prisma.mar_ctr_contratos.create({ data });
    } catch (error) {
      console.log(error.toString());
      return error;
    }
  }

  async addEmployeToContract(idCtr: string, idEmp: string, user: mar_usr_usuario) {
    var contract = await this.prisma.mar_ctr_contratos.findFirst({
      where: {
        ctr_codusr: user.usr_codigo,
        ctr_codigo: idCtr,
        ctr_estado: 'ACTIVE',
      },
    },);

    if (!contract)
      throw new NotFoundException('El registro del contrato no fue encontrado')

    var horario = await this.prisma.mar_hor_horarios.findFirst({ where: { hor_codctro: idCtr, hor_estado: 'ACTIVE' } });
    if (!horario)
      throw new NotFoundException('El contrato no tiene horario configurado');

    var data: any = {
      asi_usrcrea: user.usr_nombres + ' ' + user.usr_apellidos,
      asi_usrmod: user.usr_nombres + ' ' + user.usr_apellidos,
      asi_codhor: horario.hor_codigo,
      asi_codemp: idEmp
    };
    var asignacion = await this.prisma.mar_asi_asignacion.create({
      data
    });

    return asignacion;

  }
  async updateSchedule(asiCode: string,codHor: string,user: mar_usr_usuario){
    var data:any = { 
      asi_usrmod: user.usr_nombres + ' ' + user.usr_apellidos,
      asi_codhor: codHor, 
    };
    return this.prisma.mar_asi_asignacion.update({
      where:{ asi_codigo:asiCode },
      data
    });
  }
  async createSchedule(createScheduleDto: CreateScheduleDto, user: mar_usr_usuario, id: string) { //TODO: Terminar de agregar validaciones
    try {
      var contract = await this.prisma.mar_ctr_contratos.findFirst({
        where: {
          ctr_codusr: user.usr_codigo,
          ctr_codigo: id,
          ctr_estado: 'ACTIVE',
        },
      },);

      if (!contract)
        throw new NotFoundException('El registro del contrato no fue encontrado')

      var horarios = await this.prisma.mar_hor_horarios.count({ where: { hor_codctro: contract.ctr_codigo, hor_estado: 'ACTIVE' } });
      var usrName = user.usr_nombres + ' ' + user.usr_apellidos;
      var newHours = await this.prisma.mar_hor_horarios.create({
        data: {
          hor_nombre: `Horario ${horarios + 1}`,
          hor_codctro: contract.ctr_codigo,
          hor_usrcrea: usrName,
          hor_usrmod: usrName,
        }
      });

      var hours = [];
      for (let index = 0; index < createScheduleDto.list.length; index++) {
        const element: any = createScheduleDto.list[index];
        var hour = {
          hde_codhor: newHours.hor_codigo,
          hor_coddia: element.day.dia_codigo,
          hde_inicio_1: this.getHour(element.entrada1),
          hde_fin_1: this.getHour(element.salida1),
          hde_inicio_2: this.getHour(element.entrada2),
          hde_fin_2: this.getHour(element.salida2),
          hde_usrcrea: usrName,
          hde_usrmod: usrName
        };
        hours.push(hour);
      }
      var saveDb = await this.prisma.mar_hde_detalle_ho.createMany({ data: hours });
      return saveDb;
    } catch (error) {
      console.log(error.toString());
      return error;
    }
  }
  getHour(element) {
    var hdefin2 = element != null ? element : "00:00"
    var dateResp;
    if (hdefin2.length == 7) {
      var h = Number(`${hdefin2[0] + hdefin2[1]}`);
      if (hdefin2[5] == "P") {
        h = h < 12 ? h + 12 : h;
      }
      dateResp = `${h}:${hdefin2[0] + hdefin2[1]}`;
    } else {
      dateResp = hdefin2;
    }
    return dateResp;
  }

  async findAll() {
    try {
      return await this.prisma.mar_ctr_contratos.findMany({
        where: { ctr_estado: 'ACTIVE' },
        include: { mar_epr_empresas: { select: { epr_nombre: true } } },
      });
    } catch (error) {
      return error;
    }
  }

  async findOne(id: string) {
    try {
      var respDb = await this.prisma.mar_ctr_contratos.findFirst({
        where: { ctr_codigo: id, ctr_estado: 'ACTIVE' },
        include: { mar_epr_empresas: { select: { epr_nombre: true, epr_codigo: true, } } },
      });
    } catch (error) {
      return error;
    }

    if (!respDb) throw new NotFoundException('Registro no encontrado');
    return respDb;
  }

  async getCompanies() {
    return await this.prisma.mar_epr_empresas.findMany({
      where: { epr_estado: 'ACTIVE' },
      select: { epr_codigo: true, epr_nombre: true },
    });
  }

  async deleteEmployes(idAsi: string, user: mar_usr_usuario) {
    var data = await this.prisma.mar_asi_asignacion.findFirst({
      where: { asi_codigo: idAsi, asi_estado: 'ACTIVE' },
    },);
    if (!data) throw new NotFoundException('Registro no encontrado');
    
    await this.prisma.mar_asi_asignacion.update({
      where: { asi_codigo: idAsi, asi_estado: 'ACTIVE' },
      data: { asi_estado: 'INACTIVE', asi_usrmod: user.usr_nombres + " " + user.usr_apellidos }
    });
  }
  async listEmployes(idCtr: string, user: mar_usr_usuario) {

    var contracts = await this.prisma.mar_ctr_contratos.findFirst({
      where: { ctr_estado: 'ACTIVE', ctr_codigo: idCtr, ctr_codusr: user.usr_codigo },
    });
    if (!contracts) throw new NotFoundException('Contrato no encontrado');

    var empleados = await this.prisma.mar_hor_horarios.findMany({
      where: {
        hor_codctro: idCtr,
        hor_estado: 'ACTIVE'
      },
      select: {
        mar_asi_asignacion: {
          where: { asi_estado: 'ACTIVE' },
          select: {
            asi_codhor: true,
            asi_codigo: true,
            mar_emp_empleados: {
              select: {
                emp_nombres: true,
                emp_apellidos: true,
                emp_codigo: true,
                emp_codigo_emp: true,
                mar_ubi_ubicaciones: { select: { ubi_nombre: true } },
                mar_con_contrataciones: { select: { con_nombre: true } },
              }
            },
          },
        },
      },
    });
    var employes = [];
    for (let index = 0; index < empleados[0].mar_asi_asignacion.length; index++) {
      const element = empleados[0].mar_asi_asignacion[index];
      employes.push(element);
    }

    return employes;
  }

  async getEmployes(id: string, user: mar_usr_usuario, codeEmploye: PaginationDto) {
    var empresa = await this.prisma.mar_ctr_contratos.findFirst({
      where: { ctr_estado: 'ACTIVE', ctr_codigo: id, ctr_codusr: user.usr_codigo },
      select: { mar_epr_empresas: true },
    });
    if (!empresa) throw new NotFoundException('Registro no encontrado');

    var or_ = {};
    var arrayWhere = [];
    var arrayWords = codeEmploye.query.split(' ');
    arrayWords.forEach((contains) => {
      if (contains.length > 0) {
        arrayWhere.push({
          emp_nombres: {
            contains,
            mode: 'insensitive',
          },
        });
        arrayWhere.push({
          emp_apellidos: {
            contains,
            mode: 'insensitive',
          },
        });
        arrayWhere.push({
          emp_codigo_emp: {
            contains,
            mode: 'insensitive',
          },
        });
      }
    });
    or_ = { OR: arrayWhere };
    return await this.prisma.mar_emp_empleados.findMany({
      where: {
        emp_codemp: empresa.mar_epr_empresas.epr_codigo, emp_estado: 'ACTIVE', ...or_,
      },
      select: {
        emp_codigo: true,
        emp_nombres: true,
        emp_apellidos: true,
        emp_codigo_emp: true,
      }
    });
  }

  async getDays() {
    return await this.prisma.mar_dia_dias.findMany({
      where: { dia_estado: 'ACTIVE' },
      select: { dia_codigo: true, dia_nombre: true, dia_dia_codigo: true, },
    });
  }
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    user: mar_usr_usuario,
  ) {
    await this.findOne(id);
    var ctr_fecha_inicio = convert_date(updateProjectDto.ctr_fecha_inicio);
    var ctr_fecha_fin = convert_date(updateProjectDto.ctr_fecha_fin);
    ctr_fecha_fin.setHours(ctr_fecha_fin.getHours() + 23);
    ctr_fecha_fin.setMinutes(ctr_fecha_fin.getMinutes() + 59);
    if (ctr_fecha_inicio.getTime() > ctr_fecha_fin.getTime()) {
      throw new InternalServerErrorException(
        'Las fecha de inicio del proyecto no debe ser mayor a la fecha final',
      );
    }
    try {
      var data: any = {
        ctr_nombre: updateProjectDto.ctr_nombre,
        ctr_num_contrato: updateProjectDto.ctr_numero_contrato,
        ctr_fecha_inicio,
        ctr_fecha_fin,
        ctr_usrmod: user.usr_nombres + ' ' + user.usr_apellidos,
        ctr_codepr: updateProjectDto.marca_ctr_empre,
        ctr_horas_extras: updateProjectDto.horas_extras,
        ctr_fecha_inipro:
          updateProjectDto.ctr_fecha_inicio_pro != null
            ? convert_date(updateProjectDto.ctr_fecha_inicio_pro)
            : null,
        ctr_fecha_finpro:
          updateProjectDto.ctr_fecha_fin_pro != null
            ? convert_date(updateProjectDto.ctr_fecha_fin_pro)
            : null,
      };
      var respDb = await this.prisma.mar_ctr_contratos.update({
        where: { ctr_codigo: id, ctr_estado: 'ACTIVE' },
        data,
      });
      if (!respDb) throw new NotFoundException('Registro no encontrado');
      return respDb;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string, user: mar_usr_usuario) {
    await this.findOne(id);
    try {
      var respDb = await this.prisma.mar_ctr_contratos.update({
        where: { ctr_codigo: id, ctr_estado: 'ACTIVE' },
        data: {
          ctr_estado: 'INACTIVE',
          ctr_usrmod: user.usr_nombres + ' ' + user.usr_apellidos,
        },
      });
    } catch (error) {
      return error;
    }
    return respDb;
  }
}
