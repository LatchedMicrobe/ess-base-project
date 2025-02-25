import dbConn  from "../database/postgresConnection";
import { Repository } from "typeorm";
import Artist from "../entities/artist.entity";

class ArtistRepository {
    private repo: Repository<Artist>;

    constructor() {
        this.repo = dbConn.getRepository(Artist);
    }

    async createArtist(artistData: Partial<Artist>): Promise<Artist> {
        const artist = this.repo.create(artistData);
        return this.repo.save(artist);
    }

    async getAllArtists(): Promise<Artist[]> {
        return this.repo.find();
    }

    async getArtistByLogin(login: string): Promise<Artist | null> {
        return await this.repo.findOne({where: {login}});
    }

    async updateArtist(login: string, data: Partial<Artist>) : Promise<Artist | null> {
        const artist = await this.repo.findOne({where: {login}});

        if (!artist) {
            return null;
        }

        Object.assign(artist, data); // Atualiza os campos fornecidos
        return await this.repo.save(artist);
    }

    async deleteArtist(login: string) : Promise<boolean>{
        const result = await this.repo.delete({login});
        return result.affected != 0;
    }
}

export default ArtistRepository;
