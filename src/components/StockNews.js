import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



function StockNews() {

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newsAPIKey] = useState("c8c78fe6098341b7947bc42d20a758d6")


  //Make api call to news api
  const getNewsData = async() => {
    //Set loading boolean to true so that we know to show loading text
    setLoading(true);

    //Make news api call using axios
    const resp = await axios.get(`https://newsapi.org/v2/top-headlines?category=business&country=us&apiKey=${newsAPIKey}`);
    setNewsData(resp.data.articles);

    //Set loading boolean to false so that we know to show news articles
    setLoading(false);
  }

  useEffect(() => {
    getNewsData();
  }, []);



  return (
    <div className='News-Div'>
      {/* <header className="App-header"> */}
        {loading ? "Loading..." : 
        
        <Container>

          {newsData.map((newsData, index) =>
            <Row>
              <Col xs={12} className="mt-5 w-500" key={index}>
                <a target="_blank" href={newsData.url}>
                  <Card className='News-Card'>
                    <Card.Title> {newsData.title}</Card.Title>
                    <Card.Img src={newsData.urlToImage} />
                    <Card.Body>

                      <Card.Text>
                        {newsData.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              </Col>
            </Row>
          )}

        </Container>

        }
      {/* </header> */}
    </div>
  );
}

export default StockNews;