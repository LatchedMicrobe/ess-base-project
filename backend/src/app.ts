import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import logger from './logger';
import setupRoutes from './routes/index';
import { HttpError } from './utils/errors/http.error';
import { FailureResult } from './utils/result';
import Database from './database';
import dbConn from './database/postgresConnection';
import playlistRoutes from './routes/playlist.routes';
import userRoutes from './routes/user.routes';
import artistRoutes from './routes/artist.routes';
import albumRoutes from './routes/albuns.routes'
import songRoutes from './routes/songs.routes';
import musicHistoryRoutes from './routes/musichistory.routes';
import searchRoutes from './routes/search.routes';


const app: express.Express = express();
app.use(express.json());

app.use(
  cors({
    origin: '*',
  })
);


dbConn.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })


app.use(playlistRoutes)
app.use(userRoutes)
app.use(musicHistoryRoutes);
app.use(artistRoutes)
app.use(albumRoutes)
app.use(songRoutes)
app.use(searchRoutes)

app.use(
  (
    error: HttpError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (error.status >= 500) {
      logger.error(error.toString());
    }

    new FailureResult({
      msg: error.msg ?? error.message,
      msgCode: error.msgCode,
      code: error.status,
    }).handle(res);
  }
);

// e.g. Seed database with initial data;
Database.seed();

export default app;
