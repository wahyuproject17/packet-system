const express = require('express');
const port = 3000;
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);
app.use('/uploads', express.static('uploads'));



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});