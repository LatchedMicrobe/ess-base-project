import { Repository } from "typeorm";
import Song from "../entities/songs.entity";
import dbConn from "../database/postgresConnection";
import Album from "../entities/albuns.entity";

class SongService {
    songRepository: Repository<Song>;
    albumRepository: Repository<Album>;

    constructor() {
        this.songRepository = dbConn.getRepository(Song);
        this.albumRepository = dbConn.getRepository(Album);
    }

    async getSongById(id: number): Promise<Song> {
        const song = await this.songRepository.findOne({where:{songID:id}});
        if (!song) {
            throw new Error("Song not found!");
        }
        song.views += 1;
        await this.songRepository.save(song);
        return song;
    }

    async getAllSongs(): Promise<Song[]> {
        return await this.songRepository.find({ relations: ["album"] });
    }

    async deleteSongsByAlbumId(albumId: number, artist_login: string) {
        const album = await this.albumRepository.findOne({ 
            where: { albumID: albumId }, 
            relations: ["artist"] 
        });
    
        if (!album) {
            throw new Error("Album not found");
        }
    
        if (album.artist.login !== artist_login) {
            console.log(album.artist.login)
            throw new Error("You do not have permission to delete songs from this album");
        }
    
        await this.songRepository.delete({ album: { albumID: albumId } }); 
    }

    async updateSong(songId: number, newName: string, newPath: string): Promise<Song> {
        const song = await this.songRepository.findOne({ where: { songID: songId }, relations: ["album"] });

        if (!song) {
            throw new Error("Song not found");
        }

        song.name = newName;
        song.path = newPath;

        await this.songRepository.save(song);

        return song;
    }
}

export default SongService;