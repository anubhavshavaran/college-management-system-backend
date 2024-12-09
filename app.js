import express from 'express';
import AppError from "./utils/appError.js";
import errorController from "./utils/ErrorController.js";

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Node App'
    });
});

app.use(errorController);

app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on the server.`, '404'));
});

export default app;