
import { MenuItem, LocationData } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Burger Tradicional',
    description: 'Carne 100% de res seleccionada, queso cheddar fundido, lechuga fresca, tomate y nuestra salsa secreta.',
    price: 24000,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=800&q=80',
    popular: true
  },
  {
    id: '2',
    name: 'Bacon Cheese',
    description: 'Doble carne jugosa, tiras de tocino ahumado crujiente, doble queso cheddar y cebolla caramelizada.',
    price: 29000,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
    popular: true
  },
  {
    id: '3',
    name: 'Mushroom Swiss',
    description: 'Carne premium cubierta con champiñones salteados al ajillo y queso suizo derretido.',
    price: 27000,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    name: 'Combo Pareja',
    description: '2 Burger Tradicionales, 2 porciones de papas medianas y 2 bebidas a elección.',
    price: 55000,
    category: 'combo',
    image: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?auto=format&fit=crop&w=800&q=80',
    popular: true
  },
  {
    id: '5',
    name: 'Papas Fritas',
    description: 'Corte tradicional, crocantes por fuera y suaves por dentro, sazonadas con sal de mar.',
    price: 8000,
    category: 'side',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    name: 'Aros de Cebolla',
    description: 'Aros de cebolla dorados y crujientes, servidos con nuestra salsa ranch casera.',
    price: 12000,
    category: 'side',
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '7',
    name: 'Malteada de Vainilla',
    description: 'Cremosa malteada hecha con helado artesanal de vainilla y crema batida.',
    price: 14000,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '8',
    name: 'Limonada Natural',
    description: 'Clásica y refrescante, hecha con limones recién exprimidos, hielo frappé y un toque de hierbabuena.',
    price: 8000,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '9',
    name: 'Limonada de Coco',
    description: 'Exótica y cremosa, preparada con leche de coco artesanal y limón fresco. ¡La favorita!',
    price: 12000,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    popular: true
  },
  {
    id: '10',
    name: 'Limonada Cerezada',
    description: 'Dulce y cítrica fusión de limonada frappé con cerezas marrasquino.',
    price: 10000,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80'
  }
];

export const LOCATION_INFO: LocationData = {
  address: "Av. Principal, Casa María Burguer",
  phone: "321 313 1109",
  whatsapp: "573213131109",
  hours: [
    "Lun - Jue: 12:00 PM - 10:00 PM",
    "Vie - Sáb: 12:00 PM - 11:30 PM",
    "Dom: 12:00 PM - 9:00 PM"
  ],
  mapLink: "https://maps.app.goo.gl/1Cm5o6S4ZuC5LVRm7"
};

export const SITE_NAME = "Casa María Burguer";
export const CURRENCY = "$ ";
