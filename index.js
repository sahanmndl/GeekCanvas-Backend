import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import blogRouter from "./routes/BlogRoutes.js";

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({limit: "30mb", extended: true}))
app.use('/api/blogs', blogRouter)

mongoose
    .connect(
        `mongodb+srv://admin:admin12345@cluster0.lu80feq.mongodb.net/?retryWrites=true&w=majority`,
        {useNewUrlParser: true, useUnifiedTopology: true}
    )
    .then(() => app.listen(process.env.PORT || 8000))
    .then(() =>
        console.log("CONNECTED TO PORT 8000")
    )
    .catch((err) => console.log(err));