import { BsStarFill, BsStar, BsStarHalf } from 'react-icons/bs'

export const repeatSymbols = (number, symbol) => {
  let i = 0
  let op = ''
  while (i < number) {
    op += symbol
    i += 1
  }
  return op
}

export const reverseOrder = (restaurants) => {
  const reversedRestraurants = restaurants.sort((a, b) => b.id - a.id)
  return reversedRestraurants
}

export const calcStars = (ratings) => {
  const stars = []

  for (let i = 1; i < 6; i++) {
    if (i <= ratings) {
      stars.push(<BsStarFill />)
    } else if (i === Math.round(ratings) && !Number.isInteger(ratings)) {
      stars.push(<BsStarHalf />)
    } else {
      stars.push(<BsStar />)
    }
  }
  return stars
}


export const mergeArrays = (arr1, arr2) => {
  const op = [] 

  for (let res1 of arr1) {
    for (let res2 of arr2 ) {
      if (res1.id === res2.id) {
        op.push({...res1, ...res2})
      }
    }
  }
  return op
}