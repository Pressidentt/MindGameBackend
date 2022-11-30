import { UserService } from 'src/user/user.service';
import { Controller, Get } from "@nestjs/common";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    async getUser() {
        return await this.userService.getUsers()
    }
}