require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const connectdb = require('./utils/db');
const errormiddleware = require('./middlewares/error-middleware');

const app = express();
const port = 3000;

const corsOptions = {
  origin: ["https://split-wise-ai.vercel.app"],
  methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "HEAD"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
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
