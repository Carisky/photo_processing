const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '10mb' })); // Increase the limit for large images

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/api/tags', async (req, res) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  try {
    const response = await axios.post(
      'https://api.ximilar.com/photo/tags/v2/tags',
      {
        relevance: 0.3,
        records: [
          {
            _base64: imageBase64
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${process.env.XIMILAR_API_TOKEN}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get tags from Ximilar API' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
