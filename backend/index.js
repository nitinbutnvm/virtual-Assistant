import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import corse from "cors";
import userRouter from "./routes/user.routes.js";



const app = express();
app.use(corse({
  origin:"http://localhost:5173",
  credentials:true
}))

const port=process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser() )
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)



app.listen(port, () => {
   connectDb() 
  console.log("server started");
})


// .env
// node_modules/
// *.log
// npm-debug.log*
// yarn-debug.log*
// yarn-error.log*
// dist/
// build/
// .DS_Store
// Thumbs.db