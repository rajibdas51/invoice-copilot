import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import LandingPage from './pages/LandingPage/LandingPage';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import ProfilePage from './pages/Profile/ProfilePage';
import AllInvoices from './pages/Invoices/AllInvoices';
import CreateInvoice from './pages/Invoices/CreateInvoice';
import InvoiceDetail from './pages/Invoices/InvoiceDetail';
import { AuthProvider } from './context/AuthContext';
import PublicRoute from './components/auth/PublicRoute';

const App = () => {

  return(
  <AuthProvider>
   
   <Router>
    <Routes>
    
      {/* public Routes*/}

     <Route path='/' element={<LandingPage/>} />

      <Route path='/signup' element={<PublicRoute><SignUp/></PublicRoute> }/>
      <Route path='/login' element={<PublicRoute><Login/></PublicRoute>}/>

      {/* Protected  Routes */ }

      <Route path='/' element={<ProtectedRoute/>}>
        <Route path='dashboard' element={<Dashboard/>}/>
        <Route path='profile' element={<ProfilePage/>}/>
        <Route path='invoices' element={<AllInvoices/>}/>
        <Route path='invoices/new' element={<CreateInvoice/>}/>
        <Route path='invoices/:id' element={<InvoiceDetail/>}/>
        
       </Route>
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
</AuthProvider>
  )
}

export default App;