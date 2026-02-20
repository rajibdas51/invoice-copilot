import {useState,useEffect} from 'react'
import  {Briefcase, Logout,Menu,X} from 'lucide-react';
import { Link,useNavigate } from 'react-router-dom'; 
import{ useAuth} from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown"
const DashboardLayout = ({children}) => {
  const {user,logout} = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen,setSidebarOpen] = useState(false);
  const [activeNavItem,setActiveNavItem] = useState(activeMenu || "dashboard");
  const [profileDropDownOpen,setProfileDropDownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior

 useEffect(()=>{

    const handleResize =()=>{
      const mobile = window.innerWidth <768;
      setIsMobile(mobile);
      if(!mobile){
      setSidebarOpen(false);

     }
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return ()=>{
      window.removeEventListener("resize",handleResize)
    }
  
 },[]);

 // close dropdowns when clicking outside


  return (
    <div>DashboardLayout

        <div>
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout;