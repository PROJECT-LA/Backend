import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AUTH_SERVICE, SharedModule, SharedService } from '@app/common'
import { ParameterController } from './parameter/controller'
import { ParameterRepository } from './parameter/repository'
import { ParameterService } from './parameter/service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Parameter } from './parameter/entity'
import { DataSourceConfig } from '../db/orm-config-source'
import { TemplateRepository } from './template/repository'
import { Template } from './template/entities'
import { TemplateController } from './template/controller'
import { TemplateService } from './template/service'
import { LevelRepository } from './level/repository/level.repository'
import { LevelController } from './level/controller'
import { Level } from './level/entities'
import { LevelService } from './level/service'
import { ControlGroupController } from './group-control/controller'
import { ControlGroupRepository } from './group-control/repository'
import { ControlGroupService } from './group-control/service'
import { ControlGroup } from './group-control/entities'
import { Control } from './control/entities'
import { ControlController } from './control/controller'
import { ControlRepository } from './control/repository'
import { ControlService } from './control/service'
import { AuditController } from './audit/controller'
import { Audit } from './audit/entities'
import { AuditService } from './audit/service'
import { AuditRepository } from './audit/repository'
import { ExternalUserService } from './external/external-user.service'
import { HealthCheckAuditController } from './external/health-check.controller'
import { UserAuditRepository } from './user-audits/repository'
import { UserAuditService } from './user-audits/service/user-audit.service'
import { UserAudit } from './user-audits/entities'
import { UserAuditController } from './user-audits/controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    TypeOrmModule.forRoot(DataSourceConfig),
    TypeOrmModule.forFeature([
      Parameter,
      Template,
      ControlGroup,
      Level,
      Control,
      Audit,
      UserAudit,
    ]),
    SharedModule.registerRmq(AUTH_SERVICE, process.env.RABBITMQ_AUTH_QUEUE),
  ],
  controllers: [
    ParameterController,
    TemplateController,
    LevelController,
    ControlGroupController,
    ControlController,
    AuditController,
    HealthCheckAuditController,
    UserAuditController,
  ],
  providers: [
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
    {
      provide: 'IParameterRepository',
      useClass: ParameterRepository,
    },
    {
      provide: 'ITemplateRepository',
      useClass: TemplateRepository,
    },
    {
      provide: 'IControlGroupRepository',
      useClass: ControlGroupRepository,
    },
    {
      provide: 'IControlRepository',
      useClass: ControlRepository,
    },
    {
      provide: 'ILevelRepository',
      useClass: LevelRepository,
    },
    {
      provide: 'IAuditRepository',
      useClass: AuditRepository,
    },
    {
      provide: 'IUserAuditRepository',
      useClass: UserAuditRepository,
    },
    ParameterService,
    TemplateService,
    ControlGroupService,
    LevelService,
    ControlService,
    AuditService,
    ExternalUserService,
    UserAuditService,
  ],
})
export class AuditModule {}
