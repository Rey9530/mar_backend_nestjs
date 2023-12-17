-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "mar_gen_generos" (
    "gen_codigo" TEXT NOT NULL,
    "gen_nombre" TEXT NOT NULL,
    "gen_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "gen_feccrea" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gen_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gen_usrcrea" TEXT NOT NULL,
    "gen_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_gen_pk" PRIMARY KEY ("gen_codigo")
);

-- CreateTable
CREATE TABLE "mar_dia_dias" (
    "dia_codigo" TEXT NOT NULL,
    "dia_nombre" TEXT NOT NULL,
    "dia_dia_codigo" TEXT NOT NULL,
    "dia_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "dia_feccrea" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dia_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dia_usrcrea" TEXT NOT NULL,
    "dia_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_dia_pk" PRIMARY KEY ("dia_codigo")
);

-- CreateTable
CREATE TABLE "mar_ubi_ubicaciones" (
    "ubi_codigo" TEXT NOT NULL,
    "ubi_nombre" TEXT NOT NULL,
    "ubi_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "ubi_feccrea" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ubi_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ubi_usrcrea" TEXT NOT NULL,
    "ubi_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_ubi_pk" PRIMARY KEY ("ubi_codigo")
);

-- CreateTable
CREATE TABLE "mar_con_contrataciones" (
    "con_codigo" TEXT NOT NULL,
    "con_nombre" TEXT NOT NULL,
    "con_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "con_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "con_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "con_usrcrea" TEXT NOT NULL,
    "con_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_con_pk" PRIMARY KEY ("con_codigo")
);

-- CreateTable
CREATE TABLE "mar_epr_empresas" (
    "epr_codigo" TEXT NOT NULL,
    "epr_nombre" TEXT NOT NULL,
    "epr_direccion" TEXT NOT NULL,
    "epr_contacto_nombre" TEXT NOT NULL,
    "epr_contacto_correo" TEXT NOT NULL,
    "epr_contacto_telefono" TEXT NOT NULL,
    "epr_usrcrea" TEXT NOT NULL,
    "epr_usrmod" TEXT NOT NULL,
    "epr_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "epr_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "epr_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "mar_epr_pk" PRIMARY KEY ("epr_codigo")
);

-- CreateTable
CREATE TABLE "mar_emp_empleados" (
    "emp_codigo" TEXT NOT NULL,
    "emp_codigo_emp" TEXT NOT NULL,
    "emp_fecha_nacimiento" DATE NOT NULL,
    "emp_nombres" TEXT NOT NULL,
    "emp_apellidos" TEXT NOT NULL,
    "emp_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "emp_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emp_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emp_usrcrea" TEXT NOT NULL,
    "emp_usrmod" TEXT NOT NULL,
    "emp_codgen" TEXT NOT NULL,
    "emp_codemp" TEXT NOT NULL,
    "emp_codubi" TEXT NOT NULL,
    "emp_codcon" TEXT NOT NULL,

    CONSTRAINT "mar_emp_pk" PRIMARY KEY ("emp_codigo")
);

-- CreateTable
CREATE TABLE "mar_usr_usuario" (
    "usr_codigo" TEXT NOT NULL,
    "usr_codigo_emple" TEXT NOT NULL,
    "usr_nombres" TEXT NOT NULL,
    "usr_apellidos" TEXT NOT NULL,
    "usr_contrasenia" TEXT NOT NULL,
    "usr_inten_inicio" SMALLINT NOT NULL DEFAULT 0,
    "usr_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "usr_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usr_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usr_usrcrea" TEXT NOT NULL,
    "usr_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_usr_pk" PRIMARY KEY ("usr_codigo")
);

-- CreateTable
CREATE TABLE "mar_ctr_contratos" (
    "ctr_codigo" TEXT NOT NULL,
    "ctr_nombre" TEXT NOT NULL,
    "ctr_num_contrato" TEXT NOT NULL,
    "ctr_horas_extras" INTEGER NOT NULL,
    "ctr_fecha_inicio" TIMESTAMP(3) NOT NULL,
    "ctr_fecha_fin" TIMESTAMP(3) NOT NULL,
    "ctr_fecha_inipro" TIMESTAMP(3),
    "ctr_fecha_finpro" TIMESTAMP(3),
    "ctr_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "ctr_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ctr_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ctr_usrcrea" TEXT NOT NULL,
    "ctr_usrmod" TEXT NOT NULL,
    "ctr_codepr" TEXT NOT NULL,
    "ctr_codusr" TEXT NOT NULL,

    CONSTRAINT "mar_ctr_pk" PRIMARY KEY ("ctr_codigo")
);

-- CreateTable
CREATE TABLE "mar_hor_horarios" (
    "hor_codigo" TEXT NOT NULL,
    "hor_nombre" TEXT NOT NULL,
    "hor_codctro" TEXT NOT NULL,
    "hor_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "hor_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hor_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hor_usrcrea" TEXT NOT NULL,
    "hor_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_hor_pk" PRIMARY KEY ("hor_codigo")
);

-- CreateTable
CREATE TABLE "mar_hde_detalle_ho" (
    "hde_codigo" TEXT NOT NULL,
    "hde_codhor" TEXT NOT NULL,
    "hor_coddia" TEXT NOT NULL,
    "hde_orden" TEXT,
    "hde_inicio_1" TEXT NOT NULL,
    "hde_fin_1" TEXT NOT NULL,
    "hde_inicio_2" TEXT NOT NULL,
    "hde_fin_2" TEXT NOT NULL,
    "hde_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "hde_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hde_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hde_usrcrea" TEXT NOT NULL,
    "hde_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_hde_pk" PRIMARY KEY ("hde_codigo")
);

-- CreateTable
CREATE TABLE "mar_asi_asignacion" (
    "asi_codigo" TEXT NOT NULL,
    "asi_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "asi_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asi_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asi_usrcrea" TEXT NOT NULL,
    "asi_usrmod" TEXT NOT NULL,
    "asi_codhor" TEXT NOT NULL,
    "asi_codemp" TEXT NOT NULL,

    CONSTRAINT "mar_asi_pk" PRIMARY KEY ("asi_codigo")
);

-- CreateTable
CREATE TABLE "mar_his_historial" (
    "his_codigo" TEXT NOT NULL,
    "his_hora_entrada" TIMESTAMP(3) NOT NULL,
    "his_hora_salida" TIMESTAMP(3) NOT NULL,
    "his_tp_trabajado" TIME NOT NULL,
    "his_tp_extra" TIME NOT NULL,
    "emp_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "his_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "his_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "his_usrcrea" TEXT NOT NULL,
    "his_usrmod" TEXT NOT NULL,
    "his_codasi" TEXT NOT NULL,

    CONSTRAINT "mar_his_pk" PRIMARY KEY ("his_codigo")
);

-- AddForeignKey
ALTER TABLE "mar_emp_empleados" ADD CONSTRAINT "mar_emp_gen_fk" FOREIGN KEY ("emp_codgen") REFERENCES "mar_gen_generos"("gen_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_emp_empleados" ADD CONSTRAINT "mar_emp_ubi_fk" FOREIGN KEY ("emp_codubi") REFERENCES "mar_ubi_ubicaciones"("ubi_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_emp_empleados" ADD CONSTRAINT "mar_emp_con_fk" FOREIGN KEY ("emp_codcon") REFERENCES "mar_con_contrataciones"("con_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_ctr_contratos" ADD CONSTRAINT "mar_ctr_epr_fk" FOREIGN KEY ("ctr_codepr") REFERENCES "mar_epr_empresas"("epr_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_ctr_contratos" ADD CONSTRAINT "mar_ctr_usr_fk" FOREIGN KEY ("ctr_codusr") REFERENCES "mar_usr_usuario"("usr_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_hor_horarios" ADD CONSTRAINT "mar_hor_ctro_fk" FOREIGN KEY ("hor_codctro") REFERENCES "mar_ctr_contratos"("ctr_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_hde_detalle_ho" ADD CONSTRAINT "mar_hde_hor_fk" FOREIGN KEY ("hde_codhor") REFERENCES "mar_hor_horarios"("hor_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_hde_detalle_ho" ADD CONSTRAINT "mar_hor_dia_fk" FOREIGN KEY ("hor_coddia") REFERENCES "mar_dia_dias"("dia_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_asi_asignacion" ADD CONSTRAINT "mar_asi_hor_fk" FOREIGN KEY ("asi_codhor") REFERENCES "mar_hor_horarios"("hor_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_asi_asignacion" ADD CONSTRAINT "mar_asi_emp_fk" FOREIGN KEY ("asi_codemp") REFERENCES "mar_emp_empleados"("emp_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_his_historial" ADD CONSTRAINT "mar_his_asi_fk" FOREIGN KEY ("his_codasi") REFERENCES "mar_asi_asignacion"("asi_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;
