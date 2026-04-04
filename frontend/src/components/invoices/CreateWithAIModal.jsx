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
    if(!text.trim()){
        toast.error('Please enter some text to generate an invoice.');
        return;
    }
    setIsLoading(true);
    try{
      const response = await axiosInstance.post(API_PATHS.AI.PARSE_INVOICE_TEXT,{text});
      const invoiceData = response.data;
      toast.success('Invoice generated successfully!');
      onClose();
      // navigate to the invoice creation page with the generated data
      navigate('/invoices/new',{aiData: invoiceData});

    }catch(error){
      console.error('Error generating invoice:',error);
      toast.error('Failed to generate invoice from text. Please try again.');
    }finally{
      setIsLoading(false);
    }
  
 };
  return (
    <div className='fixed inset-0 z-50 overflow-y-auto '>
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 transition-opacity" onClick={onclose}></div>
        
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative  text-left transform transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className='text-lg font-semibold flex items-center text-slate-900'>
              <Sparkles className='w-5 h-5 mr-2 text-blue-600' size={20}/>
              Create Invoice with AI
            </h3>
            <button onClick={onclose} className="text-slate-400 hover:text-slate-600">&times;</button>
          </div>
          <div className="space-y-4 ">
            <p className="text-sm text-slate-600">
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
          <div className="flex  justify-end mt-6 space-x-3">
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