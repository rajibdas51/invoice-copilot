import React , {useState,useEffect} from 'react';
import {Loader2,Mail,Copy,Check} from "lucide-react";
import Button from '../ui/Button';
import TextareaField from '../ui/TextareaField';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast  from 'react-hot-toast';

const ReminderModal = ({isOpen, onClose, invoiceId}) => {
  const [reminderText, setReminderText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if(isOpen,invoiceId){
      const generateReminder = async () => {
        setIsLoading(true);
        setReminderText('');
        try{
          const response = await axiosInstance.post(API_PATHS.AI.GENERATE_REMINDER,{invoiceId});
          setReminderText(response.data.reminderText);
          
        } catch(error){
          toast.error('Failed to generate reminder. Please try again.');
          console.error('Error generating reminder:',error);
          onClose();
        } finally{
          setIsLoading(false);
        }
      }
      generateReminder();
    }
  }, [isOpen,onClose,invoiceId]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(reminderText);
    setHasCopied(true);
     toast.success('Reminder text copied to clipboard!');
      setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  
  }

  return (
    <div>ReminderModal</div>
  )
}

export default ReminderModal