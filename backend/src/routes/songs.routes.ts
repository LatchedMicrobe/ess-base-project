import { Router } from "express";
import SongController from "../controllers/songs.controller";

const songRoutes = Router();

const songController = new SongController();

songRoutes.get("/songs", (req, res) => songController.getAll(req, res));
songRoutes.get("/songs/:id", (req, res) => songController.getSongById(req, res));

export default songRoutes;
