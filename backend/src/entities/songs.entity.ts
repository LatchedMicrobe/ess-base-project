import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import Album from "./albuns.entity";
import MusicHistory from './musichistory.entity'

@Entity()
class Song {
    @PrimaryGeneratedColumn()
    songID: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    path: string;

    // @Column({ nullable: false })
    // artist_id: number;

    @Column({ default: 0 })
    views: number;

    @ManyToOne(() => Album, (album) => album.songs, {onDelete: "CASCADE"})
    @JoinColumn({name: "albumId"})
    album: Album;

    @OneToMany(() => MusicHistory, (musicHistory) => musicHistory.song, {onDelete:"CASCADE"})
    musicHistory: MusicHistory[];

}

export default Song;
