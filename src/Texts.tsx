// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

type Props = {
  name: string;
};

function Greetings(props: Props) {
  console.log(props);
  return <div>{props.name}</div>

}

export default Greetings
