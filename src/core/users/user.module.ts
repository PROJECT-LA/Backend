import { Module } from '@nestjs/common'
import { UserService } from './service'
import { UserController } from './controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersRepository } from './repository'
import { TextService } from 'src/common/lib'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UsersRepository, TextService],
  exports: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
