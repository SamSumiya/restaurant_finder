import db from '../db/index.js'

export const getRestaurants = async (req, res) => {
  try {
    const data = await db.query('select * from restaurants')

    res.status(200).json({
      status: 'Ok',
      results: data.rows.length,
      data: {
        restaurant: data.rows,
      },
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}

export const getRestaurant = async (req, res) => {
  try {
    const { id } = req.params
    const data = await db.query('Select * from restaurants where id = $1', [id])
    res.status(200).json({
      status: 'Ok',
      restaurant: data.rows,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}

export const createRestaurent = async (req, res) => {
  try {
    const { name, location, price_range } = req.body
    const data = await db.query(
      'insert into restaurants (name, location, price_range) values ($1, $2, $3) returning *',
      [name, location, price_range],
    )

    res.status(201).json({
      status: 'ok',
      data: {
        restaurant: data.rows[0],
      },
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}

export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params
    const { name, location, price_range } = req.body

    const data = await db.query(
      'update restaurants set name = $1, location = $2, price_range = $3 where id = $4 returning *',
      [name, location, price_range, id],
    )

    res.status(200).json({
      status: 'Ok',
      data: {
        restaurant: data.rows[0],
      },
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}

export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params
    await db.query('delete from reviews where reviews.restaurant_id = $1', [id])
    await db.query('delete from restaurants where restaurants.id = $1', [id])

    res.status(204).json({
      status: 'Success',
      id,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}
