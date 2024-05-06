import { Module } from '@nestjs/common'
import { UserService } from './service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersRepository } from './repository'
import { UsersController } from './controller'
import { RolesRepository } from '../roles/repository'
import { TextService } from 'src/common'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UsersRepository, TextService, RolesRepository],
  exports: [UserService],
  controllers: [UsersController],
})
export class UsersModule {}
