import bodyParser from 'body-parser';
import { config } from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { authMiddleware } from './middleware/authMiddleware';
import tenantRoutes from './routes/tenantRoutes';
import managerRoutes from './routes/managerRoutes';
import propertyRoutes from './routes/propertyRoutes';

// CONFIGURATION
config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// ROUTES
app.get('/', (_, res) => {
  res.send('This is home route');
});

app.use('/properties', propertyRoutes);
app.use('/tenants', authMiddleware(['tenant']), tenantRoutes);
app.use('/managers', authMiddleware(['manager']), managerRoutes);

// SERVER
const port = process.env.PORT ?? 3002;
app.listen(port, () => {
  console.log(`Server is running on port - ${port}`);
});
