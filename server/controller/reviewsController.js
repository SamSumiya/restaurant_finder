import db from '../db/index.js'

export const getReviews = async (req, res) => {
  try {
    const { id } = req.params
    const reviews = await db.query(
      `select reviews.name, review, rating from reviews join restaurants on reviews.restaurant_id = ${id} and restaurants.id = ${id}`,
    )
    res.status(200).json({
      count: reviews.rows.length,
      data: reviews.rows,
    })
  } catch (error) {
    res.status(500).json({
      messages: error.message,
    })
  }
}

export const averageScores = async (req, res) => {
  try {
    const { id } = req.params
    const scores = await db.query(
      `select avg(rating) from reviews where reviews.restaurant_id = ${id}`,
    )

    res.status(200).json({ averageScores: scores.rows[0] })
  } catch (error) {
    res.status(500).json({
      messages: error.message,
    })
  }
}

export const groupedScores = async (req, res) => {
  try {
    const averageScorePerRestaurant = await db.query(
      `select restaurants.name, restaurants.id, avg(rating), count(reviews.restaurant_id), restaurants.location, restaurants.price_range from reviews right join restaurants on reviews.restaurant_id = restaurants.id group by restaurants.name, restaurants.id, reviews.restaurant_id
			`,
    )
    res.status(200).json({ averageScorePerRestaurant })
  } catch (error) {
    res.status(500).json({
      messages: 'fdas',
    })
  }
}

export const createReview = async (req, res) => {
  try {
    const { name, rating, review, restaurant_id } = req.body

    const response = await db.query(
      `
			insert into reviews (name, rating, review, restaurant_id) values ($1, $2, $3, $4) returning *
		`,
      [name, rating, review, restaurant_id],
    )
		res.status(201).json(response)
  } catch (error) {
    res.status(500).json({
      messages: 'fdas',
    })
  }
}
