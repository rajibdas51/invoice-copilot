import {useState,useEffect} from 'react'
import {useNavigate, useLocation} from "react-router-dom";
import  axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from '../../utils/apiPaths';
import {Plus, Trash} from "lucide-react";
import toast from "react-hot-toast";
import moment from 'moment';
import {useAuth} from "../../context/AuthContext";
const InvoiceDetail = () => {}

const CreateInvoice = ({existingInvoice, onSave}) => {
  const navigate = useNavigate();
  const {user} = useAuth();
  const [formData, setFormData] = useState(
  existingInvoice || {
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    billFrom: {
      businessName: user?.businessName || "",
      email: user?.email || "",
      address: user?.address || "",
      phone: user?.phone || "",
    },
    billTo: { clientName: "", email: "", address: "", phone: "" },
    items: [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }],
    notes: "",
    paymentTerms: "Net 15",
  }
);

const [loading, setLoading] = useState(false);
const [isGeneratingNumber, setIsGeneratingNumber] = useState(!existingInvoice);

useEffect(() => {
  const aiData = location.state?.aiData;

  if(aiData){
  setFormData(prev =>({
    ...prev,
    billTo:{
      clientName:aiData.clientName || "",
      email:aiData.clientEmail || "",
      address:aiData.clientAddress || "",
      phone:"",
    },
    items: aiData.items || [{
      name: "",
      quantity: 1,
      unitPrice: 0,
      taxPercent: 0,
    }]
  }));
  }

  if(existingInvoice){
    setFormData({
      ...existingInvoice,
      invoiceDate: moment(existingInvoice.invoiceDate).format("YYYY-MM-DD"),
      dueDate: moment(existingInvoice.dueDate).format("YYYY-MM-DD"),
    });
  } else{
    const generateNewInvoiceNumber = async () => {
      setIsGeneratingNumber
      try {
        const response = await axiosInstance.get(API_PATHS.GET_ALL_INVOICES);
        const invoices = response.data;
        let maxNum = 0;
        invoices.forEach((inv)=>{
          const num = parseInt(inv.invoiceNumber.split("-")[1]);
          if(!isNaN(num) && num > maxNum){
            maxNum = num;
          }
        });
        const newInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, "0")}`;
        setFormData(prev => ({
          ...prev,
          invoiceNumber: newInvoiceNumber,
        }));

      } catch(error){
         console.error("Failed to generate invoice number",error);
         setFormData((prev)=>({...prev,invoiceNumber:`INV-${Date.now().toString().slice(-5)}`}));
      }
      setIsGeneratingNumber(false);
    };
    generateNewInvoiceNumber();
  }
}

,[existingInvoice]);

const handleInputChange = (e,section,index) => {

}

const handleAddItem = ()=>{
  setFormData({...formData,items:[...formData.items,{name:"",quantity:1,unitPrice:0,taxPercent:0}]  })
}

const handleRemoveItem = (index)=>{}

const {subtotal, taxTotal, total} = (()=>{
  let subtotal = 0, taxTotal = 0;
  
  formData.items.forEach((item)=>{
    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
    subtotal += itemTotal;
    taxTotal += itemTotal * ((item.taxPercent || 0) / 100);
  });
  return {subtotal,taxTotal,total:subtotal + taxTotal};

  }
)();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
}


  return (
    <div>CreateInvoice</div>
  )

}
export default CreateInvoice;