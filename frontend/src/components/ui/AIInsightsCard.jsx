import {useState,useEffect} from 'react';
import { Lightbulb } from 'lucide-react';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';

const AIInsightsCard = () => {
  const [insights, setInsights] = useState([]);
  const[isLoading, setIsLoading] = useState(true);
  
  useEffect(()=>{
    const fetchInsights = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AI.GET_DASHBOARD_SUMMARY);
        setInsights(response.data.setInsights || []);
        
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setIsLoading(false);        
      }
    }

    fetchInsights();
  },[])


  return (
    <div>AIInsightsCard</div>
  )
}

export default AIInsightsCard