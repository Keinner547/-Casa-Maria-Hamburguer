
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'burger' | 'side' | 'drink' | 'combo';
  image: string;
  popular?: boolean;
  discountPercent?: number; // Nuevo campo para descuentos
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface LocationData {
  address: string;
  phone: string;
  whatsapp: string;
  hours: string[];
  mapLink: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  text: string;
  date: string;
}
