import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import MovieList from './components/MovieList'
import CreateMovie from './components/CreateMovie'
import EditMovie from './components/EditMovie'

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/create" element={<CreateMovie />} />
        <Route path="/movies/:id/edit" element={<EditMovie />} />
      </Routes>
    </div>
  )
}

export default App
