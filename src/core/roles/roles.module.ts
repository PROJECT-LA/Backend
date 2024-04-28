import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from './entities'
import { RolesController } from './controller'
import { RolesRepository } from './repository'
import { RolesService } from './service'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService, RolesRepository],
  controllers: [RolesController],
})
export class RolesModule {}
