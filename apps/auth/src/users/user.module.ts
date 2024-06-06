import { Module } from '@nestjs/common'
import { User } from './entities'
import { UserController } from './controller'
import { UserService } from './service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
