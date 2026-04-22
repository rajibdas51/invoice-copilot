import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { Loader2, Edit, Printer, AlertCircle, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import CreateInvoice from './CreateInvoice';
import Button from '../../components/ui/Button';
import ReminderModal from '../../components/invoices/ReminderModal';

const InvoiceDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const invoiceRef = useRef();

useEffect(() => {
  const fetchInvoice = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INVOICE.GET_INVOICE_BY_ID(id)
      );
      setInvoice(response.data);
    } catch (error) {
      toast.error('Failed to fetch invoice.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchInvoice();
}, [id]);

  const handleUpdate = async (formData) => {
    try{
      const response = await axiosInstance.put(
        API_PATHS.INVOICE.UPDATE_INVOICE(id),
        formData
      );
       setIsEditing(false);
      setInvoice(response.data);
     
      toast.success('Invoice updated successfully.');

    } catch(error){
       toast.error('Failed to update invoice.');
        console.error(error);
    }

  };

  const hadlePrint = () => {
    window.print();
  };

  if(loading){
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if(!invoice){
    return(
      <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-lg">
        <div className="">
        <AlertCircle className="w-8 h-8 text-red-600"/>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Invoice not found</h3>
        <p className="text-slate-500 mb-6">The requested invoice could not be found or could not be loaded.</p>
          <Button variant="outline" onClick={() => navigate('/invoices')}>Back to All Invoices</Button>
      </div>
    )
  }

  if(isEditing){
    return(
      <CreateInvoice existingInvoice={invoice} onSave={handleUpdate}/>
    )
  }


  return (
<>
  <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} invoiceId={id} />

   <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 print:hidden">
    <h1 className="text-2xl font-semibold text-slate-900 mb-4 sm:mb-0">
      Invoice <span className='font-mono text-slate-500'>{invoice.invoiceNumber}</span>
    </h1>
    <div className="">
      {
        invoice.status !=='Paid' && (
          <Button variant="secondary" onClick={() => setIsReminderModalOpen(true)} icon={Mail}>
            Generate Reminder
        
      
          </Button>

        )
      }

      <Button variant="secondary" onClick={() => setIsEditing(true)} icon={Edit}>
        Edit
      </Button>
      <Button variant="primary" onClick={hadlePrint} icon={Printer}>
        Print or Download
      </Button>
     
    </div>
   </div>
   <div id='invoice-content-wrapper'>
       <div className="" ref={invoiceRef} id='invoice-preview'>
          <div className="">
            <div className="">
              <h2 className="">INVOICE</h2>
              <p className="">#{invoice.invoiceNumber}</p>
            </div>
            <div className="">
              <p className="">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.status ==="Paid"?"bg-emerlad-100 text-emerald-800": invoice.status==="Pending"?"bg-amber-100 text-amber-800":"bg-red-100 text-red-800"}
                `}>
                {invoice.status}
                </span>
            </div>
          </div>

          <div className="">
             <div>
              <h3 className="">Bill From</h3>
              <p className="">{invoice.billFrom.businessName}</p>
              <p className="">{invoice.billFrom.email}</p>
              <p className="">{invoice.billFrom.address}</p>
              <p className="">{invoice.billFrom.phone}</p>

             </div>
             <div className="">
              <h3 className="">Bill To</h3>
              <p className="">{invoice.billTo.clientName}</p>
              <p className="">{invoice.billTo.email}</p>
              <p className="">{invoice.billTo.address}</p>
              <p className="">{invoice.billTo.phone}</p>
             </div>
          </div>
       </div>
   </div>

</>  );
};





export default InvoiceDetail;