import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Playlist from "./playlist.entity";
import MusicHistory from "./musichistory.entity";

@Entity()
class User{
    @PrimaryGeneratedColumn()
    userID: number

    @Column({nullable:false, unique: true})
    login: string

    @Column({nullable:false})
    name: string

    @Column({nullable:false, unique:true})
    email: string

    @Column({nullable:false})
    password: string

    @Column({nullable:true, type: "date"})
    birthday: Date | null

    @Column({type: "varchar", nullable:true})
    recoverytoken: string | null

    @Column({type: "bigint", nullable:true})
    recoveryexpire: number | null
    
    @OneToMany(() => Playlist, (playlist) => playlist.user, {
        onDelete: "CASCADE"
    })
    playlists: Playlist[]

    @OneToMany(() => MusicHistory, (musicHistory) => musicHistory.usuario, {
        onDelete: "CASCADE"
    })
    musicHistory: MusicHistory[]

}

export default User
