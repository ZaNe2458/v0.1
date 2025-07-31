// Car wash locations data
const carWashLocations = [
  {
    id: '1',
    name: 'Shine Car Wash',
    latitude: 47.9185,
    longitude: 106.917,
    phone: '7575 8580',
    email: 'info@ubrobotic.com',
    address: 'District Bayanzurkh, UB tower office, Ulaanbaatar',
    hours: '08:00 - 23:00',
    images: [
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: '2',
    name: 'Premium Auto Wash',
    latitude: 47.9225,
    longitude: 106.920,
    phone: '8888 9999',
    email: 'contact@premiumwash.mn',
    address: 'Khan-Uul District, Peace Avenue, Ulaanbaatar',
    hours: '07:00 - 22:00',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

// Car types data with SVG icons
const carTypes = [
  { 
    id: 'small', 
    name: 'Жижиг тэрэг',
    icon: '🚗'
  },
  { 
    id: 'medium', 
    name: 'Дунд оврын',
    icon: '🚙'
  },
  { 
    id: 'jeep', 
    name: 'Жийп',
    icon: '🚐'
  },
  { 
    id: 'bigJeep', 
    name: 'Том оврын жийп',
    icon: '🚛'
  },
  { 
    id: 'van', 
    name: 'Транзит',
    icon: '🚚'
  },
  { 
    id: 'moto', 
    name: 'Мотоцикл',
    icon: '🏍️'
  },
];

// Export data for use in other components
window.carWashLocations = carWashLocations;
window.carTypes = carTypes;
