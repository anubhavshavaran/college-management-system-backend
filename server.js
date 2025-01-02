import app from "./app.js";
import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();

const port = process.env.PORT;
const DB = process.env.DATABASE_URL;
const DBNAME = process.env.DATABASE_NAME;

await mongoose.connect(DB, {
    dbName: DBNAME
});

app.listen(port, () => {
    console.log(`Server is running at PORT:${port}`);
});