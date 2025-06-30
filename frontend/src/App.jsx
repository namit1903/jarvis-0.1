import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { UserProvider } from './context/user.context'

const App = () => {
  console.log("i'm in the APP")
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  )
}

export default App