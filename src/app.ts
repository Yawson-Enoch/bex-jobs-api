import express from 'express';

const app = express();

const port = process.env.PORT || 5000;

app.get('/api/v1/jobs', (req, res) => {
  res.status(200).json({ message: 'You have successfully hit this route' });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
