import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css'



const Header = () => {
    let {user, logoutUser} = useContext(AuthContext) // <- grabs the name component from AuthContext


    return (
        <div>

        <Navbar className="Nav" variant="dark">
            <Container>
                <Navbar.Brand>Tickr</Navbar.Brand>
                {user && <Navbar.Text className="NavBar-Text">Signed in as: {user.username}</Navbar.Text>}
                {user ? ( <Navbar.Text className="NavBar-Text" onClick={logoutUser}>Logout</Navbar.Text> ) : (<Link to='/login'>Login</Link>)}
            </Container>
            </Navbar>
            
        </div>
    )
}


export default Header