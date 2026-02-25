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
    <div className='space-y-8 pb-96'>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-600 mt-1">A quick overview of your invoices</p>
      </div>

      {/* Stats cards*/}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3  gap-6">
        {statsData.map((stat,index)=>(
          <div className="bg-white p-4 rounded-xl border border-slate-200  shadow-lg shadow-gray-100 " key={index}>
             <div className="flex items-center">
              <div className={`shrink-0 w-12 h-12 ${colorClasses[stat.color].bg} rounded-full flex items-center justify-center `}>
                <stat.icon className={`h-6 w-6 ${colorClasses[stat.color].text}`} />
              </div>
              <div className="ml-4 min-w-0">
                <div className="text-sm font-medium text-slate-500 truncate ">
                  {stat.label}
                </div>
                <div className="text-2xl font-bold text-slate-900 wrap-break-word truncate">
                  {stat.value}
                </div>
              </div>

             </div>
          </div>
        ))}

      </div>

      { /* AI Insights Card */}
 

      {/* Recent Invoices  */}

    </div>
  )
}

export default Dashboard;