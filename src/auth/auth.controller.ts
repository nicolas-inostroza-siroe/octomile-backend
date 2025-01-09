import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { Auth, RawHeaders, RoleProtected, GetUser } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post("register")
  create(@Body() creasteUserDto: CreateUserDto) {
    return this.authService.create(creasteUserDto);
  }

  @Post("register-admin")
  createAdmint(@Body() creasteUserDto: CreateUserDto) {
    return this.authService.createAdministrador(creasteUserDto);
  }




  @Post("login")
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get("status")
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get("private")
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser("email") email: string,
    @RawHeaders() rawHeader: string[]
  ) {

    console.log({ rawHeader });

    return {
      ok: true,
      message: "Hola mundo en private",
      user,
      email
    }
  }




}
