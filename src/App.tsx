import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import MovieList from './components/MovieList'
import CreateMovie from './components/CreateMovie'

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/create" element={<CreateMovie />} />
      </Routes>
    </div>
  )
}

export default App
