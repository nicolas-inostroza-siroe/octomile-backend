import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from "bcrypt"
import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from '@src/common/common.service';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService
  ) { }


  async create(createUserDto: CreateUserDto) {

    try {

      const { password, ...userDate } = createUserDto;

      const isEmail = await this.userRepository.findOneBy({ email: userDate.email });

      if (isEmail) throw new BadRequestException('El email ingresado ya existe');

      const user = this.userRepository.create({
        ...userDate,
        password: bcrypt.hashSync(password, 10),
        roles: ["operario"]
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.commonService.handleExceptions(error);
    }

  }


  async createAdministrador(createUserDto: CreateUserDto) {
    try {

      const { password, ...userDate } = createUserDto;

      const isEmail = await this.userRepository.findOne({ where: { email: userDate.email } });

      if (isEmail) throw new BadRequestException('El email ingresado ya existe');

      const user = this.userRepository.create({
        ...userDate,
        password: bcrypt.hashSync(password, 10),
        roles: ["operario", "administrador"]
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto;

    // const user = await this.userRepository.findOneBy({ email: email });
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, fullName: true, id: true, roles: true }
    });

    if (!user) throw new UnauthorizedException("Credentials are not valid (email)");

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException("Credential are not valid (password)");


    const { password: test, ...resto } = user

    return {
      ...resto,
      token: this.getJwtToken({ id: user.id })
    };

  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }


  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail);
    }

    console.log(error);

    throw new InternalServerErrorException("Please check server logs ");
  }


}
