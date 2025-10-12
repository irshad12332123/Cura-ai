import {  Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LogIn from "./pages/LogIn"
import ProtectedRoute from "./context/ProtectedRoute"
import Register from "./pages/Register"
function App() {
  return (
      <Routes>
        <Route path="/login" element={
          <LogIn />
        }
          />
          <Route path="/register" element={
          <Register />
        }
          />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }/>
      </Routes>
  )
}

export default App
