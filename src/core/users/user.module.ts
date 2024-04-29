import { Module } from '@nestjs/common'
import { UserService } from './service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersRepository } from './repository'
import { TextService } from 'src/common/lib'
import { UsersController } from './controller'
import { RolesRepository } from '../roles/repository'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UsersRepository, TextService, RolesRepository],
  exports: [UserService],
  controllers: [UsersController],
})
export class UsersModule {}
