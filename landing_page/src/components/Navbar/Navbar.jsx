import React, { Component, useState } from 'react'
import './navbar.css'
import { MenuItems } from './MenuItems';
import { FaTruck } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { IoReorderThreeOutline } from "react-icons/io5";

class Navbar extends Component{
    state = { clicked: false };
    handleClick = () =>{
        this.setState({ clicked: !this.state.clicked})
    }

    render(){
        return(
            <nav className="NavbarItems">
                <h1 className="navbar-logo">
                    <FaTruck />
                    LOGO.
                </h1>

                <div className="menu-icons" onClick={this.handleClick}>
                    {this.state.clicked ? <IoIosCloseCircle className="" /> : <IoReorderThreeOutline className="" />}
                </div>

                <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
                    {MenuItems.map((item, index) =>{
                        return(
                            <li key={index}>
                                <a className={item.cName} href="/" >{item.title}</a>
                            </li>
                        )
                    })}
                   
                     {/* <button>Login</button> */}
                     <a href="http://localhost:3000/session/signin">
                        <button>Login</button>
                    </a>
                </ul>
            </nav>
        );
    }
}

export default Navbar
