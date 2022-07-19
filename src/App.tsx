import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Create from "./pages/Create";
import Item from "./pages/Item";
import Header from "./components/Header";
import CssBaseline from "@mui/material/CssBaseline";


const Header11 = () => {
  return ( 
    
  <React.Fragment>
      <CssBaseline />
      <div>hererdddddd</div>
      <div>sdad</div>
      </React.Fragment>)
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header11 />
        <Routes>
          <Route path="/"  element={<Home/>} />
          <Route path="/create-nft" element={<Create/>} />
          <Route path="/nft/:nftId" element={<Item/>} />
          <Route path="/*">404 Not Found!</Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
