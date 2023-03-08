import './App.css';
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AuthContext, { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Header from './components/header'
import PrivateRoute from './utils/PrivateRoute'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';


function App() {

  return (
    <div className="App">
      <Router>
        <AuthProvider> {/* gives the app access to all the information from AuthContext */}
          <Header/>
          <Routes>
            <Route exact path='/' element={<PrivateRoute/>}>
              <Route exact path='/' element={<HomePage/>}/>
            </Route>
            <Route element={<LoginPage/>} path='/login/'/>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
