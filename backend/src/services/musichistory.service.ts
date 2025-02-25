import {DataSource, Repository} from "typeorm";
import MusicHistory from '../entities/musichistory.entity'
import User from '../entities/user.entity'
import dbConn from "../database/postgresConnection";
import Song from "../entities/songs.entity";

interface TopMusicAndArtists {
    posicao: number;
    nome: string;
    artist_login: string | null;
}



class MusicHistoryService {
    userRepository: Repository<User>;
    musicHistoryRepository: Repository<MusicHistory>;
    songRepository: Repository<Song>

    constructor() {
        this.userRepository = dbConn.getRepository(User);
        this.musicHistoryRepository = dbConn.getRepository(MusicHistory);
        this.songRepository = dbConn.getRepository(Song);
    }

    async getMusicHistory(): Promise<MusicHistory[]> { //retorna todos a tabela de historico de musicas(todos os usuários)
        return  this.musicHistoryRepository.find({
            relations: {
                usuario: true,
                song: true
            },
            order: {
                musicHistoryId: "DESC"
            }

        });
    }

    async getMusicHistoryByUserId(id: string): Promise<MusicHistory[]> {
        return this.musicHistoryRepository.find({
            relations: {
                usuario: true,
                song: true
            },
            where: {
                usuario: {
                    login: id
                }
            },
            order: {
                musicHistoryId: "DESC"
            }
        });
    }

    async getMusicHistoryByMusicId(id: number): Promise<Song[]> {
        return this.songRepository.find({
            relations: {
                musicHistory: true
            },
            where: {
                musicHistory: {
                    musicHistoryId: id
                }
            }

        })
    }

    async insertIntoMusicHistory (musicId: number, userId: string): Promise<MusicHistory | null> {
        let song = await this.songRepository.findOne({where: {
            songID: musicId
        }})
        let user = await this.userRepository.findOne({where:
            {login: userId}
        })

        console.log("Musica encontrada:", song);
        console.log("Usuario Encontrado:", user);

        if(user && song) {
            let data = new MusicHistory();
            data.song = song;
            data.usuario = user;
            return await this.musicHistoryRepository.save(data);
        }
        
        return null

        
    }

    async deleteMusicHistoryByUserId(id: string): Promise<boolean> {
        let user = await this.userRepository.findOne({where:
            {login: id}
        })

        if(user) {
            await this.musicHistoryRepository.delete({
                usuario: {
                    login: id
                }
            });
            return true
        }

        return false;
    }

    async topMusicAndArtists(userID: string): Promise<TopMusicAndArtists[]> {
        
        const topMusicasQuery = this.musicHistoryRepository
        .createQueryBuilder("h")
        .select([
            "h.musicId AS musicId",
            "s.name AS nome",
            "COUNT(*) AS total_vezes",
            "ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS posicao"
        ])
        .innerJoin("song", "s", "h.musicId = s.songID")
        .where("h.userId = :userID", { userID })
        .groupBy("h.musicId, s.name");

        const topMusicas = await topMusicasQuery.getRawMany()
        console.log("top musicas: ", topMusicas)
    
    // Subquery para Top Artistas (contando músicas associadas)
    const topArtistasQuery = this.musicHistoryRepository
        .createQueryBuilder("h1")
        .select([
            "ar.login AS artist_login",
            "COUNT(*) AS artista_vezes",
            "ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS posicao"
        ])
        .innerJoin("song", "m1", "h1.musicId = m1.songID")
        .innerJoin("album", "a", "m1.albumId = a.albumID")
        .innerJoin("artist", "ar", "a.artistLogin = ar.login")
        .where("h1.userId = :userID", {userID})
        .groupBy("ar.login");
        
        const topArtistas = await topArtistasQuery.getRawMany();
        console.log("Top Artistas: ", topArtistas)
    
    // Consulta final combinando os rankings
    const result: TopMusicAndArtists[] = topMusicas.map(musica => {
        // Encontre o artista correspondente com base na posição
        const artista = topArtistas.find(a => a.posicao === musica.posicao);
        return {
            posicao: musica.posicao,
            nome: musica.nome,
            artist_login: artista ? artista.artist_login : null
        };
    });


        console.log("Top results:",result);
        return result
    }

  
    
    
}

export default MusicHistoryService;
