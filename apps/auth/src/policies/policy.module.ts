import { Module } from '@nestjs/common'
import { CasbinModule } from './config'
import { PolicyController } from './controller'
import { PolicyService } from './service'

@Module({
  imports: [CasbinModule],
  controllers: [PolicyController],
  providers: [PolicyService],
})
export class PolicyModule {}
