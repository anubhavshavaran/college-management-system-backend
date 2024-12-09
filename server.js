import app from "./app.js";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import express from "express";

dotenv.config();

const port = process.env.PORT;
const DB = process.env.DATABASE_URL;
const DBNAME = process.env.DATABASE_NAME;

mongoose.connect(DB, {
    dbName: DBNAME
}).then(() => {
    console.log(`${DBNAME} connected successfully!`);
});

app.listen(port, () => {
    console.log(`Server is running at PORT:${port}`);
});