import {Entity, Column, PrimaryColumn} from "typeorm"

@Entity()
class Artist {

    @PrimaryColumn()
    login: string;

    @Column({nullable: false, unique: true})
    name: string;
    
    @Column({nullable: false, unique: true})
    email: string;
    
    @Column({nullable: false})
    password: string;
    
    @Column()
    bio?: string;
}

export default Artist