import { ControlGroup } from '../../src/group-control/entities'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class ControlGroups1718395776156 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const controlGroups = [
      {
        objective: 'AYUDAR CON CONTROL DE ACCESOS',
        description:
          'CONTROL QUE PERMITE EL ACCESO A LOS RECURSOS DE INFORMACIÓN Y APLICACIONES DE ACUERDO A LOS PRIVILEGIOS ASIGNADOS',
        code: 'C-12',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE PERMITE EL ACCESO A LOS RECURSOS DE INFORMACIÓN Y APLICACIONES DE ACUERDO A LOS PRIVILEGIOS ASIGNADOS',
        groupCode: 'CA-123',
        idTemplate: '1',
      },

      {
        objective: 'AYUDAR CON CONTROL DE ACCESOS',
        description:
          'CONTROL QUE PERMITE EL ACCESO A LOS RECURSOS DE INFORMACIÓN Y APLICACIONES DE ACUERDO A LOS PRIVILEGIOS ASIGNADOS',
        code: 'C-12',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE PERMITE EL ACCESO A LOS RECURSOS DE INFORMACIÓN Y APLICACIONES DE ACUERDO A LOS PRIVILEGIOS ASIGNADOS',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'RESTRINGIR EL ACCESO NO AUTORIZADO',
        description:
          'CONTROL QUE RESTRINGE EL ACCESO A LOS SISTEMAS Y DATOS A USUARIOS AUTORIZADOS ÚNICAMENTE',
        code: 'C-13',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE RESTRINGE EL ACCESO A LOS SISTEMAS Y DATOS A USUARIOS AUTORIZADOS ÚNICAMENTE',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'REGISTRAR INTENTOS DE ACCESO',
        description:
          'CONTROL QUE MANTIENE UN REGISTRO DE TODOS LOS INTENTOS DE ACCESO EXITOSOS Y FALLIDOS',
        code: 'C-14',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE MANTIENE UN REGISTRO DE TODOS LOS INTENTOS DE ACCESO EXITOSOS Y FALLIDOS',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'MONITOREAR ACTIVIDAD DE USUARIO',
        description:
          'CONTROL QUE MONITOREA Y REGISTRA LA ACTIVIDAD DE LOS USUARIOS EN LOS SISTEMAS PARA DETECTAR ACTIVIDADES INUSUALES O NO AUTORIZADAS',
        code: 'C-15',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE MONITOREA Y REGISTRA LA ACTIVIDAD DE LOS USUARIOS EN LOS SISTEMAS PARA DETECTAR ACTIVIDADES INUSUALES O NO AUTORIZADAS',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'VERIFICAR IDENTIDAD DE USUARIOS',
        description:
          'CONTROL QUE VERIFICA LA IDENTIDAD DE LOS USUARIOS ANTES DE PERMITIR EL ACCESO A LOS RECURSOS',
        code: 'C-16',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE VERIFICA LA IDENTIDAD DE LOS USUARIOS ANTES DE PERMITIR EL ACCESO A LOS RECURSOS',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'GESTIONAR PRIVILEGIOS DE ACCESO',
        description:
          'CONTROL QUE ASEGURA QUE LOS PRIVILEGIOS DE ACCESO SE OTORGUEN Y REVOQUEN SEGÚN SEA NECESARIO',
        code: 'C-17',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE ASEGURA QUE LOS PRIVILEGIOS DE ACCESO SE OTORGUEN Y REVOQUEN SEGÚN SEA NECESARIO',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'IMPLEMENTAR AUTENTICACIÓN MULTIFACTOR',
        description:
          'CONTROL QUE REQUIERE MÚLTIPLES FORMAS DE VERIFICACIÓN PARA AUTENTICAR A LOS USUARIOS',
        code: 'C-18',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE REQUIERE MÚLTIPLES FORMAS DE VERIFICACIÓN PARA AUTENTICAR A LOS USUARIOS',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'PROTEGER CONTRASEÑAS',
        description:
          'CONTROL QUE ASEGURA QUE LAS CONTRASEÑAS SEAN ALMACENADAS Y TRANSMITIDAS DE MANERA SEGURA',
        code: 'C-19',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE ASEGURA QUE LAS CONTRASEÑAS SEAN ALMACENADAS Y TRANSMITIDAS DE MANERA SEGURA',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'REVOCAR ACCESOS NO UTILIZADOS',
        description:
          'CONTROL QUE REVISA Y REVOCAR ACCESOS QUE NO HAN SIDO UTILIZADOS DURANTE UN PERIODO DE TIEMPO ESPECÍFICO',
        code: 'C-20',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE REVISA Y REVOCAR ACCESOS QUE NO HAN SIDO UTILIZADOS DURANTE UN PERIODO DE TIEMPO ESPECÍFICO',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'AUDITAR PERMISOS DE ACCESO',
        description:
          'CONTROL QUE REALIZA AUDITORÍAS REGULARES DE LOS PERMISOS DE ACCESO PARA ASEGURAR QUE SON APROPIADOS',
        code: 'C-21',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE REALIZA AUDITORÍAS REGULARES DE LOS PERMISOS DE ACCESO PARA ASEGURAR QUE SON APROPIADOS',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'RESTRINGIR ACCESO A DATOS SENSIBLES',
        description:
          'CONTROL QUE LIMITA EL ACCESO A DATOS SENSIBLES SOLO A PERSONAL AUTORIZADO',
        code: 'C-22',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE LIMITA EL ACCESO A DATOS SENSIBLES SOLO A PERSONAL AUTORIZADO',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'AUTORIZAR DISPOSITIVOS DE ACCESO',
        description:
          'CONTROL QUE ASEGURA QUE SOLO DISPOSITIVOS AUTORIZADOS PUEDAN CONECTARSE A LA RED',
        code: 'C-23',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE ASEGURA QUE SOLO DISPOSITIVOS AUTORIZADOS PUEDAN CONECTARSE A LA RED',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'IMPLEMENTAR POLÍTICAS DE SEGURIDAD',
        description:
          'CONTROL QUE DEFINE Y APLICA POLÍTICAS DE SEGURIDAD PARA EL ACCESO A SISTEMAS Y DATOS',
        code: 'C-24',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE DEFINE Y APLICA POLÍTICAS DE SEGURIDAD PARA EL ACCESO A SISTEMAS Y DATOS',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'CONFIGURAR NIVELES DE ACCESO',
        description:
          'CONTROL QUE CONFIGURA Y GESTIONA DIFERENTES NIVELES DE ACCESO BASADOS EN ROLES Y RESPONSABILIDADES',
        code: 'C-25',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE CONFIGURA Y GESTIONA DIFERENTES NIVELES DE ACCESO BASADOS EN ROLES Y RESPONSABILIDADES',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'PROTEGER CONTRA ACCESOS EXTERNOS',
        description:
          'CONTROL QUE IMPLEMENTA MEDIDAS DE SEGURIDAD PARA PROTEGER LOS SISTEMAS CONTRA ACCESOS NO AUTORIZADOS DESDE EL EXTERIOR',
        code: 'C-26',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE IMPLEMENTA MEDIDAS DE SEGURIDAD PARA PROTEGER LOS SISTEMAS CONTRA ACCESOS NO AUTORIZADOS DESDE EL EXTERIOR',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'REVISIONES PERIÓDICAS DE ACCESOS',
        description:
          'CONTROL QUE REALIZA REVISIONES PERIÓDICAS PARA ASEGURAR QUE LOS ACCESOS OTORGADOS SIGUEN SIENDO NECESARIOS',
        code: 'C-27',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE REALIZA REVISIONES PERIÓDICAS PARA ASEGURAR QUE LOS ACCESOS OTORGADOS SIGUEN SIENDO NECESARIOS',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'BLOQUEAR ACCESOS AUTOMÁTICOS',
        description:
          'CONTROL QUE IMPLEMENTA MECANISMOS PARA BLOQUEAR ACCESOS AUTOMÁTICOS Y NO AUTORIZADOS A SISTEMAS',
        code: 'C-28',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE IMPLEMENTA MECANISMOS PARA BLOQUEAR ACCESOS AUTOMÁTICOS Y NO AUTORIZADOS A SISTEMAS',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'SEGURIDAD EN ACCESO REMOTO',
        description:
          'CONTROL QUE IMPLEMENTA MEDIDAS DE SEGURIDAD PARA PROTEGER EL ACCESO REMOTO A LOS SISTEMAS',
        code: 'C-29',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE IMPLEMENTA MEDIDAS DE SEGURIDAD PARA PROTEGER EL ACCESO REMOTO A LOS SISTEMAS',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'MONITOREO DE ACTIVIDAD INUSUAL',
        description:
          'CONTROL QUE MONITOREA Y DETECTA ACTIVIDADES INUSUALES O NO AUTORIZADAS EN LOS SISTEMAS',
        code: 'C-30',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE MONITOREA Y DETECTA ACTIVIDADES INUSUALES O NO AUTORIZADAS EN LOS SISTEMAS',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
      {
        objective: 'CONTROL DE ACCESO FÍSICO',
        description:
          'CONTROL QUE RESTRINGE EL ACCESO FÍSICO A LAS INSTALACIONES Y EQUIPOS SENSIBLES',
        code: 'C-31',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE RESTRINGE EL ACCESO FÍSICO A LAS INSTALACIONES Y EQUIPOS SENSIBLES',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
    ]
    const newControlGroups = controlGroups.map((controlGroup) => {
      return new ControlGroup({
        objective: controlGroup.objective,
        objectiveDescription: controlGroup.description,
        objectiveCode: controlGroup.code,
        group: controlGroup.group,
        groupDescription: controlGroup.groupDescription,
        groupCode: controlGroup.groupCode,
        idTemplate: controlGroup.idTemplate,
      })
    })
    await queryRunner.manager.save(newControlGroups)
  }

  //eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
