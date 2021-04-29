const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv').config();

// register app using express
const app = express();

// connect database (MongoDB)
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB CONNECTED SUCCESSFULLY'))
  .catch((err) => console.log('DB CONNECTION ERROR ->', err));

// middlewares
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: false }));
// To display requests in console
app.use(morgan('dev'));

// routes path
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/admin');
const categoryRoutes = require('./routes/category');
const subParentRoutes = require('./routes/subParent');
const subRoutes = require('./routes/sub');
const productRoutes = require('./routes/product');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/user');
const cloudinaryRoutes = require('./routes/cloudinary');

// register routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api', subParentRoutes);
app.use('/api', subRoutes);
app.use('/api', productRoutes);
app.use('/api', paymentRoutes);
app.use('/api', cloudinaryRoutes);

// SERVER PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>
  console.log(`ProSport server is running on ${PORT} port...`)
);
