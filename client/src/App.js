import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { RestaurantDetailPage } from './pages/RestaurantDetailPage'
import { UpdateRestaurantPage } from './pages/UpdateRestaurantPage'
import { RestaurantsContextProvider } from './context/RestaurantsContext'
import { PageNotFound } from './pages/PageNotFound.jsx'

function App() {
  return (
    <RestaurantsContextProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<MainPage />} />
          <Route
            exact
            path="/restaurants/:id/update"
            element={<UpdateRestaurantPage />}
          />
          <Route
            path="/restaurants/:id"
            element={<RestaurantDetailPage />}
          />
          <Route
            path="*"
            element={<PageNotFound />}
          />
        </Routes>
      </BrowserRouter>
    </RestaurantsContextProvider>
  )
}

export default App
