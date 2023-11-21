import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import WelcomePage from './components/WelcomePage/WelcomePage';
import NavigationBar from './components/Navbar/NavigationBar';
import User from './components/User/User';
import './services/AxiosInterceptors';


function App() {

  return (
    <div className="App">
      <BrowserRouter> 
      <NavigationBar></NavigationBar>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/users/:userId" element={<User/>}/>

          {/* <Route exact path="/auth" element={<WelcomePage/>}/> */}
          <Route exact path="/auth"
          element={localStorage.getItem("currentUser") != null ? <Navigate to="/"/>: <WelcomePage/>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
