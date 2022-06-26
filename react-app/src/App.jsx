import { Routes, Route, Link } from "react-router-dom";
import './App.css';
import Logo from './logo.svg'
import React from 'react';
import { BrowserRouter } from "react-router-dom";

function Home() {
    return (
        <main>
            <h2>Welcome to React Home Page!</h2>
            <p>You can do this, I believe in you.</p>
        </main>
    );
}

function About() {
    return (
        <main>
            <h2>This is an about page</h2>
        </main>

    );
}

function Other() {
    return (
        <main>
            <h2>This is an other page</h2>
        </main>
    );
}

function App() {
    return (
        <BrowserRouter basename='react'>
            <div className="App">
                <img className='App-logo' src={Logo} alt=""/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="other" element={<Other />} />
                    <Route path="about" element={<About />} />
                </Routes>
                <nav>
                    <Link to="/">Home</Link> |
                    <Link to="/about">About</Link> |
                    <Link to="/other">Other</Link>
                </nav>
            </div>
        </BrowserRouter>
    );
}

export default App;
