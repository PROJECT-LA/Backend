import { Module } from '@nestjs/common'
import { RolesService } from './service/roles.service'
import { RolesController } from './controller/roles.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from './entities'
import { RolesRepository } from './repository'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
})
export class RolesModule {}
