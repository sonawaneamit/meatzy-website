import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '../types';

const reviews: Testimonial[] = [
  {
    id: '1',
    name: 'Chef Von',
    role: 'Executive Chef',
    quote: "MEATZY exceeded my expectations. The marbling on the Wagyu was comparable to what I source for my restaurant.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: '2',
    name: 'Gonzalo M.',
    quote: "I was impressed by the quality of the meat. It was top notch and the packaging kept everything frozen solid.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    id: '3',
    name: 'Julia G.',
    quote: "I usually shop at Whole Foods, but Meatzy was way better. Plus, I made $50 this month referring my gym friends.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-meatzy-tallow border-t border-meatzy-mint">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-5xl font-black font-slab text-meatzy-olive text-center mb-16 uppercase">
          Hear what our clients are saying:
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-meatzy-tallow p-8 flex flex-col justify-between border-l-4 border-meatzy-rare relative pl-8">
              <Quote className="absolute top-4 left-4 w-8 h-8 text-meatzy-dill opacity-20 rotate-180" />
              <div>
                <h3 className="text-xl font-bold font-slab text-meatzy-olive mb-4 leading-snug">"{review.quote}"</h3>
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-meatzy-dill text-meatzy-dill" />
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-4">
                    <div className="w-8 h-8 bg-meatzy-welldone rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {review.name.charAt(0)}
                    </div>
                    <div className="bg-meatzy-rare text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1 h-1 bg-white rounded-full"></span> Read More
                    </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-8 pt-4 border-t border-meatzy-mint/50">
                <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-meatzy-tallow shadow-md" />
                <div>
                  <p className="font-bold text-meatzy-olive font-display uppercase tracking-wide">{review.name}</p>
                  {review.role && <p className="text-xs text-meatzy-rosemary">{review.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};