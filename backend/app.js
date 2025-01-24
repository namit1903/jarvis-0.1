import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import aiRoutes from './routes/ai.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app=express();
connect();
// Custom logger stream object
const stream = {
  write: (message) => {
    console.log(`Morgan log: ${message.trim()}`); // Trim removes extra newlines
  },
};
// app.use(cors());
app.use(cors({ origin: "https://jarvis-0-1-3ewj.vercel.app", credentials: true }));
app.use(morgan('dev'));
// app.use(morgan('combined', { stream }));
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

// app.listen(process.env.PORT,()=>{
// console.log("server is running",port);
// })

export default app;