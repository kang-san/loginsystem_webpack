import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../screen/home';

export default function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
