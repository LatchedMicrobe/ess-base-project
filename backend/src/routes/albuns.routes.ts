import { Router } from "express";
import AlbumController from "../controllers/albuns.controller";

const albumRoutes = Router();

const albumController = new AlbumController();


albumRoutes.get("/albums", (req, res) => albumController.getAll(req, res));
albumRoutes.get("/albums/:id", (req, res) => albumController.getById(req, res));
albumRoutes.post("/albums", (req, res) => albumController.createAlbum(req, res));
albumRoutes.delete("/albums/:id", (req, res) => albumController.deleteAlbum(req, res));
albumRoutes.patch("/albums/:id", (req, res) => albumController.updateAlbum(req, res));
albumRoutes.delete("/albums/:albumId/songs/:songId", (req, res) => albumController.deleteSongFromAlbum(req, res));



export default albumRoutes;
