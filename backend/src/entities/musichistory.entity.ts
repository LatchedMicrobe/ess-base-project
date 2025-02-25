import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn} from 'typeorm'
import User from './user.entity'
import Songs from './songs.entity'



@Entity()
class MusicHistory {
    @PrimaryGeneratedColumn()
    musicHistoryId: number;

    @ManyToOne(() => User, (usuario) => usuario.musicHistory, 
        {nullable: false, onDelete: "SET NULL"})
    @JoinColumn({name: "userId"})
    usuario: User;

    @ManyToOne(() => Songs, (song) => song.musicHistory, 
    {nullable: false, onDelete: "CASCADE"})
    @JoinColumn({name: "musicId"})
    song: Songs;
   
  
};



export default MusicHistory;
