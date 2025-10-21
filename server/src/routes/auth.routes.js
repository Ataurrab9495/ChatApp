import express from "express";

const app = express.Router();

// public routes
app.post('/register', (req, res) => {});
app.post('/login', (req, res) => {});
app.post('/forgot-password', (req, res) => {});
app.post('/reset-password/:token', (req, res) => {});

//Protected Routes

app.post('/logout', /* protected from middleware */ (req, res) => {});
app.post('/refresh-token', /* protected from middleware */ (req, res) => {});
app.post('/change-password', /* protected from middleware */ (req, res) => {});
app.get('/me', /* protected from middleware */ (req, res) => {});


export default app;