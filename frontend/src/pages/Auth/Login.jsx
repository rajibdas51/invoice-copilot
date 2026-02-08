import React,{useState} from 'react'
import {Eye,EyeOff,Loader2,Mail,Lock,FileText,ArrowRight} from 'lucide-react';
import {API_PATHS} from '../../utils/apiPaths.js';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosinstance.js';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/helper.js';
const Login = () => {
  const {login} = useAuth();
  const navigate = useNavigate();
  const[formData, setFormData] = useState({
    email:"",
    password:"",
  });
  const[showPassword, setShowPassword] = useState(false);
  const[isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email:"",
    password:"",
  });

  const [touched, setTouched] = useState({
    email:false,
    password:false,
  });

  const handleInputChange = (e)=>{
    const {name, value} = e.target;
    setFormData((prev)=>(
      {
      ...prev,
      [name]:value,
    }
    ))

    // Real-time validation
    if(touched[name]){
      const newFieldErrors = {...fieldErrors};
      if(name === "email"){
          newFieldErrors.email = validateEmail(value) ? "" : "Please enter a valid email address";
      }else if(name === "password"){
          newFieldErrors.password = validatePassword(value) ? "" : "Password must be at least 6 characters";
      }
      setFieldErrors(newFieldErrors);
    }
    
    if(error) setError("");


  };
  const handleBlur = (e)=>{
    const {name} = e.target;
    setTouched((prev)=>({
      ...prev,
      [name]:true,
    }));

    // validate on blur
    const newFieldErrors = {...fieldErrors};
    if(name === "email"){
      newFieldErrors.email = validateEmail(formData.email);
    }else if(name === "password"){
      newFieldErrors.password = validatePassword(formData.password);
    }
    setFieldErrors(newFieldErrors);
  };

  const isFormValid = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    return !emailError && !passwordError && formData.email && formData.password;
    
  }
  const handleSubmit = async(e) =>{
      e.preventDefault();
    // validate all the fields before submitting
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
     if(emailError || passwordError){
      setFieldErrors({
        email:emailError, 
        password:passwordError,
      });
      setTouched({
        email:true,
        password:true,
      });

   
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData );
      if(response.status === 200){
        const {token } = response.data;
        if(token){
       
          setSuccess("Login successful! Redirecting...");
          login(response.data.user, token);

          // Redirect based on role
          setTimeout(()=>{
            window.location.href = '/dashboard';
          },2000)
        }
      } 
      else{
        setError(response.data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }else{
            setError( "An error occurred during login. Please try again.");
      }
      
    } finally{
      setIsLoading(false);
    }
  
  }
  return (
    <div className='min-h-screen flex items-center justify-center px-4 '>
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-linear-to-tr from-blue-500 to-blue-900 rounded-xl mx-auto mb-6 flex items-center justify-center ">
            <FileText className='w-6 h-6 text-white'/>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Login to Your Account</h1>
          <p className="text-gray-600 text-sm">Welcome back to Invoice Copilot</p>
        </div>

        {/* Form */}
        <div className="space-y-4"> 
          {/* Email */}
          <div className="">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail  className='absolute left-4 top-1/2 transform -translate-y-1/2 text text-gray-400 w-5 h-5'/>
               <input
                name='email'
                type='email'
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${fieldErrors.email && touched.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-black'}  `} 
                placeholder='Enter your Email'
               />
            </div>
            {fieldErrors.email && touched.email && <p className=' mt-1  text-red-600 text-sm '>{fieldErrors.email}</p>}

          </div>
          {/* Password */}
          <div className="">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock  className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'/>
                <input
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${fieldErrors.password && touched.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-black'}  `}
                  placeholder='Enter your password'
                />
                <button 
                type='button'
                onClick={()=>setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none transition-colors '
                >
                  {showPassword ?(
                    <EyeOff  className='w-5 h-5'/>
                  ):(
                    <Eye  className='w-5 h-5'/>
                  )}

                </button>
            </div>
            {fieldErrors.password && touched.password && <p className='text-red-500 text-sm mt-1'>{fieldErrors.password}</p>}
              
          </div>
          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success &&(
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {/* Sign in Button */}
          <button 
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid()}
          className='w-full bg-linear-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center group'
          >
            {
              isLoading ? (
                <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin '/>
                Signing In...
                </>
              ):(
                <>
                Sign In
                <ArrowRight className='w-4 h-4 ml-2 grou-hover:translate-x-1 transition-transform '/>
                </>
              )
            }
          </button>
        </div>
        
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button className="text-black font-medium hover:underline" onClick={()=>navigate("/signup")}>Sign up</button>
          </p>

        </div>

      </div>
    </div>
  )
}

export default Login;