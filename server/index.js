import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import restaurantsRoute from './routes/restaurantsRoute.js'
import reviewsRoute from './routes/reviewsRoute.js'
import bodyParser from 'body-parser'
import morgan from 'morgan'

// Configuration
dotenv.config()
const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())


// Routes
app.use('/api/v1/', restaurantsRoute)
app.use('/api/v1/', reviewsRoute)


// PORT 
const PORT = process.env.PORT || process.env.ANOTHER_PORT

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`)
})
