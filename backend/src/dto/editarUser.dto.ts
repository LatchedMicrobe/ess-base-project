import { IsDefined, IsInt, isInt, IsOptional, IsString, IsDate, ValidateIf } from "class-validator"

class EditarUserDTO{

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    login: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsString()
    @IsOptional()
    birthday: Date;

}

export default EditarUserDTO