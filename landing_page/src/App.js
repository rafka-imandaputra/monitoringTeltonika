//import React from 'react'
import './App.css'
//import { Route, Routes } from "react-router-dom";
import Home from './routes/Home'

export default function App() {
  return (
    <div className="App">
      {/* <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes> */}
        <Home/>
    </div>
  );
}


// const App = () => {
//   return (
//     <>
//     {/* <Navbar/>
//     <Home/> */}
//     {/* <Main/>
//     <Footer/> */}
//     </>
//   )
// }

// export default App