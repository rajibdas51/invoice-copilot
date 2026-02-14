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

        </div>
       </div>
    </div>
  )
}

export default SignUp;