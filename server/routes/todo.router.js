const express = require('express');
const router = express.Router();

// TODO: Move this setup into a module
// PG SETUP
const pg = require('pg');
const Pool = pg.Pool;
const config = {
  database: 'todolist', // name of database
  host: 'localhost',
  port: 5432,
  max: 10, // max number of concurrent connections
  idleTimeoutMillis: 10000, // attepmt to connect for 10 seconds
};

const pool = new Pool(config);

pool.on('connect', () => {
  console.log('todlist connected!');
});

pool.on('error', (error) => {
  console.log('Error connecting to db', error);
});

router.post('/', function (req, res) {
  const taskToAdd = req.body;
  console.log('in POST route', taskToAdd);
  const query = 'INSERT INTO "ToDoList" ("title", "status") VALUES ($1, $2);';

  pool
    .query(query, [taskToAdd.title, taskToAdd.status])
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log('ERROR in POST', error);
      res.sendStatus(500);
    });
});

router.get('/', function (req, res) {
  console.log('IN GET route');
  const query = 'SELECT * FROM "ToDoList";';
  pool
    .query(query)
    .then((results) => {
      console.log(results);
      res.send(results.rows);
    })
    .catch((error) => {
      console.log('Error making GET', error);
      res.sendStatus(500);
    });
});

router.delete('/:id', (req, res) => {
  const todoId = req.params.id;
  const querryText = 'Delete from "ToDoList" WHERE id=$1 ;';
  const querryArrayData = [todoId];

  pool
    .query(querryText, querryArrayData)
    .then((dbResponse) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

router.put('/status/:id', (req, res) => {
  const newTaskInfo = req.body;
  const querryText = 'UPDATE "ToDoList" SET status=$1 WHERE id=$2';
  const querryArray = [newTaskInfo.status, req.params.id];

  pool
    .query(querryText, querryArray)
    .then((dbResponse) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
