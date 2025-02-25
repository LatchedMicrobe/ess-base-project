import { IsArray, IsDefined, IsIn, IsInt, IsNotEmpty, IsString, Min } from "class-validator"

class EditarPlaylistDTO{

    @IsString()
    @IsDefined()
    name:string

    @IsString()
    @IsDefined()
    description: string

    @IsDefined()
    @IsArray()
    @IsInt({each:true})
    categories : number[]

    @IsInt()
    @IsDefined()
    @Min(0)
    saveCount: number

    @IsDefined()
    @IsArray()
    @IsInt({each:true})
    songIds: number[]
}

export default EditarPlaylistDTO