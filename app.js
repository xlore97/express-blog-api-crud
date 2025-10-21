const express = require('express');
const app = express();
const port = 3000;

const postsRouter = require('./routers/route');
const error404 = require("./middleware/error404");
const error500 = require("./middleware/error500");


app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    console.log('Hai richiesto index');
    res.send('<h1>Home blog</h1>');
});

app.use('/posts', postsRouter);

app.use(error404);

app.use(error500);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});