require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes');
const connectdb = require('./utils/db');
const errormiddleware = require('./middlewares/error-middleware');
const cors = require('cors');

const corsOptions = {
    origin: "https://split-wise-ai.vercel.app", 
    methods: "POST,GET,PUT,DELETE,PATCH,HEAD", 
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/routes', routes);
app.use(errormiddleware);

connectdb().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
