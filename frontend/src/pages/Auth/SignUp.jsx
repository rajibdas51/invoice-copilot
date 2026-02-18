import React,{useState} from 'react'
import {Eye,EyeOff,Loader2,Mail,Lock,FileText,ArrowRight, User} from 'lucide-react';
import {API_PATHS} from '../../utils/apiPaths.js';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosinstance.js';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/helper.js';


const SignUp = () => {
  const {login} = useAuth();
  const navigate = useNavigate();

  const {formData, setFormData} = useState({
    name:"",
    email:"",
    password:"",
    confimPassword:""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success,setSuccess] = useState("");
  const[fieldErrors, setFieldErrors] = useState({
    name:"",
    email:"",
    password:"",
    confimPassword:""
  });

  const [touched, setTouched] = useState({
    name:false,
    email:false,
    password:false,
    confimPassword:false
  });

  // validation functions

  const validateName = (name)=>{};
  const validateConfirmPassword = (confirmPassword, password)=>{};

  const handleInputChange = (e)=>{};
  const handleBlur =(e)=>{};
  const isFormValid= ()=>{};
  const handleSubmit = async()=>{}



  return (
    <div className='min-h-screen bg-white flex items-center justify-center px-4 py-8 '>
       <div className="w-full max-w-sm">
        {/* Header */ }
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-linear-to-r from from-blue-500 to-blue-600 rounded-xl mx-auto mb-6 flex items-center justify center">
            <FileText className='w-6 h-6 text-white' />

          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600 text-sm  ">Join Invoice Generator today</p>
        </div>

        {/*form */}
        <div className="space-y-4">
          {/*Name*/}
          <div>
            <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 "/>
              <input 
                name='name'
                type='text'
                required
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${fieldErrors.name && touched.name ?"border-red-300 focus:ring-red-500":"border-gray-300 focus:ring-black"}`}
                placeholder='Enter your full name'
              />
             </div>
             {fieldErrors.name && touched.name &&(
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
             )}
          </div>
          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 "/>
              <input type="email" 
               name='email'
               required
               value={formData.email}
               onChange={handleInputChange}
               onBlur={handleBlur}
                 className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${fieldErrors.email && touched.email ?"border-red-300 focus:ring-red-500":"border-gray-300 focus:ring-black"}`}
                 placeholder='Enter your email'
              />
            </div>
            {fieldErrors.email && touched.email &&(
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}

          </div>
          {/* Password */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 " />
              <input type={showPassword?"text":"password"} 
              required
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${fieldErrors.password && touched.password ?"border-red-300 focus:ring-red-500":"border-gray-300 focus:ring-black"}`}
              placeholder='Create a password'
              />
              <button type='button' onClick={()=>setShowPassword(!showPassword)} className="absolute right-4 top-1/2  transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ?(<EyeOff className='w-5 h-5'/>):(<Eye className='w-5 h-5'/>)}
              </button>
            </div>
            {fieldErrors.password && touched.password &&(
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}  

          </div>
          
          {/* Confirm password*/}

          <div>
            <label  className='block text-sm font-medium text-gray-700 mb-2'>Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 "/>
              <input type={showConfirmPassword? "text":"password"}
              required
              value={formData.confimPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}

               className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${fieldErrors.confimPassword && touched.confimPassword ?"border-red-300 focus:ring-red-500":"border-gray-300 focus:ring-black"}`}
              placeholder='Confirm your password'/>
              <button
              type='button'
              onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2  transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {
                showConfirmPassword? (
                  <EyeOff className='w-5 h-5' />
                ):(<Eye className='w-5 h-5' />)
              }
              </button>
            </div>
            {fieldErrors.confimPassword && touched.confimPassword && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.confimPassword}</p>
            )}

          </div>

          {/* Error/success Messages */}
           {
            error &&(
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg ">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )
           }

           {
            success &&(
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg ">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )
           }
         
         {/* Terms & Conditions */}

         <div className="flex items-start pt-2">
          <input type="checkbox" id='terms'
            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black mt-1 " 
            required/>
          <label htmlFor="terms" className='ml-2 text-sm text-gray-600'>
            I agree to the {" "} 
            <button className="text-black hover:underline">Terms of Service</button> {" "}
            and{" "}
            <button className="text-black hover:underline">Privacy Policy</button>
          </label>
         </div>

         {/* Sign Up Button */}
         <button  
         onClick={handleSubmit} 
         disabled={isLoading || !isFormValid()}
         className="w-full bg-linear-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center group"
         >
          {
            isLoading ? (
              <>
              <Loader2 className='w-4 h-4 mr-2 animate-spin'/>
              Creating account...
              </>
            ):(<>
              Create Account 
              <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform ' />
            </>)
          }
         </button>
        </div>

        {/*----- Footer ---*/}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center  ">
          <p className="text-sm text-gray-600">
            Already have an Account? {" "}
            <button className="text-black font-medium hover:underline" onClick={()=> navigate("/login")}>Sign in</button>
          </p>
        </div>

       </div>
    </div>
  )
}

export default SignUp;