import express from 'express';

import connect from './db/db.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import aiRoutes from './routes/ai.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';



import morgan from 'morgan';
const app=express();
connect();

// app.use(cors());
app.use(cors({ origin: "*", credentials: true, methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization" }));
// app.use(morgan('dev'));
// app.use(morgan('combined', { stream }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));//so data is available in req.body
app.use(cookieParser());


app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use("/ai", aiRoutes)
// Catch-all route to serve index.html for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.get('/',(req,res)=>{
  console.log("we are HOME");
  res.send(" DObara se try kre...");
})

app.get('/',(req,res)=>{
  console.log("we are HOME");
  res.send(" DObara se try kre...");
})

// app.listen(process.env.PORT,()=>{
// console.log("server is running",port);
// })

export default app;
