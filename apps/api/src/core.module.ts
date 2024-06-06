import { Module } from '@nestjs/common'

import { SharedModule } from '@app/common'
import { MicroserviceModule } from './microservices/microservice.module'

@Module({
  imports: [
    SharedModule,
    MicroserviceModule,
    SharedModule.registerRmq('FILE_SERVICE', process.env.RABBITMQ_FILE_QUEUE),
  ],
})
export class CoreModule {}
