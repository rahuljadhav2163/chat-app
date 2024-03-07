import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './views/Home/Home'
import Login from './views/Login/Login'
import Signup from './views/Signup/Signup'
function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Signup/>
    },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
