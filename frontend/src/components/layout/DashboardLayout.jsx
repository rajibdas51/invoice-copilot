import {useState,useEffect} from 'react'
import  {Briefcase, LogOut,Menu,X} from 'lucide-react';
import { Link,useNavigate } from 'react-router-dom'; 
import{ useAuth} from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown"
const DashboardLayout = ({children, activeMenu}) => {
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

 
 useEffect(()=>{
  const handleClickOutside = ()=>{
    if(profileDropDownOpen){
      setProfileDropDownOpen(false);
    }
  }
   
  document.addEventListener("click", handleClickOutside);

  return ()=> document.removeEventListener("click", handleClickOutside);

 },[profileDropDownOpen])


 const handleNavigation = (itemId)=>{
  setActiveNavItem(itemId);
  navigate(`/${itemId}`);
  if(isMobile){
    setSidebarOpen(false);
  }
 };

const toggleSidebar= ()=>{
  setSidebarOpen(!sidebarOpen);
}

const sidebarCollapsed = !isMobile && false;



  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ${isMobile?sidebarOpen?"translate-x-0":"-translate-x-full":"translate-x-0"} ${sidebarCollapsed?"w-16":"w-64"}  bg-white border-r border-gray-200 `}>
       
       {/*  Company Logo */}
       <div className="flex items-center h-16 border-b border-gray-200 px-6">
          <Link className='flex items-center space-x-3 ' to="/dashboard">
             <div className="h-8 w-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex ite justify-center ">
                <Briefcase className='h-5 w-5 text-white' />
             </div>
             {!sidebarCollapsed && <span className='text-gray-900 font-bold text-xl'>Invoice Copilot</span>}
          </Link>
       </div>

       {/* Navigation */}
       <nav className='p-4 space-y-2'>
         
       </nav>
       
       {/* Logout */}
        
        <div className="">
          <button className="" onClick={logout}> 
            <LogOut className=''/>
            {!sidebarCollapsed &&  <span className=''>Logout</span>}
          </button>
        </div>

      </div>
       
       {/* Mobile overlay */}
       
       {isMobile && sidebarOpen && (
        <div className="" onClick={()=>setSidebarOpen(false)} />
       )}

       {/* Main Content */}

       <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isMobile? "ml-0":sidebarCollapsed ? "ml-16":"ml-64"
       }`}>

        { /* Top navbar */}

        <header className="">
          <div className="">
              {isMobile &&(
                <button className="" onClick={toggleSidebar}>
                  {sidebarOpen? (<X className=''/>):(<Menu className=''/>)}
                </button>
              )}
              <div>
                <h1 className="">
                  Welcome back, {user?.name}
                </h1>
                <p className=''> here's your invoice overview.</p>
              </div>
          </div>
          <div className="">
             {/* Profile dropdown*/}

          </div>
        </header>

        {/*---- Main content area---- */}
        <main className="">{children}</main>
       </div>

    </div>
  )
}

export default DashboardLayout;