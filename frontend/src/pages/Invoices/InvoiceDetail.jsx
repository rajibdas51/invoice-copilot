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

  return (
    <div>InvoiceDetail</div>
  );
};

export default InvoiceDetail;