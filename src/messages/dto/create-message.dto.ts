import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {

  @IsString()
  @IsNotEmpty()
  boardPassword: string;

  @IsString()
  @IsNotEmpty()
  token: string;

}
