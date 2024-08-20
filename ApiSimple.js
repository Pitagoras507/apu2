const express = require('express')
const ditto = require('./ditto.json')
const path = require('path')

const PORT = process.env.PORT ?? 1234

const app = express()

app.disable('x-powered-by')
app.use(express.json())

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:3000',
      'http://localhost:1234',
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))


app.get("", (req, res) => {
    res.send("<h1>Welcome to paradise<h1> <p>sexo</p>")
})

app.get('/ditto', (req, res) => {
  res.json(ditto)
})

app.post('/', (req, res) => {
  // req.body deberíamos guardar en bbdd
  res.status(201).json(req.body)
})

// la última a la que va a llegar
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})