import { DataSource } from "typeorm";
import User from "../entities/user.entity";
import Playlist from "../entities/playlist.entity";
import MusicHistory from '../entities/musichistory.entity'
import Artist from "../entities/artist.entity";
import Album from "../entities/albuns.entity"
import Song from "../entities/songs.entity"
import Category from "../entities/category.entity";


const dbConn = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "12345678",
    database: process.env.DB_NAME,
    entities: [User,Playlist,Category,Album,Song,Artist, MusicHistory],
    synchronize: true,
    logging: false
})


export default dbConn