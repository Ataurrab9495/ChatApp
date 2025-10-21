import express from "express";

const app = express.Router();


app.get('/', (req, res) => {
    res.send('Hello world , i am building here the production ready code.')
})

export default app;