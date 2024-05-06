import { Module } from '@nestjs/common'
import { ParameterModule } from './parameter/parameter.module'

@Module({
  imports: [ParameterModule],
})
export class ApplicationModule {}
