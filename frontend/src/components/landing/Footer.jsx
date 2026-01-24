
import {Link} from 'react-router-dom';
import {X,Github,Linkedin,FileText} from "lucide-react";

const FooterLink =({href,to,children}) =>{
    const className="block text-gray-400 hover:text-white transition-colors duration-200";
    if(to){
        return <Link to={to} className={className}>{children}</Link>
    }
    return <a href={href} className={className}>{children}</a>
}

const SocialLink =({href,children}) =>{
    return(
        <a href={href} target='_blank' rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">{children}</a>
    )
}

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
                <div className="space-y-4 md:col-span-2 lg:col-span-1">
                    <Link to="/" className="flex items-center space-x-2 mb-6">
                      <div className=" w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center
                    ">
                        <FileText className="w-4 h-4 text-white"/>
                    </div>
                     <span className="text-xl font-bold">Invoice Copilot</span>
                    </Link>
                    <p className="text-gray-400 leading-relaxed max-w-sm">Effortlessly create and send professional invoices.</p>
                </div>

                <div className=" ">
                    <h3 className='text-base font-semibold mb-4'>Product</h3>
                    <ul className="space-y-2">
                        <li className="">
                            <FooterLink href="#features">Features</FooterLink>
                        </li>
                        <li className="">
                            <FooterLink href="#testimonials">Testimonials</FooterLink>
                        </li>
                        <li className="">
                            <FooterLink href="#faq">FAQ</FooterLink>
                        </li>
     
                    </ul>

                </div>
         
            <div className="">
                <h3 className="text-base font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                    <li className="">
                        <FooterLink to="/about">About Us</FooterLink>
                    </li>
                    <li className="">
                        <FooterLink to="/contact">Contact</FooterLink>  
                    </li>
                </ul>
            </div>
            <div className="">
                 <h3 className="text-base font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                    <li className="">
                        <FooterLink to="/privacy">Privacy Policy</FooterLink>
                    </li>
                    <li className="">
                        <FooterLink to="/terms">Terms of Service</FooterLink>  
                    </li>
                </ul>
            </div>

         </div>


     {/*copyright */}
        <div className="border-t border-gray-800 py-8 mt-16 ">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <p className="text-gray-400">
                    &copy; 2026 Invoice Copilot. All rights reserved.
                </p>
                <div className="flex space-x-4">
                    <SocialLink href="#">
                        <X className="w-5 h-5"/>
                    </SocialLink>
                    <SocialLink href="https://github.com">
                        <Github className="w-5 h-5"/>
                    </SocialLink>
                    <SocialLink href="https://linkedin.com">
                        <Linkedin className="w-5 h-5"/>
                    </SocialLink>
                </div>
            </div>
        </div>

        </div>

   
    </footer>
  )
}

export default Footer;