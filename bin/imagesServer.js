const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;
app.use('/images', express.static(path.join(__dirname, '../data/img')));

app.listen(PORT, () => {
  console.log(`Running server on PORT ${PORT}...`);
})