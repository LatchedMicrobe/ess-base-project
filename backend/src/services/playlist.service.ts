import { DataSource, Repository, In } from "typeorm";
import Playlist from "../entities/playlist.entity";
import dbConn from "../database/postgresConnection";
import User from "../entities/user.entity";
import Category from "../entities/category.entity";
import Song from "../entities/songs.entity";

class PlaylistService{
    playlistRepository: Repository<Playlist>
    userRepository: Repository<User>
    categoryRepository: Repository<Category>
    songRepository: Repository<Song>

    constructor(){
        this.playlistRepository = dbConn.getRepository(Playlist)
        this.userRepository = dbConn.getRepository(User)
        this.categoryRepository = dbConn.getRepository(Category)
        this.songRepository  = dbConn.getRepository(Song)
    }

    async getAllPlaylists() : Promise<Playlist[]>{
        return await this.playlistRepository.find({relations:["user","songs","songs.album"]})
    }

    async insertPlaylist(name:string,description: string, userId: number) : Promise<Playlist>{
        let userOfPlaylist  = await this.userRepository.findOne({where:{userID:userId}})
        if(!userOfPlaylist){
            throw new Error("user not found!")
        }
        
        let playlist = new Playlist()
        playlist.name = name
        playlist.description = description
        playlist.user = userOfPlaylist
        playlist.saveCount = 0
        
        return await this.playlistRepository.save(playlist)
        
    }

    async getPlaylistById(id:number) : Promise<Playlist>{
        let playlist = await this.playlistRepository.findOne({where:{playlistID:id}, relations: ["user","songs","songs.album"]})
        if(!playlist){
            throw new Error("playlist not found")
        }

        return playlist
    }

    async getAllPlaylistsFromUser(userId:number): Promise<Playlist[]>{
        let user = await this.userRepository.findOne({where:{userID:userId}, relations:["playlists"]})
        if(!user){
            throw new Error("user not found")
        }
        return user.playlists
    }

    async updatePlaylist(id:number, name:string, description:string, categories:number[], saveCount:number, songIds:number[]) : Promise<Playlist> {
        let playlist = await this.playlistRepository.findOne({where:{playlistID:id}, relations:["user", "songs"]})
        let categoryList = await this.categoryRepository.findBy({categoryID : In(categories)})
        if(!playlist){
            throw new Error("playlist not found")
        }
        playlist.name = name
        playlist.description = description
        playlist.saveCount = saveCount
        let songs = []
        for (let i = 0; i < songIds.length; i++) {
            let song = await this.songRepository.findOne({where:{songID:songIds[i]}})
            if(!song){
                throw new Error(`song of id ${songIds[i]} was not found`)
            }
            songs.push(song)
        }
        playlist.songs = songs
        playlist.categories = categoryList
        return await this.playlistRepository.save(playlist)
    }

    async deletePlaylist(id:number) : Promise<Playlist> {
        let playlist = await this.playlistRepository.findOne({where:{playlistID:id}, relations:["user","songs"]})
        if(!playlist){
            throw new Error("playlist not found!")
        }
        await this.playlistRepository.delete(playlist.playlistID)
        return playlist
        
    }

}

export default PlaylistService