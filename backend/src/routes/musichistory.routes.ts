import {Router} from 'express';
import MusicHistoryController from '../controllers/musichistory.controllers';

const musicRoutes = Router();
const musicController = new MusicHistoryController();

musicRoutes.get('/musichistory',(req, res) => musicController.getAllHistory(req,res));
musicRoutes.get('/musichistory/:id',(req, res) => musicController.getHistoryByUserId(req, res));
musicRoutes.get('/top10/:userId', (req,res) => musicController.showTop10(req,res));
musicRoutes.post('/musichistory',(req, res) => musicController.insertIntoMusicHistory(req,res));
musicRoutes.delete('/musichistory/:id', (req,res) => musicController.deleteMusicHistoryByUserId(req, res))

export default musicRoutes;