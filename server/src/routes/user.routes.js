import express from 'express';

const app = express.Router();

// All Routes requires authentication
// app.use(authenticated);

// user profile routes
app.get('/me', (req, res) => {});
app.put('/me', (req, res) => {});
app.delete('/me', (req, res) => {});

//Search and get users
app.get('/search', (req, res) => {});
app.get('/:id', (req, res) => {});

//contact management
app.get('/contacts/list', (req, res) => {});
app.post('/contacts/:userId', (req, res) => {});
app.delete('/contacts/:userId',(req, res) => {});

// block user
app.post('/block/:userId', (req, res) => {});
app.delete('/block/:userId', (req, res) => {})

// status update
app.patch('/status', (req, res) => {});


export default app;