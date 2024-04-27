import { Module } from '@nestjs/common'
import { UserService } from './service'
import { UserController } from './controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersRepository } from './repository'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UsersRepository],
  exports: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
