
import Faqs from '../../components/landing/Faqs';
import Features from '../../components/landing/Features';
import Header from '../../components/landing/Header';
import Hero from '../../components/landing/Hero';
import Testimonials from '../../components/landing/Testimonials';


const LandingPage = () => {
  return (
    <div className='bg-[#ffffff] text-gray-600'>
      
      <Header/>
      {/* Hero Section */}
      <main className='mb-[100vh]'>
        <Hero/>
        <Features/>
        <Testimonials/>
        <Faqs/>
      </main>
    </div>
  )
}

export default LandingPage;