import { useState, createContext } from 'react'
import { reverseOrder } from '../utils/index'

export const RestaurantsContext = createContext()

export const RestaurantsContextProvider = (props) => {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState({
    name: '',
    location: '',
    price_range: '',
  })
  const [averageRatings, setAverageRatings] = useState(0)
  const [restraurantsAverageRatings, setRestraurantsAverageRatings] = useState(
    [],
  )
  const [reviews, setReviews] = useState([])

  const addRestaurant = (newRestaurant) => {
    setRestaurants([...restaurants, newRestaurant])
  }

  const addReviews = (newReview) => {
    setReviews([...reviews, ...newReview])
  }

  return (
    <RestaurantsContext.Provider
      value={{
        restaurants,
        setRestaurants,
        addRestaurant,
        selectedRestaurant,
        setSelectedRestaurant,
        averageRatings,
        setAverageRatings,
        restraurantsAverageRatings,
        setRestraurantsAverageRatings,
        reviews,
        setReviews,
        addReviews,
      }}
    >
      {props.children}
    </RestaurantsContext.Provider>
  )
}
