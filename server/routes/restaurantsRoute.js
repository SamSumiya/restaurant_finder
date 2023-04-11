import express from 'express'
import { getRestaurants, getRestaurant, createRestaurent, updateRestaurant, deleteRestaurant } from '../controller/restaurantsController.js'

const route = express.Router()

route.get('/restaurants', getRestaurants)
route.get('/restaurants/:id', getRestaurant)
route.post('/restaurants', createRestaurent)
route.put('/restaurants/:id', updateRestaurant)
route.delete('/restaurants/:id', deleteRestaurant)

export default route