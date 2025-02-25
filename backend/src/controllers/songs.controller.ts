import { Request, Response } from "express";
import SongService from "../services/songs.service";

class SongController {
    songService: SongService;

    constructor() {
        this.songService = new SongService();
    }

    async getAll(req: Request, res: Response) {
        try {
            const songs = await this.songService.getAllSongs();
            return res.status(200).json(songs); 
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro no Servidor";
            return res.status(500).json({ message });
        }
    }

    async getSongById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        try {
            const song = await this.songService.getSongById(Number(id));
            return res.status(200).json(song);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro no Servidor";
            return res.status(500).json({ message });
        }
    }
}

export default SongController;
