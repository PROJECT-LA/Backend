import { Module } from '@nestjs/common'
import { AuditController } from './audit.controller'
import { AuditService } from './audit.service'
import { ConfigModule } from '@nestjs/config'
import { SharedModule, SharedService } from '@app/common'
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
import { Control, ControlGroup } from './group-control/entities'

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
    ]),
  ],
  controllers: [
    AuditController,
    ParameterController,
    TemplateController,
    LevelController,
    ControlGroupController,
  ],
  providers: [
    AuditService,
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
      provide: 'ILevelRepository',
      useClass: LevelRepository,
    },
    ParameterService,
    TemplateService,
    ControlGroupService,
    LevelService,
  ],
})
export class AuditModule {}
