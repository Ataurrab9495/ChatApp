import express from 'express';

const app = express.Router();

// app.use(authentication);

// converation CRUD
app.get('/', (req, res) => {});
app.get('/:id', (req, res) => {});
app.post('/', (req, res) => {});
app.put('/:id', (req, res) => {});
app.delete('/:id', (req, res) => {});


// conversation actions
app.post('/:id/archive', (req, res) => {});
app.post('/:id/unarchive', (req, res) => {});


export default app;