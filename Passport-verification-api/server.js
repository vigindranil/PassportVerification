// import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config();
// import loginRoutes from './routes/login.js';
// import authRoutes from './routes/auth.js';
// import userRoutes from './routes/user.js'
// import masterRoutes from './routes/master.js'
// import verifyToken from './middleware/authMiddleware.js';
// import cors from 'cors';
// import morgan from 'morgan';
// import setupSwagger from './utils/swagger.js';
// const app = express();
// const port = 3003;

// app.use(express.json());
// app.use(cors({
//   // origin: '*',
//   origin: 'http://localhost:3000',
//   methods: '*',
//   credentials: true,
// }));
// app.use(morgan('dev'));

// //public Route
// app.use('/api/auth/',  loginRoutes);

// //private Route
// app.use('/api/auth/', verifyToken, authRoutes);
// app.use('/api/user/', verifyToken,userRoutes)
// app.use('/api/master', verifyToken ,masterRoutes)

// // test route
// app.use('/test', (req, res)=>{
//   res.send('api running...');
// })


// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });


//   setupSwagger(app);
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//     console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
//   });   



import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import loginRoutes from './routes/login.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js'
import fileImportRoutes from './routes/fileImport.js'
import verifyToken from './middleware/authMiddleware.js';
import masterRoutes from './routes/master.js'
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import setupSwagger from "./utils/swagger.js";
// import logger from './utils/logger.js';
const app = express();
const port = 3003;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: '*',
  credentials: true,
}));
const storage = multer.memoryStorage();
const upload = multer({ storage });

//public Route
app.use('/api/auth/',  loginRoutes);
app.use('/api/fileImport',verifyToken, upload.single('file'), fileImportRoutes)

//private Route
app.use('/api/auth/', verifyToken, authRoutes);
app.use('/api/user/', verifyToken,userRoutes);
app.use('/api/master', verifyToken ,masterRoutes)

// test route
app.use('/test', (req, res)=>{
  res.send('api running...');
})


setupSwagger(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
});