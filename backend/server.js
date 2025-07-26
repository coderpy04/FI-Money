const express = require('express');
const cors = require('cors');

const app = express();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const { deleteAll, init } = require('./utils/db_init');

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, " at ", req.url);
    next();
});
app.use(cors({
    origin: 'http://localhost:5173',
}));

app.use('/', authRoutes);
app.use('/products', productRoutes);

app.get('/delete', (req, res) => {
    // init();
    deleteAll();
    res.send("ok");
});
app.get('/init', (req, res) => {
    init();
    res.send("ok");
});

app.listen(8080, () => {
    console.log("App Running at: http://localhost:8080");
});