
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Review } from '../types';

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  averageRating: number;
  totalReviews: number;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Carlos Rodriguez',
    rating: 5,
    text: '¡La mejor hamburguesa que he probado! 🍔 La carne estaba jugosa y el pan súper suave.',
    date: 'Hace 2 días'
  },
  {
    id: '2',
    author: 'Ana María',
    rating: 5,
    text: 'Me encantó el ambiente y la atención. Súper recomendado el combo pareja. ⭐⭐⭐⭐⭐',
    date: 'Hace 1 semana'
  },
  {
    id: '3',
    author: 'Juan Pablo',
    rating: 4,
    text: 'Muy ricas, aunque un poco demorado el domicilio, pero valió la pena la espera.',
    date: 'Hace 2 semanas'
  }
];

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  useEffect(() => {
    const storedReviews = localStorage.getItem('cmb_reviews');
    if (storedReviews) {
      try {
        setReviews(JSON.parse(storedReviews));
      } catch (e) {
        console.error("Error cargando reseñas", e);
      }
    }
  }, []);

  const addReview = (newReviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...newReviewData,
      id: Date.now().toString(),
      date: 'Reciente'
    };
    
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('cmb_reviews', JSON.stringify(updatedReviews));
  };

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? parseFloat((reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1))
    : 5.0;

  return (
    <ReviewContext.Provider value={{ reviews, addReview, averageRating, totalReviews }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) throw new Error('useReviews must be used within a ReviewProvider');
  return context;
};
