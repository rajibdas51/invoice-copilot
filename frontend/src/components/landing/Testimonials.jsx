import React from 'react'
import {Quote} from 'lucide-react'
import { TESTIMONIALS } from '../../utils/data'
const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
    <div className="text-center mb-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
      <p className="mt-4 text-lg text-gray-600">We are trusted by thousands of small businesses.</p>
    </div>

    <div className="">
      {TESTIMONIALS.map((testimonial, index) => (
        <div key={index} className="">
          <div className="">
            <Quote className="" />
          </div>

          <p className="">{testimonial.quote}</p>

          <div className="">
            <img
              src={testimonial.avatar}
              alt={testimonial.author}
              className=""
            />
            <div className="">
              <p className="">{testimonial.author}</p>
              <p className="">{testimonial.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

  )
} 

export default Testimonials