import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ParameterController } from './controller'
import { ParameterService } from './service'
import { ParameterRepository } from './repository'
import { Parameter } from './entity'
@Module({
  controllers: [ParameterController],
  providers: [ParameterService, ParameterRepository],
  imports: [TypeOrmModule.forFeature([Parameter])],
})
export class ParameterModule {}
