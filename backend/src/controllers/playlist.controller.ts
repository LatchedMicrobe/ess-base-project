import { plainToInstance } from "class-transformer";
import PlaylistService from "../services/playlist.service";
import { Request, Response } from "express";
import CriarPlaylistDTO from "../dto/criarPlaylist.dto";
import { validate } from "class-validator";
import EditarPlaylistDTO from "../dto/editarPlaylist.dto";


class PlaylistController {
    playlistService: PlaylistService

    constructor(){
        this.playlistService = new PlaylistService()
    }

    async getAll(req: Request, res: Response){
        if(req.query.userId){
            let userId = parseInt(req.query.userId as string)
            let playlists = null
            try{
                playlists = await this.playlistService.getAllPlaylistsFromUser(userId)
                console.log(playlists)
            }catch(error){
                const message = error instanceof Error ? error.message : "ERRO"
                return res.status(400).json(message)
            }
            return res.status(200).json(playlists)
        }
        let playlists = await this.playlistService.getAllPlaylists()
        return res.status(200).json(playlists)
    }

    async getById(req: Request, res: Response){
        const id = parseInt(req.params.id)
        let playlist = null
        try{
            playlist = await this.playlistService.getPlaylistById(id)
        }catch(error){
            const message = error instanceof Error ? error.message : "ERRO"
            return res.status(404).json(message)
        }

        return res.status(200).json(playlist)
        
    }

    async createPlaylist(req: Request, res: Response){

        const createDTO = plainToInstance(CriarPlaylistDTO,req.body)
        const errors = await validate(createDTO, {forbidNonWhitelisted:true, whitelist:true})
        if(errors.length > 0){
            return res.status(400).json("wrong body format")
        }
        let name = createDTO.name
        let description = createDTO.description
        let userId = createDTO.userId

        let playlistInserted = null
        try{
            playlistInserted = await this.playlistService.insertPlaylist(name,description,userId)
        }catch(error){
            const message = error instanceof Error ? error.message : "ERRO"
            return res.status(400).json(message)
        }

        return res.status(201).json(playlistInserted)
    }

    async deletePlaylist(req: Request, res: Response){
        let id = parseInt(req.params.id)
        let playlist = null
        try {
            playlist = await this.playlistService.deletePlaylist(id)
        } catch (error) {
            const message = error instanceof Error ? error.message : "ERRO"
            return res.status(400).json(message)
        }
        return res.status(200).json(playlist)
    }

    async updatePlaylist(req: Request,res: Response){
        let id = parseInt(req.params.id)
        const updateDTO = plainToInstance(EditarPlaylistDTO, req.body)
        const errors = await validate(updateDTO, {forbidNonWhitelisted:true, whitelist:true})
        if(errors.length > 0){
            return res.status(400).json("wrong body format")
        }
        let playlist = null
        try{
            playlist = await this.playlistService.updatePlaylist(id,updateDTO.name,updateDTO.description,updateDTO.categories,updateDTO.saveCount, updateDTO.songIds)
        }catch(error){
            const message = error instanceof Error ? error.message : "ERRO"
            return res.status(400).json(message)
        }
        return res.status(200).json(playlist)
    }

}

export default PlaylistController