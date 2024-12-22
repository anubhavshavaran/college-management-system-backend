import express from 'express';
import AppError from "./utils/appError.js";
import errorController from "./utils/ErrorController.js";
import authRouter from "./routes/authRouter.js";
import cors from 'cors';
import vouchersRouter from "./routes/vouchersRouter.js";
import studentsRouter from "./routes/studentsRouter.js";
import dashRouter from "./routes/dashRouter.js";
import feeRouter from "./routes/feeRouter.js";
import paymentRouter from "./routes/paymentRouter.js";
import usersRouter from "./routes/usersRouter.js";

const app = express();
app.use(cors({
   origin: '*',
   methods: ['GET', 'POST', 'PATCH', 'DELETE'],
   credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/vouchers', vouchersRouter);
app.use('/api/students', studentsRouter);
app.use('/api/dash', dashRouter);
app.use('/api/fees', feeRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/users', usersRouter);

app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on the server.`, '404'));
});

app.use(errorController);

export default app;