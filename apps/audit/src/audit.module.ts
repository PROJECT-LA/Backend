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
import { MaturityLevel } from './level/entities'
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
      MaturityLevel,
      Control,
      Audit,
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
    ParameterService,
    TemplateService,
    ControlGroupService,
    LevelService,
    ControlService,
    AuditService,
    ExternalUserService,
  ],
})
export class AuditModule {}
