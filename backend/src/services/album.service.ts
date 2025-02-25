import { DataSource, Repository, EntityManager } from "typeorm";
import Album from "../entities/albuns.entity";
import dbConn from "../database/postgresConnection";
import Song from "../entities/songs.entity";
import { plainToClass } from "class-transformer";
import Artist from "../entities/artist.entity";
import ArtistService from "./artist.service";

class AlbumService {
    albumRepository: Repository<Album>;
    songRepository: Repository<Song>;
    

    constructor() {
        this.albumRepository = dbConn.getRepository(Album);
        this.songRepository = dbConn.getRepository(Song);
    }

    async getAllAlbums(): Promise<Album[]> {
        return await this.albumRepository.find();
    }

    async getAlbumById(id: number): Promise<Album> {
        const album = await this.albumRepository.findOne({ where: { albumID: id } });
        if (!album) {
            throw new Error("Album not found");
        }
        return album;
    }

    async insertAlbum(name: string, genero:string, subgenero:string, songs: string[], tipo: string, songs_path: string[], artist_login: string): Promise<Album> {
        
        return await this.albumRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {

            const artistRepo = new ArtistService();
            const artist = await artistRepo.getArtistByLogin(artist_login);
            if (!artist) {
                throw new Error("Artista não encontrado");
            }

            let album = new Album();
            album.name = name;
            album.artist = artist;
            album.qtd_songs = songs.length;
            album.genero = genero;
            album.subgenero = subgenero;
            album.tipo = tipo
            album = await this.albumRepository.save(album);

            for (let i = 0; i < songs.length; i++) {
                let musica = new Song();
                musica.name = songs[i];
                musica.album = album; 
                musica.path = songs_path[i];
                await transactionalEntityManager.save(Song, musica);
            }

            return album
        });

    }

    async updateAlbum(id: number, name: string, genero: string, subgenero: string, songs: string[], songs_path: string[], artist_login: string): Promise<Album> {
        const album = await this.albumRepository.findOne({ 
            where: { albumID: id }, 
            relations: ["songs", "artist"] 
        });
    
        if (!album) {
            throw new Error("Album not found");
        }
    
        if (album.artist.login !== artist_login) {
            throw new Error("You do not have permission to update this album");
        }
    
        if (name !== undefined) album.name = name;
        if (genero !== undefined) album.genero = genero;
        if (subgenero !== undefined) album.subgenero = subgenero;
    
        if (songs !== undefined || songs_path !== undefined) {
            if (songs !== undefined && songs_path !== undefined && songs.length !== songs_path.length) {
                throw new Error("Songs and songs_path arrays must have the same length");
            }
        
            const maxLength = Math.max(songs?.length || 0, songs_path?.length || 0);
        
            for (let i = 0; i < maxLength; i++) {
                if (songs !== undefined && (!songs[i] || songs[i].trim() === "")) {
                    throw new Error(`Song name at index ${i} cannot be empty`);
                }
        
                if (album.songs[i]) {
                    if (songs !== undefined && songs[i] !== undefined) {
                        album.songs[i].name = songs[i];
                    }
                    if (songs_path !== undefined && songs_path[i] !== undefined) {
                        album.songs[i].path = songs_path[i];
                    }
                    await this.songRepository.save(album.songs[i]);
                }
            }
        }
        
    
        return await this.albumRepository.save(album);
    }

    async deleteSongFromAlbum(albumId: number, songId: number, artist_login: string): Promise<Album> {
        const album = await this.albumRepository.findOne({ 
            where: { albumID: albumId }, 
            relations: ["songs", "artist"] 
        });
    
        if (!album) {
            throw new Error("Album not found");
        }
    
        if (album.artist.login !== artist_login) {
            throw new Error("You do not have permission to delete songs from this album");
        }
    
        const songIndex = album.songs.findIndex(song => song.songID === songId);
    
        if (songIndex === -1) {
            throw new Error("Song not found in the album");
        }
    
        const [deletedSong] = album.songs.splice(songIndex, 1);
        await this.songRepository.remove(deletedSong);
        album.qtd_songs = album.songs.length;
        
        return await this.albumRepository.save(album);
    }

    async deleteAlbum(id: number, artist_login: string): Promise<Album> {
        const album = await this.albumRepository.findOne({ 
            where: { albumID: id }, 
            relations: ["artist"] 
        });
    
        if (!album) {
            throw new Error("Album not found");
        }
    
        if (album.artist.login !== artist_login) {
            throw new Error("You do not have permission to delete this album");
        }
    
        await this.albumRepository.delete(album.albumID);
        return album;
    }
    
}

export default AlbumService;
