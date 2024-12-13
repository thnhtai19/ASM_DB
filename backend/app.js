const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, 
}));

app.use(cookieParser()); 
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use('/order', orderRoutes);
app.use('/product', productRoutes);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); 

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Ứng dụng đang chạy tại http://localhost:${PORT}`);
});
