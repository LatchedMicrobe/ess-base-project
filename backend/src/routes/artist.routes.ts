import { Router, Request, Response } from "express";
import artistController from "../controllers/artist.controller"; 

const artistRoutes = Router();
const artistControl = new artistController();

artistRoutes.post("/artists", (req,res) => artistControl.create(req,res));
artistRoutes.get("/artists", (req,res) => artistControl.listAll(req,res));
artistRoutes.get("/artists/:login", (req,res) => artistControl.getByLogin(req,res));
artistRoutes.patch("/artists/:login", (req,res) => artistControl.update(req,res));
//artistRoutes.delete("/artists/:login", (req,res) => artistControl.delete(req,res));

export default artistRoutes;