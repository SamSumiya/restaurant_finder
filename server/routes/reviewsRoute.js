import express from "express";
import { getReviews, averageScores, groupedScores, createReview } from "../controller/reviewsController.js";

const routes = express.Router()

routes.get('/restaurants/reviews/scores', groupedScores)
routes.post('/restaurants/reviews/:id', createReview) 
routes.get('/restaurants/:id/reviews', getReviews) 
routes.get('/restaurants/:id/score', averageScores)


export default routes;
