import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext


export const AuthProvider = ({children}) => {

    //for bellow, parse is basically the oppisite of stringify, so it returns the origional token value
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null) //set the Authentication token, accesses authTokens via line 10
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null) //set the user
    let [loading, setLoading] = useState(true)


    const navigate = useNavigate()

    //login function
    let loginUser = async(e) => {
        e.preventDefault()
        // axios.post('http://127.0.0.1:8000/api/token/', {  <- figure out why axios doesnt work
        //     username: 'username',
        //     password: 'password'
        // })
        // .then(function (response) {
        //     console.log(response)
        // })
        // .catch(function (error) {
        //     console.log(error)
        // });
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method:'POST', //POST request because remember, /token doesn't take GET methods
            headers:{
                'Content-Type':'application/json' //let the backend that it is JSON data
            },
            //all the bellow is doing is saying "the username and password (terms defined in LoginPage.js) are equal to the form's respected values"
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        })
        let data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data) //sets authTokens to both tokens
            setUser(jwt_decode(data.access)) // jwt_decode is npm installed and lets you return the values of a token
            localStorage.setItem('authTokens', JSON.stringify(data)) //setItem takes string key/value pair so you must JSON stringify data
            navigate('/')
        } else {
            alert('Something has gone wrong') 
        }
    }


    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/')
    }


    let updateToken = async(e) => 
        {
            const base_url = process.env.REACT_APP_BASE_URL
            console.log("update token")

            let response = await fetch(`http://${base_url}/api/token/refresh/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json' //let the backend that it is JSON data
            },
            //all the bellow is doing is saying "the username and password (terms defined in LoginPage.js) are equal to the form's respected values"
            body:JSON.stringify({'refresh':authTokens?.refresh}) //? makes sure you're not trying to get a refresh token if auth token hasn't been updated
        })
        let data = await response.json()
    
        if (response.status === 200) {
            setAuthTokens(data) //sets authTokens to both tokens
            setUser(jwt_decode(data.access)) // jwt_decode is npm installed and lets you return the values of a token
            localStorage.setItem('authTokens', JSON.stringify(data)) //setItem takes string key/value pair so you must JSON stringify data
        } else {
            logoutUser()
        }

        if(loading) {
            setLoading(false)
        }

    }


    let contextData = {
        user:user,          //variables
        authTokens:authTokens, //variables
        loginUser:loginUser,  //function
        logoutUser:logoutUser //function
    }



    //useEffect for lifecycle methods
    useEffect(()=> {

        if(loading){
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 4

        let interval = setInterval(()=> {
            if (authTokens) {
                updateToken()
            }
        }, fourMinutes)

        return ()=> clearInterval(interval)

    }, [authTokens, loading])


    //return the context data
    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
