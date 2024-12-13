import express from 'express';
import AppError from "./utils/appError.js";
import errorController from "./utils/ErrorController.js";
import authRouter from "./routes/authRouter.js";
import cors from 'cors';
import vouchersRouter from "./routes/vouchersRouter.js";

const app = express();
app.use(cors({
   origin: '*',
   methods: ['GET', 'POST'],
   credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/vouchers', vouchersRouter);

app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on the server.`, '404'));
});

app.use(errorController);

export default app;