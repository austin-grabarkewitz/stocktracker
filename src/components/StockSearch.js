import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import jwt_decode from "jwt-decode";
import TickerGraph from "./TickerGraph";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'
import StockNews from "./StockNews";



const StockSearch = (props) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [userID, setUSerID] = useState(null)
    let {user, authTokens, logoutUser} = useContext(AuthContext)
    let [faveTicks, setFaveTicks] = useState([])
    let [followCount, setFollowCount] = useState(0)
    let [graphToDisplay, setGraphToDisplay] = useState(null)
    let [deleteCount, setDeleteCount] = useState(0)
    // user = JSON.stringify(user);
    // user = JSON.parse(user);


useEffect(() => {
  getFaveTicks()
}, [followCount, deleteCount, setGraphToDisplay])
  
//#########################################################

    const handleInputChange = (event) => {
      setSearchQuery(event.target.value);
    };


//#################//#################//#################//#################//#################


let getFaveTicks = async() => {
  const base_url = process.env.REACT_APP_BASE_URL
  let response = await fetch(`http://${base_url}/api/tickers/`, {
      method: 'GET',
      headers: {

          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + String(authTokens.access)

      }
  })
  let data = await response.json()

  if(response.status === 200) {
      setFaveTicks(data)
  } else if (response.statusText === 'Unauthorized') {
      logoutUser()
  }
  
}

  
//#########################################################

    //search for a term and and set the 10 closest results to 'searchResults'

    const handleSearch = async() => {

        let stockSymbols = []
        let stockNames = []
        let nameSymbolList = []

        //get API for search results
        try {
          const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchQuery}&apikey=${props.apiKey}`, {
            method: 'GET',
            headers: { 'User-Agent': 'request' }
          });
      
          //if response is good..
          if (response.ok) {
            //convert the response data to JSON
            const data = await response.json();
            //Consoel log it (duh)
            console.log(data);
            
            //a LOT of work to get setSearchResults to work.. will elaborate later
            for (var key in data['bestMatches']) {
                stockSymbols.push(data['bestMatches'][key]['1. symbol'])
                stockNames.push(data['bestMatches'][key]['2. name'])
            }

            for (var i=0; i<stockSymbols.length; i++) {
                var obj = {};
                obj.name = stockNames[i]
                obj.symbol = stockSymbols[i]
                console.log(obj)
                nameSymbolList.push(obj)
            }

            setSearchResults(nameSymbolList)
            console.log("setSearchResults: " + searchResults)

          } else {
            console.log('Network response was not ok.');
          }
        } catch (error) {
          console.error('There was an error!', error);
        }
      };

  
//#########################################################


      //sends a POST request to the /api/tickers/ URL with the symbol of the stock to follow in the request body. 
      //ADD TOKEN AUTHERNTICATION VERIFICATION
      const handleFollow = (symbol) => {
        const base_url = process.env.REACT_APP_BASE_URL
        const data = { 
            'favTicker': symbol,
            'user': user.user_id
        };
            
        fetch(`http://${base_url}/api/tickers/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + String(authTokens.access)
          },
          body: JSON.stringify(data)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          console.log('Stock followed successfully!');
          setFollowCount(followCount + 1);
        })
        .catch(error => {
          console.error('Error following stock:', error);
        });
      };
      

//#########################################################


const handleDisplayGraph = (id, title) => {

  // console.log("TITLE: " + title)
  // console.log("ID: " + id) //need id to delete object
  setGraphToDisplay(<TickerGraph tickID={id} symbol={title}/>)

}


//#########################################################


const handleDelete = (id) => {
  const base_url = process.env.REACT_APP_BASE_URL
  const data = { 
      'id': id
  }; 

  fetch(`http://${base_url}/api/tickers/`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'Authorization' : 'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify(data)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      console.log('Stock deleted successfully!');
      setGraphToDisplay(null);
      setDeleteCount(deleteCount + 1);
  })
  .catch(error => {
      console.error('Error deleting stock:', error);
  });
}


//#################//#################//#################//#################//#################


// faveTicks.forEach( function(ticker){
//   console.log(ticker['favTicker'])
// })
// console.log("GRAPH TO DISPLAY : " + graphToDisplay)
// console.log("ID: " + graphToDisplay.props.tickID)

    return (
      <div>
        <input className="Stock-Search-Box" type="text" value={searchQuery} onChange={handleInputChange} />
        {/* <button onClick={handleSearch}>Search</button> */}
        <Button className="Search-Button" onClick={handleSearch}>Search</Button>
        <ul>
            {searchResults.map((result) => (
                <ul key={result['symbol']}>
                {result['symbol']} - {result['name']}
                <span>      </span>
                {/* <button className="Search-Button" onClick={() => handleFollow(result['symbol'])}>Follow</button> */}
                <Button className="Follow-Button" onClick={() => handleFollow(result['symbol'])} variant="success">Follow</Button>
                </ul>
            ))}
        </ul>
        <br/>
        <h3 className="Followed-Tickers-Text">Followed Tickers:</h3>    
        <br/>     
        {/* <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" className="mb-3" full>
          {faveTicks.length !== 0 && faveTicks.map((faveTick) => (   // If there are followed Tickers, render. If not, don't
               <Tab eventkey={faveTick.id} key={faveTick.id} title={faveTick.favTicker}> 
                {console.log("TAB", faveTick.favTicker)}
                    <TickerGraph key={faveTick.id} tickID={faveTick.id} symbol={faveTick.favTicker}/> 
                    <p>Hello</p>
               </Tab>
            ))
          }
        </Tabs> */}

        <div className="container">
          {/* Make buttons that set the graph to be shown. This should help render the graphs better because it's less workload */}
          {faveTicks.map((faveTick) => (
            <Button className="Stock-Button" onClick={() => handleDisplayGraph(faveTick.id, faveTick.favTicker)} key={faveTick.id} variant="success">{faveTick.favTicker}</Button>
          ))}
        </div>

        {graphToDisplay != null && graphToDisplay}
        {graphToDisplay != null && <Button onClick={() => handleDelete(graphToDisplay.props.tickID)} variant="outline-danger">Delete</Button>}

        {/* {faveTicks.map((faveTick) => (
          <>
            <TickerGraph key={faveTick.id} tickID={faveTick.id} symbol={faveTick.favTicker}/>
          </>
            ))} */}

        <br/>
        <br/>
        <h2 className="Top-News-Text">Top Business News in the US:</h2>

        <StockNews tickers={faveTicks}/>

      </div>
    );
  };
  
  export default StockSearch;



