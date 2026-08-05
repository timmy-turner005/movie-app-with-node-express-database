import express from 'express';

const router = express.Router();

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

router.post('/hello', (req, res) => {
  res.json({ message: 'Hello, World! This is a POST request.' });
});

router.put('/hello', (req, res) => {
  res.json({ message: 'Hello, World! This is a PUT request.' });
});

router.delete('/hello', (req, res) => {
  res.json({ message: 'Hello, World! This is a DELETE request.' });
});

export default router;

