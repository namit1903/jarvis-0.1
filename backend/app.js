import { config } from "dotenv";
// import dotenv from 'dotenv'

import express from "express";

config();

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use("/ai", aiRoutes)

app.get('/',(req,res)=>{
  console.log("we are HOME");
  res.send(" DObara se try kre...");
})
const port=process.env.PORT;
// app.listen(process.env.PORT,()=>{
// console.log("server is running",port);
// })

export default app;