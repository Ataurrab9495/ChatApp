import express from 'express';

const app = express.Router();

// app.use(authentication);

// get message for a conversation
app.get('/:converationId', (req, res) => {});

app.post('/', (req, res) => {});

app.put('/:id', (req, res) => {});

app.delete('/:id', (req, res) => {});

app.post('/:conversationId/read', (req, res) => {});

app.post('/:id/react' , (req, res) =>{});

app.post('/:id/forward', (req, res) => {});


app.get('/:conversationId/search', (req, res) => {});


export default app;