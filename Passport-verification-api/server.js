import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import loginRoutes from './routes/login.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js'

import updateRoutes from './routes/user.js'
import districNodal from './routes/user.js'
import verifyToken from './middleware/authMiddleware.js';
import masterRoutes from './routes/master.js'
import cors from 'cors';
import morgan from 'morgan';
import setupSwagger from "./utils/swagger.js";
// import logger from './utils/logger.js';
const app = express();
const port = 3003;

app.use(express.json());
app.use(cors({
  // origin: '*',
  origin: 'http://localhost:3000',
  methods: '*',
  credentials: true,
}));
// app.use(morgan('dev'));
// app.use(morgan('combined', {
//   stream: {
//     write: (message) => logger.info(message.trim()) // Write log messages using winston
//   }
// }));


//public Route
app.use('/api/auth/',  loginRoutes);

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