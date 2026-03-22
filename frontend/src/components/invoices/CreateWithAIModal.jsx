import {useState} from 'react'
import {Sparkles} from "lucide-react";
import Button from '../ui/Button';
import TextareaField from '../ui/TextareaField';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast  from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';

const CreateWithAIModal = () => {
 const [text,setText] = useState('');
const[isLoading,setIsLoading] = useState(false);
 const navigate = useNavigate();

 const handleGenerate = async()=>{
  
 };
  return (
    <div>CreateWithAIModal</div>
  )
}

export default CreateWithAIModal   