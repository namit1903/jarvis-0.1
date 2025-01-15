import app from "./app";
import "dotenv/config";
import http from "http";
// import { Server } from "socket.io";
import jwt from jsonwebtoken;
import mongoose from "mongoose";


const port=process.env.PORT || 3000;
const server= http.createServer(app);

server.listen(port,()=>{
  console.log("server is running at port ",port);
})