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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    TypeOrmModule.forRoot(DataSourceConfig),
    TypeOrmModule.forFeature([Parameter, Template]),
  ],
  controllers: [AuditController, ParameterController, TemplateController],
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
    ParameterService,
    TemplateService,
  ],
})
export class AuditModule {}
