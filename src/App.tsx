// import { Routes, Route } from 'react-router-dom'
// import Counter from './Counter'
// import Whether from './Whether'
// import TodoApp  from './TodoApp'
// import Navbar from './components/Navbar'
// import Home from './components/Home'
// import About from './components/About'
// import Contact from './components/Contact'
import './App.css'
import SearchBar from './components/SearchBar'

function App() {
  return (
    <div className='App'>
      < SearchBar />
      {/* <Navbar />
      <div className='content'>
        <Routes>
          <Route path="/" element={<><Home /><Counter /></>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div> */}
    </div>
  )
}

export default App
