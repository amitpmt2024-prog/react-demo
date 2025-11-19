import { useState } from 'react';

// increment and decrement are the props of the CounterButton component
function CounterButton({increment,decrement}) {
  return (
    <div>
<button onClick={increment}>Increment</button>
<button onClick={decrement}>Decrement</button>
    </div>
  )
}

function Counter() {
  const [count,setCount] = useState(0);
  
function increment() {
  setCount(count+1)
}

function decrement() {
  setCount(count -1)
}

 return <div> <h2>Count: {count}</h2><CounterButton increment={increment} decrement={decrement} /></div>
}

export default Counter;