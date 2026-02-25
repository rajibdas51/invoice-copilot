import {useEffect,useState} from 'react';
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from '../../utils/apiPaths';
import { Loader2,FileText, DollarSign, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Button from "../../components/ui/Button";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoice:0,
    totalPaid:0,
    totalUnpaid:0
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchDashboardData = async()=>{
       try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
        const invoices = response.data;
        const totalInvoice = invoices.length;
        const totalPaid = invoices.filter((inv)=>inv.status === "Paid").reduce((acc,inv)=> acc + inv.total, 0);
        
        const totalUnpaid = invoices.filter((inv)=>inv.status !== "Paid").reduce((acc,inv)=> acc + inv.total, 0);
         setStats({
          totalInvoice,
          totalPaid,
          totalUnpaid
          });

          setRecentInvoices(invoices.sort((a,b)=> new Date(b.invoiceDate) - new Date(a.invoiceDate)).slice(0,5 ));

        
       } catch (error) {
          console.error("Error fetching dashboard data:", error);
          
       } finally{
        setLoading(false);
       }
    };

    fetchDashboardData();
    
        
     
  },[]);

  const statsData = [{
    icon:FileText,
    label:"Total Invoices",
    value:stats.totalInvoice,
    color:"blue"
  },
  {icon:DollarSign,
    label:"Total Paid",
    value:`${stats.totalPaid.toFixed(2)}`,
    color:"emerald"
  },
  {icon:DollarSign,
    label:"Total Unpaid",
    value:`${stats.totalUnpaid.toFixed(2)}`,
    color:"red"
  }

];

const colorClasses ={
  blue:{bg:"bg-blue-100", text:"text-blue-600"},
  emerald:{bg:"bg-emerald-100", text:"text-emerald-600"},
  red:{bg:"bg-red-100", text:"text-red-600"},

}

if(loading){
  return(
    <div className="flex justify-center items-center h-96">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  )
}

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard;