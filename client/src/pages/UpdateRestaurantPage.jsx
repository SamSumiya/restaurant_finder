import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import restaurantsApi from '../api/restaurantsApi'
import styled from 'styled-components'
import { RestaurantsContext } from '../context/RestaurantsContext'

export const UpdateRestaurantPage = () => {
  const [updateData, setUpdateData] = useState({
    name: '',
    location: '',
    price_range: '',
  })
  const { addRestaurant } = useContext(RestaurantsContext)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    restaurantsApi.get(`/${id}`).then((data) => {
      if (data.data.restaurant.length === 0) {
        navigate('/')
      } else {
        setUpdateData(data.data.restaurant[0])
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdate = async (event) => {
    event.stopPropagation()
    try {
      const updatedData = await restaurantsApi.put(`/${id}`, updateData)
      const updatedRestaurant = updatedData.data.data.restaurant
      addRestaurant(updatedRestaurant)
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleUpdate(event)
  }

  const handleChange = (event) => {
    setUpdateData({
      ...updateData,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div>
      <button
        style={{
          padding: '1rem',
          margin: '.3rem',
          fontWeight: 'bold',
          borderRadius: '10px',
          border: 'none',
          textTransform: 'uppercase',
          backgroundColor: '#ffcab7',
          color: '#fc6b31',
        }}
        onClick={() => navigate('/')}
      >
        Return
      </button>
      <Container>
        <div className="inner-container">
          <div className="title"> Update Restaurant </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={updateData?.name}
              placeholder="NAME"
              onChange={(event) => handleChange(event)}
            />
            <input
              type="text"
              name="location"
              value={updateData?.location}
              placeholder="LOCATION"
              onChange={(event) => handleChange(event)}
            />
            <input
              type="text"
              name="price_range"
              value={updateData?.price_range}
              placeholder="PRICE RANGE"
              onChange={(event) => handleChange(event)}
            />
            <button type="submit"> Update </button>
          </form>
        </div>
      </Container>
    </div>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 85vh;
  weight: 100vw;
  justify-content: center;
  align-items: center;
	.inner-container {
		background-color: #5d35c7; 
		border-radius: 1rem; 
		padding: 2rem; 
  .title {
    color: white;
    font-size: 5rem;
    text-transform: uppercase;
    letter-spacing: 3px;
		margin-bottom: 2rem; 
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    input {
      border-radius: 0.5rem;
      padding: 1.5rem;
			border: 1px solid #fcd031; 
			font-size: 2rem;
			&:focus {
				background-color: #f5e5f8; 
				outline: none; 
				border: 2px solid #fcd031; 
			}
    }
  }
  button {
    border-radius: 0.5rem;
    padding: 1rem;
		color: white; 
		font-weight: bold; 
		letter-spacing: 2px; 
    text-transform: uppercase;
    font-size: 1.5rem;
		transition: .5s ease-in-out; 
		background-color: #c3c6fd; 
		&:hover {
			border 1px solid white; 
			background-color: #97a1fd; 
		}
  }
} 
`
