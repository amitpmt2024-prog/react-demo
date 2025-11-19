import Counter from './Counter'
import Whether from './Whether'
import TodoApp  from './TodoApp'
import Navbar from './components/Navbar'
// import Home from './components/Home'
import './App.css'

function App() {
  console.log('1111111');
  return (
  <div className='App'>
 
<Navbar />
<div className='content'>
  {/* <Home /> */}
   <Counter />
  <TodoApp />
  <Whether />
  </div>
  </div>
  
  )
}

export default App
