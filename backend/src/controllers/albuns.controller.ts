import { Request, Response } from "express";
import AlbumService from "../services/album.service";
import SongService from "../services/songs.service";

class AlbumController {
    albumService: AlbumService;
    songService: SongService;

    constructor() {
        this.albumService = new AlbumService();
        this.songService = new SongService();
    }

    async getAll(req: Request, res: Response) {
        let albums = await this.albumService.getAllAlbums();
        return res.status(200).json(albums);
    }

    async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        let album = null;

        try {
            album = await this.albumService.getAlbumById(id);
        } catch (error) {
            const message = error instanceof Error ? error.message : "ERRO";
            return res.status(404).json(message);
        }

        return res.status(200).json(album);
    }

    async createAlbum(req: Request, res: Response) {
        const { name, genero, subgenero, songs, songs_paths, artist_login, feat} = req.body;

        if (!name || !songs || !genero || !artist_login || !songs_paths) {
            return res.status(400).json("Missing required fields!");
        }

        const fullName = feat ? `${name} (feat. ${feat})` : name;

        let albumInserted = null;
        let tipo = "";

        if (songs.length === 1) {
            tipo = "Single";
        } else if (songs.length === 2) {
            tipo = "Double Single";
        } else if (songs.length <= 5){
            tipo = "EP"
        } else {
            tipo = "Álbum"
        }

        try {
            albumInserted = await this.albumService.insertAlbum(fullName, genero, subgenero, songs, tipo, songs_paths, artist_login);
        } catch (error) {
            const message = error instanceof Error ? error.message : "ERRO";
            return res.status(400).json(message);
        }

        return res.status(201).json(albumInserted);
    }

    async deleteAlbum(req: Request, res: Response) {
        const {artist_login} = req.body;
        const id = parseInt(req.params.id);

        let album = null;

        try {
            await this.songService.deleteSongsByAlbumId(id, artist_login)
            album = await this.albumService.deleteAlbum(id, artist_login);
        } catch (error) {
            const message = error instanceof Error ? error.message : "ERRO";
            return res.status(400).json(message);
        }

        return res.status(200).json(album);
    }

    async updateAlbum(req: Request, res: Response) {
        const {name, genero, subgenero, songs, songs_path, artist_login} = req.body;
        const id = parseInt(req.params.id);
        let album = null;

        try {
            album = await this.albumService.updateAlbum(id, name, genero, subgenero, songs, songs_path, artist_login);
        } catch (error) {
            const message = error instanceof Error ? error.message : "ERRO";
            return res.status(400).json(message);
        }

        return res.status(200).json(album);
    }

    async deleteSongFromAlbum(req: Request, res: Response) {
        const {albumId, songId} = req.params; 
        const {artist_login} = req.body;
        try {
            await this.albumService.deleteSongFromAlbum(parseInt(albumId), parseInt(songId), artist_login);
            return res.status(200).json({ message: "Song deleted successfully." });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error deleting song.";
            return res.status(400).json({ message });
        }
    }
}

export default AlbumController;
