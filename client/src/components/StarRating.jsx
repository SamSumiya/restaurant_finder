import React from 'react'
import { BsStarFill, BsStar, BsStarHalf } from 'react-icons/bs'
import styled from 'styled-components'
import { calcStars } from '../utils'

export const StarRating = ({ ratings, averageRatings }) => {

  const stars = calcStars(ratings)

  return (
    <Container>
      <div className="icons">
        {stars.map((star, id) => (
          <div key={id}>{star}</div>
        ))}
				<span> {Math.round(averageRatings * 10) /10 ? (Math.round(averageRatings * 10) /10) : null}   </span>
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  padding: 5px 0px;
  .icons {
    display: flex;
    flex-direction: row;
    gap: 2px;
    color: #f9e448;
  }
`
