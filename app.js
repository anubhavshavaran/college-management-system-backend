import express from 'express';
import AppError from "./utils/appError.js";
import errorController from "./utils/ErrorController.js";
import authRouter from "./routes/authRouter.js";
import cors from 'cors';
import vouchersRouter from "./routes/vouchersRouter.js";
import studentsRouter from "./routes/studentsRouter.js";
import dashRouter from "./routes/dashRouter.js";
import paymentRouter from "./routes/paymentRouter.js";
import usersRouter from "./routes/usersRouter.js";
import docsRouter from "./routes/docsRouter.js";
import path from "path";
import feesRouter from "./routes/feesRouter.js";

const app = express();
app.use(cors({
   origin: '*',
   methods: ['GET', 'POST', 'PATCH', 'DELETE'],
   credentials: true
}));

app.use(express.json());

app.use('/docs', express.static(path.join('docs')));

app.use('/api/auth', authRouter);
app.use('/api/vouchers', vouchersRouter);
app.use('/api/students', studentsRouter);
app.use('/api/fees', feesRouter);
app.use('/api/dash', dashRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/users', usersRouter);
app.use('/api/docs', docsRouter);

app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on the server.`, '404'));
});

app.use(errorController);

export default app;