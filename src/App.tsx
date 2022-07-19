import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Create from "./pages/Create";
import Item from "./pages/Item";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Router>
          <Header />
          <Route path="/"  element={<Home/>} />
          <Route path="/create-nft" element={<Create/>} />
          <Route path="/nft/:nftId" element={<Item/>} />
          <Route>404 Not Found!</Route>
      </Router>
    </div>
  );
}

export default App;
