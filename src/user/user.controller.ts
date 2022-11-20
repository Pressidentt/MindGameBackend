import { UserService } from 'src/user/user.service';
import { Controller, Get } from "@nestjs/common";

@Controller('user')
export class UserController{
    constructor(private userSerive: UserService) {}

    @Get() 
    async getUser() {
        return await this.userSerive.getUsers()
    }
}