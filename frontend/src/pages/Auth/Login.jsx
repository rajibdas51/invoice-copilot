import React,{useState} from 'react'
import {Eye,EyeOff,Loader2,Mail,Lock,FileText,ArrowRight} from 'lucide-react';
import {API_URL} from '../../utils/apiPaths.js';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosinstance.js';
import { useNavigate } from 'react-router-dom';
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

  const handleInputChange = (e)=>{};
  const handleBlur = (e)=>{};

  const isFormValid = () => {}
  const handleSubmit = async(e) =>{
    e.preventDefault();
  }
  return (
    <div className=''>
      <div className="">
        {/* Header */}
        <div className="">
          <div className="">
            <FileText size={28} className=''/>
          </div>
          <h1 className="">Login to Your Account</h1>
          <p className="">Welcome back to Invoice Copilot</p>
        </div>

        {/* Form */}
        <div className=""> 
          {/* Email */}
          <div className="">
            <label htmlFor="email" className="">Email Address</label>
            <div className="">
              <Mail size={18} className=''/>
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
            {fieldErrors.email && touched.email && <p className='text-red-500 text-sm mt-1'>{fieldErrors.email}</p>}

          </div>
          {/* Password */}
          <div className="">
            <label htmlFor="password" className="">Password</label>
            <div className="">
              <Lock size={18} className=''/>
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
                className=''
                >
                  {showPassword ?(
                    <EyeOff size={18} className=''/>
                  ):(
                    <Eye size={18} className=''/>
                  )}

                </button>
            </div>
            {fieldErrors.password && touched.password && <p className='text-red-500 text-sm mt-1'>{fieldErrors.password}</p>}
              
          </div>
          {/* Error/Success Messages */}
          {error && (
            <div className="">
              <p className="">{error}</p>
            </div>
          )}

          {success &&(
            <div className="">
              <p className="">{success}</p>
            </div>
          )}

          {/* Sign in Button */}
          <button 
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid()}
          className=''
          >
            {
              isLoading ? (
                <>
                <Loader2 size={18} className='animate-spin mr-2'/>
                Signing In...
                </>
              ):(
                <>
                Sign In
                <ArrowRight size={18} className='ml-2'/>
                </>
              )
            }
          </button>
        </div>
        
        {/* Footer */}
        <div className="">
          <p className="">
            Don't have an account?{' '}
            <button className="" onClick={()=>navigate("/signup")}>Sign up</button>
          </p>

        </div>

      </div>
    </div>
  )
}

export default Login;