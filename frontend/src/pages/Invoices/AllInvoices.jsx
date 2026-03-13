import React, { useState, useEffect useMemo, use} from 'react'
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from '../../utils/apiPaths';
import {Loader2, Trash2, Edit, Search, FileText, Plus, AlertCircle, Sparkles, Mail} from "lucide-react";
import moment from "moment";
import useNavigate from 'react-router-dom';
import Button from '../../components/ui/Button';


const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReminderModalOpen, setIsRemindModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const  fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
        setInvoices(response.data.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)))
      } catch (error) {
        setError("Failed to fetch invoices");
        console.error("Failed to fetch invoices", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);
 
  const handleDelete = async(id)=>{};

  const handleStatusChange = async (invoice)=>{};

const handleOpenReminderModal = (invoiceId) =>{
  setSelectedInvoiceId(invoiceId);
  setIsRemindModalOpen(true);
};

const filteredInvoices = useMemo(() => {

  return invoices.filter(invoice => statusFilter === "All" || invoice.status === statusFilter).filter(invoice=> invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || invoice.billTo.clientName.toLowerCase().includes(searchTerm.toLowerCase()) )
  

},[invoices,searchTerm,statusFilter])

if(loading){
  return <div className="flex justify-center w-8 h-8 animate-spin items-center text-blue-600 ">
    <Loader2 className='' />
  </div>
}
  return (
    <div className="space-y-6">
         <CreateWithAIModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
          <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsRemindModalOpen(false)} invoiceId={selectedInvoiceId} />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">All Invoices</h1>
              <p className="text-sm text-slate-600 mt-1"> Manage all your invoicesin one place.</p>
            </div>
            <div className="flex items-center gap-2">
                 <Button variant='secondary' onClick ={() => setIsModalOpen(true)} icon ={Sparkles}> Create With AI</Button>
                 <Button onClick={()=> navigate("/invoices/new")} icon={Plus}>Create Invoice</Button>

            </div>
          </div>

       {error && (
        <div className="p-4 rounded-lg bg-red-50 border-red-200">
          <div className="flex items-start">
            <AlertCircle  className='w-5 h-5 text-red-600 mt-0.5 mr-3'/>
            <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800 mb-1">Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
       ) }
    </div>
  )
}

export default AllInvoices;