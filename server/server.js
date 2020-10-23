const express = require('express');
const app = express();
const PORT = process.env.PORT || 5002;
const bodyParser = require('body-parser');
const todoRouter = require('./routes/todo.router.js');

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/todolist', todoRouter);

app.use(express.static('server/public'));

app.listen(PORT, () => {
  console.log('Server running on PORT', PORT);
});
