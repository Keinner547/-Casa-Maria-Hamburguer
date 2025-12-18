
import React, { useState } from 'react';
import { Star, MessageSquare, Send, User } from 'lucide-react';
import { useReviews } from '../context/ReviewContext';

const Reviews: React.FC = () => {
  const { reviews, addReview, averageRating, totalReviews } = useReviews();
  
  // Form State
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    setIsSubmitting(true);
    
    // Simulate network delay for effect
    setTimeout(() => {
      addReview({ author, text, rating });
      setAuthor('');
      setText('');
      setRating(5);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="bg-slate-950 py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Stats */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-wide text-orange-500 uppercase mb-2">Opiniones</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Lo que dicen nuestros clientes</h3>
          
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-5xl font-black text-white">{averageRating}</span>
              <div className="flex flex-col items-start ml-2">
                <div className="flex text-orange-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={20} 
                      fill={star <= Math.round(averageRating) ? "currentColor" : "none"} 
                      className={star <= Math.round(averageRating) ? "text-orange-500" : "text-slate-700"}
                    />
                  ))}
                </div>
                <span className="text-slate-400 text-sm">{totalReviews} reseñas verificadas</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Form Section */}
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl h-fit sticky top-24">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="text-orange-500" size={20} />
              Deja tu reseña
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Tu Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-500" size={18} />
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ej. María Pérez"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-orange-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Calificación</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={32}
                        fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                        className={(hoverRating || rating) >= star ? "text-orange-500" : "text-slate-700"}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">Toca las estrellas para calificar</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Tu Opinión</label>
                <textarea
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  placeholder="¡Cuéntanos tu experiencia! 🍔🍟 Puedes usar emojis 😉"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-600 outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Publicando...' : (
                  <>
                    Publicar Reseña <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Reviews List Section */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="font-bold text-white">{review.author}</h5>
                      <span className="text-xs text-slate-500">{review.date}</span>
                    </div>
                  </div>
                  <div className="flex bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={star <= review.rating ? "currentColor" : "none"}
                        className={star <= review.rating ? "text-orange-500" : "text-slate-700"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
            
            {reviews.length === 0 && (
               <div className="text-center py-10 text-slate-500">
                 <p>Aún no hay reseñas. ¡Sé el primero en opinar!</p>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Reviews;
