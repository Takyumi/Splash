import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/writeFile', (req, res) => {
  const data = req.body;
  if (!data) {
    console.error('No data received');
    res.status(400).send('Bad request: No data received');
    return;
  }
  fs.appendFile('db.txt', JSON.stringify(data) + '\n', (err) => {
    if (err) {
      console.error('Error appending to file:', err);
      res.status(500).send('Error appending to file');
      return;
    }
    console.log('Data has been written to db.txt');
    res.status(200).send('Data saved successfully');
  });
});

app.get('/readFile', (_req, res) => {
  fs.readFile('db.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Error reading file');
      return;
    }
    res.status(200).send(data);
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
