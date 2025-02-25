import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import SearchService from "../services/search.service";

class SearchController{
    searchService: SearchService

    constructor(){
        this.searchService = new SearchService()
    }

    async searchAll(req:Request,res:Response){
        const description = String(req.query.ds)
        const filter = String(req.query.filter)
        
        let responseArtist = null
        let responseSong = null
        let responsePlaylist = null
        try{
            responseArtist = await this.searchService.searchArtist(description,filter)
            responseSong = await this.searchService.searchSong(description,filter)
            responsePlaylist = await this.searchService.searchPlaylist(description,filter)
        }catch(error){
            const message = error instanceof Error ? error.message : "ERRO"
            return res.status(400).json(message)
        }
        return res.status(200).json([...responseArtist,...responseSong,...responsePlaylist])
    }
}
export default SearchController