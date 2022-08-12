import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Create from "./pages/Create";
import Item from "./pages/Item";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/"  element={<Home/>} />
          <Route path="/mynft/:address"  element={<Home/>} />
          <Route path="/create-nft" element={<Create/>} />
          <Route path="/nft/:tokenId" element={<Item/>} />
          <Route path="/*">404 Not Found!</Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
