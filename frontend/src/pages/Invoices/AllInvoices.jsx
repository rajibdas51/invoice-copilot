import React, { useState, useEffect ,useMemo} from 'react'
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from '../../utils/apiPaths';
import {Loader2, Trash2, Edit, Search, FileText, Plus, AlertCircle, Sparkles, Mail} from "lucide-react";
import moment from "moment";
import {useNavigate} from 'react-router-dom';
import Button from '../../components/ui/Button';
import CreateWithAIModal from '../../components/invoices/CreateWithAIModal';
import ReminderModal from '../../components/invoices/ReminderModal';


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
 
const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this invoice?')) {
    try {
      await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
      setInvoices(invoices.filter(invoice => invoice._id !== id));
    } catch (err) {
      setError('Failed to delete invoice.');
      console.error(err);
    }
  }
};

  const handleStatusChange = async (invoice)=>{
    setStatusChangeLoading(invoice._id);
try {
 const newStatus = invoice.status === "Paid" ? "Pending" : "Paid";
  const updatedInvoice = {...invoice,status:newStatus};
  const response = await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(invoice._id),updatedInvoice);
  setInvoices(invoices.map(inv => inv._id === invoice._id ? response.data : inv));
  
} catch (error) {
  setError("Failed to update invoice status");
  console.error("Failed to update invoice status", error);  
} finally{
  setStatusChangeLoading(null);
}
  };

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

       <div className="bg-white border border-slate-200 rounded-lg  shadow-sm">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Search className='w-5 h-5 text-slate-400' />
              </div>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className=" w-full h-10  pl-10 pr-4  py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500" placeholder="Search by invoices # or client..."/>
            </div>
            <div className="shrink-0">
              <select name="" id="" className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white tex-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 " onChange={(e) => setStatusFilter(e.target.value)}
                value={statusFilter}
                >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>

              </select>
            </div>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 ">
              <FileText className="w-8 h-8 text-slate-400" />

            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No invoices found.</h3>
            <p className='text-slate-500 mb-6 max-w-md'>Your search or filter criteria did not match any invoices. Try adjusting your search.</p>
            {
              invoices.length === 0 && (
                <Button onClick={()=> navigate("/invoices/new")} icon={Plus}>Create First Invoice</Button>
              )
            }
          </div>
):(
<div className="overflow-x-auto border-t border-slate-200">
 
  <table className="w-full table-auto border-collapse">
    <thead className="bg-slate-50">
      <tr>
       
        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice #</th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-slate-200">
      {filteredInvoices.map((invoice) => (
        <tr key={invoice._id} className="hover:bg-slate-50 transition-colors">
        
          <td onClick={() => navigate(`/invoices/${invoice._id}`)} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 cursor-pointer">
            {invoice.invoiceNumber}
          </td>
          <td onClick={() => navigate(`/invoices/${invoice._id}`)} className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 cursor-pointer">
            {invoice.billTo.clientName}
          </td>
          <td onClick={() => navigate(`/invoices/${invoice._id}`)} className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 cursor-pointer">
            ${invoice.total.toFixed(2)}
          </td>
          <td onClick={() => navigate(`/invoices/${invoice._id}`)} className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 cursor-pointer">
            {moment(invoice.dueDate).format("MMM D, YYYY")}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              invoice.status === "Paid" ? "bg-emerald-100 text-emerald-800" : 
              invoice.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
            }`}>
              {invoice.status}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
              <Button size="small" variant="secondary" onClick={() => handleStatusChange(invoice)} isLoading={statusChangeLoading === invoice._id}>
             mark   {invoice.status === "Paid" ? "Unpaid" : "Paid"}
              </Button>
              <Button size="small" variant="ghost" onClick={() => navigate(`/invoices/${invoice._id}`)}>
                <Edit className="w-4 h-4 text-slate-500" />
              </Button>
              <Button size="small" variant="ghost" onClick={() => handleDelete(invoice._id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
              {invoice.status !== "Paid" && (
                <Button size="small" variant="ghost" onClick={() => handleOpenReminderModal(invoice._id)}>
                  <Mail className="w-4 h-4 text-blue-500" />
                </Button>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
)}
 </div>
 </div>
  )
}

export default AllInvoices;