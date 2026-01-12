import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import LandingPage from './pages/LandingPage/LandingPage';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';


const App = () => {

  return(
    <div>
   
   <Router>
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>}/>

      {/* Catch all  Routes */ }
      <Route path='*' element={<Navigate to='/' replace/>}/>
    </Routes>
   </Router>

   <Toaster 
    toastOptions={
      {
        className:"",
        style:{
          fontSize:"13px",
        }
      }
    }
   
   />
    </div>
  )
}

export default App;