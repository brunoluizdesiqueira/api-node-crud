const express = require('express');
const server = express();
server.use(express.json());

const users = ['Bruno', 'Amanda', 'Danilo']

server.use((req, rep, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({error: 'User name is required'});
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const { index } = req.params;
  const user = users[index];
  if (!user) {
    return res.status(400).json({error: 'User does not exists'});
  }
  req.user = user;
  return next();
}

server.get('/users', (req, res) => {
  return res.json(users);
})

server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json({message: `Buscando o usário: ${req.user}`});
})

server.post('/users', checkUserExists, (req, res) =>{
  const { name } = req.body;
  const leng = users.push(name);
  return res.json(users[leng -1])
})

server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) =>{
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json(users[index])
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.send();
})

server.listen(3000);

