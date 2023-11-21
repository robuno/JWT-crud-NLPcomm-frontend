import React from "react";
import './Navbar.scss';
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavigationBar() {
    // used for href path
    var userPath = '/users/' + localStorage.getItem("currentUser");

    let navigate = useNavigate();

    const onClickLogout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("refreshKey")
        localStorage.removeItem("userName")
        navigate("/auth");
      }


    return (
        <div>
            <Navbar expand="lg" className="navbar-custom">
                <Container>
                    <Navbar.Brand id="navbar-brand" href="/">Turkish NLP Community</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/toprated">Top Rated Posts</Nav.Link>
                        <Nav.Link href="/hot">Trend</Nav.Link>
                    </Nav>
                    <Nav className="me-auto-endbar">
                        {localStorage.getItem("currentUser") == null 
                        ? 
                        <Nav.Link href="/auth">Login/Register</Nav.Link>
                        :
                        
                        <Nav className="me-auto">
                            <Nav.Link id="nav-link-profile"  href= {userPath}>User Profile</Nav.Link>
                            <Nav.Link id="nav-link-logout" onClick={onClickLogout}>Logout</Nav.Link>
                        </Nav>
                    }
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
        
    )
    
}

export default NavigationBar;