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
    <div className=''>
      <div className="">
        <div className="" onClick={onclose}></div>
        
        <div className="">
          <div className="">
            <h3 className=''>
              <Sparkles className='inline mr-2' size={20}/>
              Create Invoice with AI
            </h3>
            <button onClick={onclose} className="">&times;</button>
          </div>
          <div className="">
            <p className="">
              Paste any text that contains invoice details (like client name, items, quantitities,and prices) and the AI will attempt to create an invoice for you. The more details you provide, the better the AI can generate an accurate invoice.
            </p>
            <TextareaField
             name="invoiceText"
             label="Paste invoice details here"
             value={text}
              onChange={(e)=>setText(e.target.value)}
              placeholder="e.g. 'Invoice for ClientCorp: 2 hours of web development at $50/hour, 3 hours of design at $40/hour'"
              rows={8}
            />
          </div>
          <div className="">
             <button variant="secondary" onClick={onClose}>Cancel</button>
             <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Invoice'}
             </Button>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default CreateWithAIModal   