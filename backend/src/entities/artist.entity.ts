import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm"
import Album from "./albuns.entity";

@Entity()
class Artist {

    @PrimaryColumn()
    login: string;

    @Column({nullable: false, unique: true})
    name: string;
    
    @Column({select: false, nullable: false, unique: true})
    email: string;
    
    @Column({select: false, nullable: false})
    password: string;
    
    @Column({nullable: true})
    bio?: string;

    @OneToMany(() => Album, album => album.artist, {
        onDelete: "CASCADE"
    })
    albuns: Album[];
}

export default Artist