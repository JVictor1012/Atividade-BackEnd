const express = require('express')
const app = express()
const mssql = require('mssql/msnodesqlv8')
const jwt = require('jsonwebtoken')
const { NText } = require('mssql/msnodesqlv8')
const CHAVE = 'joao'
const cors = require('cors')

app.use(express.json())
//app.use(cors)

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

const conn = new mssql.ConnectionPool({
  driver: 'msnodesqlv8',
  server: 'DESKTOP-VICTOR',
  database: 'WebBackEnd',
  user: 'sql',
  password: '1234'
})


app.post('/login', (req, res) => {
  console.log("executando login")
  console.log(req.body)
  if (req.body.user === 'joao' && req.body.password === '123') {
    const token = jwt.sign({userId: 1}, CHAVE, {expiresIn: 300});
    return res.json({ auth: true, token });
  }
  res.status(401).end();
})

function verifyJWT(req, res, next){
  const token = req.headers['x-access-token'];
  jwt.verify(token, CHAVE, (err, decoded) => {
  if(err) return res.status(401).end();

  req.userId = decoded.userID;
  next();
  })
}

app.get('/cliente', verifyJWT, function (req, res) {
  conn.connect().then((pool) => {
    const queryStr = 'SELECT * FROM Clientes'
    pool.query(queryStr).then((rows) => {
      res.send(rows.recordset)
    })
  })
})

app.get('/cliente/:id', function (req, res) {
  const id = req.params.id
  conn.connect().then((pool) => {
    const queryStr = `SELECT * FROM Clientes WHERE Codigo = ${id}`
    pool.query(queryStr).then((rows) => {
      if (rows.recordset.length > 0) {
        res.send(rows.recordset[0])
      } else {
        res.status(404).send('Registro não encontrado')
      }
    })
  })
})

app.delete('/cliente/:id', function (req, res) {
  const id = req.params.id
  conn.connect().then((pool) => {
    const queryStr = `DELETE FROM Clientes WHERE Codigo = ${id}`
    pool.query(queryStr).then((rows) => {
        res.status(204).send()
    })
  })
})

app.post('/cliente', function (req, res) {
  conn.connect().then((pool) => {
    const codigo = req.body.Codigo
    const nome = req.body.Nome
    const email = req.body.Email
    const queryStr = `INSERT INTO Clientes (Codigo, Nome, Email)
      VALUES (${codigo}, '${nome}', '${email}')`
    pool.query(queryStr).then((rows) => {
      res.status(201).send()
    })
  })
})

app.put('/cliente/:id', function (req, res) {
  conn.connect().then((pool) => {
    const codigo = req.params.id
    const nome = req.body.Nome
    const email = req.body.Email
    const queryStr = `UPDATE Clientes SET
      Nome = '${nome}',
      Email = '${email}'
    WHERE Codigo = ${codigo}`
    pool.query(queryStr).then((rows) => {
      res.status(200).send()
    })
  })
})

app.listen(3000, () => {
  console.log(`Servidor iniciado na porta 3000`)
})
