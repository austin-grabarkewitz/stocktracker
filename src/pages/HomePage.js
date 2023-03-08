import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import StockSearch from '../components/StockSearch';
import 'bootstrap/dist/css/bootstrap.min.css'

//#################//#################//#################//#################//#################

const HomePage = () => {
    
    const [apiKey] = useState("JRQDSUPWFGQOJBJ8")  //Hide this!
    let {authTokens, logoutUser} = useContext(AuthContext)

//#################//#################//#################//#################//#################

    return (
        <div>

            <br/>

            <h1 className='Title-Text'>Search for a Ticker to Follow!</h1>
            <StockSearch api={apiKey}/>

        </div>
    )
}

export default HomePage;