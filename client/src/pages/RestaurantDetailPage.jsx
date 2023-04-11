import React, { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import restaurantsApi from '../api/restaurantsApi'
import { Reviews } from '../components/Reviews'
import { StarRating } from '../components/StarRating'
import { RestaurantsContext } from '../context/RestaurantsContext'
import { calcStars } from '../utils'

export const RestaurantDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [review, setReview] = useState({
    name: '',
    rating: '',
    review: '',
    restaurant_id: id,
  })

  const [ reviewsCount, setReviewsCount ] = useState(0)

  const {
    restaurants,
    averageRatings,
    setAverageRatings,
    restraurantsAverageRatings,
    setRestraurantsAverageRatings,
    reviews,
    setReviews,
    addReviews,
  } = useContext(RestaurantsContext)

  const { selectedRestaurant, setSelectedRestaurant } = useContext(
    RestaurantsContext,
  )

  useEffect(() => {
    try {
      restaurantsApi
        .get('/reviews/scores')
        .then((response) =>
          setRestraurantsAverageRatings(
            response.data.averageScorePerRestaurant.rows,
          ),
        )
    } catch (err) {
      console.log(err.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    restaurantsApi.get(`/${id}/reviews`).then(res => setReviewsCount(res.data.count))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews])

  useEffect(() => {
    const fetchData = async () => {
      const response = await restaurantsApi.get(`/${id}`)
      const data = response.data.restaurant[0]
      setSelectedRestaurant(data)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const response = await restaurantsApi.get(`/${id}/score`)
      setAverageRatings(response.data.averageScores.avg)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    restaurantsApi
      .get(`/${id}/reviews`)
      .then((response) => setReviews(response.data.data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleForm = async (event) => {
    try {
      event.preventDefault()
      const response = await restaurantsApi.post(`/reviews/${id}`, review)
      addReviews(response.data.rows)
      setReview({
        name: '',
        rating: '',
        review: '',
        restaurant_id: id,
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleChange = (event) => {
    setReview({
      ...review,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <Container>
      <div className="inner-container">
        <div className="title">{selectedRestaurant?.name}</div>
        <div className="average-ratings">
          {calcStars(averageRatings)}
          {restraurantsAverageRatings.map((rating, idx) => {
            return rating.id === id.toString() && +rating.count > 0 ? (
              <span key={idx}>({reviewsCount} reviews) </span>
            ) : (
              rating.id === id.toString() && (
                <span key={idx}>({rating.count} reviews)</span>
              )
            )
          })}
        </div>
        <form onSubmit={handleForm}>
          <span>
            <input
              type="text"
              name="name"
              value={review?.name}
              placeholder="NAME"
              onChange={(event) => handleChange(event)}
            />
            <input
              type="text"
              name="rating"
              value={review?.rating}
              placeholder="RATINGS"
              onChange={(event) => handleChange(event)}
            />
          </span>
          <label htmlFor="">Review</label>
          <textarea
            id=""
            cols="30"
            rows="10"
            value={review?.review}
            name="review"
            onChange={(event) => handleChange(event)}
          ></textarea>
          <button type="submit"> Submit </button>
        </form>
        <div className="review-title">
          Reviews
          <div className="reviews">
            <Reviews />
          </div>
        </div>
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100vw;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  margin-top: 10rem;
	.inner-container {
		background-color: #434343; 
		border-radius: 1rem; 
		padding: 3% 5%; 
  .title {
    color: white;
    font-weight: bold;
    font-size: 5rem;
    letter-spacing: 1px;
		margin: .2rem; 
  }
  .average-ratings {
    display: flex;
    flex-direction: row;
    gap: 2px;
    color: #f9e448;
    justify-content: center; 
    padding: 1rem; 
    span {
      color: white;
      padding: 0 5px;  
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: .3rem;
		span {
			display: flex;
			gap: 5px; 
			justify-content: space-between; 
			input {
				padding: 1rem;
				width: 100%; 
			}
		}
		label {
			color: white;
			margin-top: 10px;
		}
  }
	button {
		margin-top: 10px; 
		padding: .5rem; 
		font-size: 1.5rem; 
		text-transform: uppercase; 
		background-color: #d49b00;
		font-weight: bold; 
		border: none;
		border-radius: 3px; 
		color: white;
	}
  .review-title {
    padding: 1rem 0;
    font-size: 1.2rem; 
    color: white; 
    font-weight: bold;
    .reviews {
      background-color: #6c6b68;
      padding: 1rem 1.5rem; 
      border-radius: 10px; 
    }
  }
`
