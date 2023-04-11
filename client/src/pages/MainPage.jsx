import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { useState, useMemo } from 'react'
import { useTable } from 'react-table'
import restaurantsApi from '../api/restaurantsApi.js'
import { RestaurantsContext } from '../context/RestaurantsContext'
import { repeatSymbols, reverseOrder } from '../utils/index.js'
import { Link, useNavigate } from 'react-router-dom'
import { RestaurantDetailPage } from './RestaurantDetailPage.jsx'
import { StarRating } from '../components/StarRating.jsx'
import { mergeArrays } from '../utils/index.js'

export const MainPage = (props) => {
  const {
    restaurants,
    setRestaurants,
    addRestaurant,
    restraurantsAverageRatings,
    setRestraurantsAverageRatings,
  } = useContext(RestaurantsContext)

  const navigate = useNavigate()

  useEffect(() => {
    try {
      restaurantsApi.get('/').then((data) => {
        // console.log(data.data.data.restaurant)
        setRestaurants(data.data.data.restaurant)
      })
    } catch (err) {
      console.log(err.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }, [restaurants])

  const merged = mergeArrays(restaurants, restraurantsAverageRatings)
  const reversedData = reverseOrder(merged)

  const data = useMemo(() => reversedData, [reversedData])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Restaurant',
        accessor: 'name',
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: 'Price Range',
        accessor: 'price_range',
      },
      {
        Header: 'Ratings',
        accessor: 'ratings',
      },
    ],
    [],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price_range: '',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await restaurantsApi.post('/', {
        name: formData.name,
        location: formData.location,
        price_range: formData.price_range ? formData.price_range : '1',
      })
      addRestaurant(response.data.data.restaurant)
    } catch (err) {
      console.error(err)
    }

    setFormData({
      name: '',
      location: '',
      price_range: '',
    })
  }

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleDelete = async (event, id) => {
    try {
      event.stopPropagation()
      console.log(id)
      const response = await restaurantsApi.delete(`/${id}`)
      console.log(response);
      setRestaurants(reversedData.filter((restaurant) => restaurant.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Container>
      <div className="title">Restaurant Finder</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="NAME"
          value={formData.name}
          onChange={(event) => handleChange(event)}
        />
        <input
          type="text"
          name="location"
          placeholder="LOCATION"
          value={formData.location}
          onChange={(event) => handleChange(event)}
        />
        <select name="price_range" onChange={(event) => handleChange(event)}>
          <option disabled>Price Range</option>
          <option value="1">$</option>
          <option value="2">$$</option>
          <option value="3">$$$</option>
          <option value="4">$$$$</option>
          <option value="5">$$$$$</option>
        </select>
        <button type="submit"> Add </button>
      </form>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, id) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={id}>
              {headerGroup.headers.map((column, id) => (
                <th {...column.getHeaderProps()} key={id}>
                  {column.render('Header')}
                </th>
              ))}
              <th>Edit</th>
              <th onClick={() => handleDelete(id)}>Delete</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows &&
            rows.map((row, id) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={id}>
                  {row.cells.map((cell, id) => {
                    return cell.render('Cell').props.cell.column.id ===
                      'price_range' ? (
                      <td key={id}>
                        <Link
                          to={`/restaurants/${row.original.id}`}
                          style={{ color: 'white', textDecoration: 'none' }}
                        >
                          {repeatSymbols(
                            cell.render('Cell').props.cell.value,
                            '$',
                          )}
                        </Link>
                      </td>
                    ) : (
                      <td {...cell.getCellProps()} key={id}>
                        <Link
                          to={`/restaurants/${row.original.id}`}
                          style={{ color: 'white', textDecoration: 'none' }}
                        >
                          {cell.render('Cell')}
                          {cell.render('Cell').props.cell.column.id ===
                            'ratings' &&
                          +cell.render('Cell').props.cell.row.original.count >
                            0 ? (
                            <StarRating
                              ratings={
                                cell.render('Cell').props.cell.row.original.avg
                              }
                              averageRatings={
                                cell.render('Cell').props.cell.row.original.avg
                              }
                            />
                          ) : (
                            cell.render('Cell').props.cell.column.id ===
                              'ratings' && '0 Reviews'
                          )}
                          {/* <RestaurantDetailPage originalId={row.original.id} /> */}
                        </Link>
                      </td>
                    )
                  })}

                  <td>
                    <button
                      className="edit"
                      onClick={() =>
                        navigate(`/restaurants/${row.original.id}/update`)
                      }
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete"
                      onClick={(event) => {
                        handleDelete(event, row.original.id)
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #131324;
  justify-content: center;
  align-items: center;
  width: 100vw;
  gap: 1rem;
	margin-top: 2rem; 
  .title {
    color: white;
    font-size: 6rem;
    text-transform: uppercase
		padding: 1rem;
		border-radius: 1rem; 
		margin-bottom: 1rem; 
    text-shadow: 3px 3px 5px #5c6dc4; 
  }
  form {
    display: flex;
    justify-contnent: center;
    align-items: center;
    gap: 1rem;
    transition: 1s ease-in-out;
    input {
      border-radius: 0.5rem;
			padding: 1rem; 
      outline: none;
      height: 95%;
      width: 25rem;
      background-color: #00000076;
      color: white;
      font-size: 1.8rem;
      border: 2px solid #50f5f0;
      &:hover {
        cursor: pointer;
        outline: none;
      }
      &:focus {
        border: 1px solid #e9a10a;
        outline: none;
      }
    }

    select {
      border-radius: 0.5rem;
      padding: 1rem; 
      outline: none;
      height: 95%;
      width: 25rem;
      background-color: #00000076;
      color: white;
      font-size: 1.8rem;
      border: 2px solid #50f5f0;
      color: #69696A; 
      transition: .2s ease-in-out;
      &:hover {
        cursor: pointer;
        outline: none;
        border: 3px solid #0058ce;
      }
    }

    button {
      padding: 2rem 1.5rem;
      display: flex;
      outline: none;
      border: 1px solid #3b00ce;
      border-radius: 10px;
      flex-direction: colomn;
      justify-contnent: center;
      align-items: center;
      margin: auto 0;
      font-weight: bold;
      text-transform: uppercase;
      color: #00ce8c;
      font-size: 1.1rem;
      background-color: #131324;
      transition: 0.5s ease-in-out;
      box-shadow: 3px 8px 30px #0058ce;
      &:hover {
        cursor: pointer;
        border: 1px solid #0058ce;
      }
    }
  }
  table {
    border-spacing: 0;
    border: 1px solid #B59FDF;
		color: white; 
		width: 70%;  
		font-size: 1.5rem; 
		tr { 
      :last-child {
        td {
          border-bottom: 0;
        }
      }
      transition: .8s ease-in-out; 
      &:hover {
        background-color: #646363; 
        cursor: pointer; 
      }
    }
    th,
    td {
      padding: .5rem 1.5rem;
      border-bottom: 1px solid white;
      border-right: 1px solid white;
      button {
        padding: .6rem 1rem; 
        width: 100%; 
        font-size: 1.5rem;
        border-radius: .4rem;
        color: white; 
        text-transform: uppercase; 
      }
      .edit {
        background-color: #e69f37;
        &:hover {
          cursor: pointer;
        }
      }
      .delete {
        background-color: #fa5045;
        &:hover {
          cursor: pointer;
        }
      }
      :last-child {
        border-right: 0;
      }
    }
    th {
      background-color: #6645A5;
      border-bottom: 1px solid white;
      color: white;
      fontweight: bold;
    }
  }

`
