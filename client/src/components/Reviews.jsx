import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { StarRating } from './StarRating'
import axios from '../api/restaurantsApi'
import { useParams } from 'react-router-dom'
import { RestaurantsContext } from '../context/RestaurantsContext'

export const Reviews = () => {
  const { reviews, setReviews } = useContext(RestaurantsContext)
  const { id } = useParams()

  // const [review, setReview] = useState({
  //   name: '',
  //   review: '',
  //   rating: '',
  //   restaurant_id: '',
  // })

  useEffect(() => {
    axios
      .get(`/${id}/reviews`)
      .then((response) => setReviews(response.data.data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      {reviews?.map(({ name, review, rating }, id) => (
        <div key={id} className="card">
          <div className="first-row">
            <div className="name">{name}</div>
            <div>
              <StarRating ratings={rating} />{' '}
            </div>
          </div>
          <div>{review}</div>
        </div>
      ))}
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 3px;
  .card {
    border-radius: 3px;
    background: #00bb91;
    color: white;
		word-wrap: break-word;
    padding: 1rem;
    width: 100%;
    .name {
      font-size: 1.5rem;
    }
  }
`
