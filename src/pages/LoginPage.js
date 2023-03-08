import React, {useContext} from "react";
import AuthContext from "../context/AuthContext";
import Card from 'react-bootstrap/Card';

const LoginPage = () => {
    let {loginUser} = useContext(AuthContext) //import loginUser function from AuthContect using useContext
    return (
        <div className="Login-Page">
            <Card className="Login-Card">
                <form onSubmit={loginUser}>
                    <input className="Login-Box" type="text" name="username" placeholder="Enter username"/>
                    <input className="Login-Box" type="password" name="password" placeholder="Enter password"/>
                    <input className="Login-Button" type="submit"/>
                </form>
            </Card>
        </div>
    )
}


export default LoginPage;