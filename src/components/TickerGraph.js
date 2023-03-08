
import AuthContext from "../context/AuthContext";
import Plot from 'react-plotly.js';
import { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
// import axios from 'axios';

const TickerGraph = (props) => {

    const [apiKey] = useState("JRQDSUPWFGQOJBJ8")  //Hide this!
    const [xVal, setXVal] = useState([]);
    const [yVal, setYVal] = useState([]);
    let {user, authTokens, logoutUser} = useContext(AuthContext)
    

    //#################//#################//#################//#################//#################
    

    useEffect(() => {
        fetchStock()
    }, [props.tickID])

    //#################//#################//#################//#################//#################


    const fetchStock = () => {
        
        let xList = []
        let yList = []

        fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${props.symbol}&apikey=${apiKey}`)
            .then(
                function(response) {
                    return response.json();
                }
            )
            .then(
                function(data) {

                    for (var key in data['Monthly Adjusted Time Series']) {
                        xList.push(key)
                        yList.push(data['Monthly Adjusted Time Series'][key]["5. adjusted close"])
                    }

                    setXVal(xList)
                    setYVal(yList)
                }
                
            )
      }

    //#################//#################//#################//#################//#################
      

    return (
        <div>
            <Plot
                data={[
                    {
                        x: xVal,
                        y: yVal,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: '#014d4e'},
                    }
                ]}
                layout={{width: 1500, height: 600, title: props.symbol}}
            />
        </div>
            

    )
}


export default TickerGraph