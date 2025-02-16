import { Router } from "express";
import SearchController from "../controllers/search.controller";

const searchRoutes = Router()
const searchController = new SearchController()

searchRoutes.get("/search/:ds",(req,res) => searchController.searchAll(req,res))

export default searchRoutes