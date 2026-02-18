import React,{useState} from 'react'
import {Eye,EyeOff,Loader2,Mail,Lock,FileText,ArrowRight} from 'lucide-react';
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
    <div className=''>
       <div className="">
        {/* Header */ }
        <div className="">
          <div className="">
            <FileText className='' />

          </div>
          <h1 className="">Create Account</h1>
          <p className="">Join Invoice Generator today</p>
        </div>

        {/*form */}
        <div className="">
          {/*Name*/}
          <div>
            <label htmlFor="" className="">
              Full Name
            </label>
            <div className="">
              <User className=""/>
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
              <p className="">{fieldErrors.name}</p>
             )}
          </div>
          {/* Email */}
          <div>
            <label className=''>Email</label>

            <div className="">
              <Mail className='' />
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
              <p className="">{fieldErrors.email}</p>
            )}

          </div>
          {/* Password */}
          <div>
            <label className=''>Password</label>
            <div className="">
              <Lock className='' />
              <input type={showPassword?"text":"password"} 
              required
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${fieldErrors.password && touched.password ?"border-red-300 focus:ring-red-500":"border-gray-300 focus:ring-black"}`}
              placeholder='Create a password'
              />
              <button type='button' onClick={()=>setShowPassword(!showPassword)} className="">
                {showPassword ?(<EyeOff className=''/>):(<Eye className=''/>)}
              </button>
            </div>
            {fieldErrors.password && touched.password &&(
              <p className="">{fieldErrors.password}</p>
            )}
          </div>
          
          {/* Confirm password*/}

          <div>
            <label  className="">Confirm Password</label>
            <div className="">
              <Lock className=''/>
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
              className="">
              {
                showConfirmPassword? (
                  <EyeOff className='' />
                ):(<Eye className='' />)
              }
              </button>
            </div>
            {fieldErrors.confimPassword && touched.confimPassword && (
              <p className="">{fieldErrors.confimPassword}</p>
            )}
          </div>

          {/* Error/success Messages */}
           {
            error &&(
              <div className="">
                <p className="">{error}</p>
              </div>
            )
           }

           {
            success &&(
              <div className="">
                <p className="">{success}</p>
              </div>
            )
           }
         
         {/* Terms & Conditions */}

         <div className="">
          <input type="checkbox" id='terms'  className="" required/>
          <label htmlFor="" className=''>
            I agree to the {" "} 
            <button className="">Terms of Service</button> {" "}
            and{" "}
            <button className="">Privacy Policy</button>
          </label>
         </div>

         {/* Sign Up Button */}
         <button  
         onClick={handleSubmit} 
         disabled={isLoading || !isFormValid()}
         className=""
         >
          {
            isLoading ? (
              <>
              <Loader2 className=''/>
              Creating account...
              </>
            ):(<>
              Create Account 
              <ArrowRight className='' />
            </>)
          }
         </button>
        </div>

        {/*----- Footer ---*/}
        <div className="">
          <p className="">
            Already have an Account? {" "}
            <button className="" onClick={()=> navigate("/login")}>Sign in</button>
          </p>
        </div>

       </div>
    </div>
  )
}

export default SignUp;