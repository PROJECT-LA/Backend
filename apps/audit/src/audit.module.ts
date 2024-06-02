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
import { DataSourceConfig } from './db/orm-config-source'
import { TemplateRepository } from './template/repository'
import { Template } from './template/entities'
import { TemplateController } from './template/controller'
import { TemplateService } from './template/service'
import { ControlRepository } from './control/repository/control.repository'
import { ControlService } from './control/service'
import { Control } from './control/entities'
import { ControlController } from './control/controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    TypeOrmModule.forRoot(DataSourceConfig),
    TypeOrmModule.forFeature([Parameter, Template, Control]),
  ],
  controllers: [
    AuditController,
    ParameterController,
    TemplateController,
    ControlController,
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
      provide: 'IControlRepository',
      useClass: ControlRepository,
    },
    ParameterService,
    TemplateService,
    ControlService,
  ],
})
export class AuditModule {}
