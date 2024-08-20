const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./squemas/SQmovies')
const cors = require('cors')

const PORT = process.env.PORT ?? 1234

const app = express()

app.disable('x-powered-by')
app.use(express.json())

app.use(cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
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

app.get('/movies', (req, res) => {
    const { genre } = req.query
    if (genre) {
      const filteredMovies = movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
      return res.json(filteredMovies)
    }
    res.json(movies)
  })

app.get("/", (req, res) => {
    res.send("<h1>Cuevana 3<h1>")
})

app.get("/movies/:id", (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
  })

// app.post("/movies", (req, res) => {
//     const newMovie= {
//         id: crypto.randomUUID() ,
//         ...req.body
//     }
//     movies.push(newMovie)

//     res.status(201).json(newMovie)
// })

app.post("/movies", (req, res)=>{
    const result = validateMovie(req.body)

    if (result.error){
        return res.status(400).json({error: result.error.message})
    }
    const NewMovie= {
      id: crypto.randomUUID() ,
      ...result.data   }
    
    movies.push(NewMovie)
    res.status(201).json(NewMovie)
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)
  
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
  
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
  
    if (movieIndex === -1) {
      return res.status(404).json({ message: 'Movie not found' })
    }
  
    const updateMovie = {
      ...movies[movieIndex],
      ...result.data
    }
  
    movies[movieIndex] = updateMovie
  
    return res.json(updateMovie)
  })

  app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
  
    if (movieIndex === -1) {
      return res.status(404).json({ message: 'Movie not found' })
    }
  
    movies.splice(movieIndex, 1)
  
    return res.json({ message: 'Movie deleted' })
  })
  

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
