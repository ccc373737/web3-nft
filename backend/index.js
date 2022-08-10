const express = require('express')
const cors = require('cors')
const tokenRoute = require('./routes/tokenRoute');

const port = 3007;
const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/token', tokenRoute);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});