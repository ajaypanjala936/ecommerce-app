

// require('dotenv').config();
// const mongoose = require('mongoose');
// const Product = require('../models/Product'); // Adjusted path to models/Product.js

// const sampleProducts = [
//   {
//     name: "Wireless Earbuds Pro",
//     price: 129.99,
//     description: "Active noise cancellation, 30hr battery",
//     category: "Electronics",
//     stock: 150,
//     rating: 4.8,
//     imageUrl: "/uploads/earbuds1.webp" 
//   },
//   {
//     name: "Smart Watch X9",
//     price: 249.99,
//     description: "Health monitoring, waterproof, OLED display",
//     category: "Electronics",
//     stock: 85,
//     rating: 4.6,
//     imageUrl: "/uploads/Smart Watch X9.jpg" 
//   },
//   {
//     name: "4K Ultra HD TV",
//     price: 899.99,
//     description: "55-inch Smart TV with HDR",
//     category: "Electronics",
//     stock: 30,
//     rating: 4 ,
//     imageUrl: "/uploads/4k tv.avif" 
//   },
//   {
//     name: "Gaming Laptop",
//     price: 1499.99,
//     description: "RTX 3070, 16GB RAM, 1TB SSD",
//     category: "Electronics",
//     stock: 25,
//     rating: 4.9,
//     imageUrl: "/uploads/gaming_laptop.avif" 
//   },
//   {
//     name: "Wireless Keyboard",
//     price: 59.99,
//     description: "Mechanical keys, RGB lighting",
//     category: "Electronics",
//     stock: 120,
//     rating: 4.5,
//     imageUrl: "/uploads/keyboard.jpg" 
//   },
//   {
//     name: "Bluetooth Speaker",
//     price: 79.99,
//     description: "Portable, 20hr playtime",
//     category: "Electronics",
//     stock: 200,
//     rating: 4.3,
//     imageUrl: "/uploads/blth_speaker.webp" 
//   },
//   {
//     name: "Fitness Tracker",
//     price: 49.99,
//     description: "Heart rate monitor, sleep tracking",
//     category: "Electronics",
//     stock: 180,
//     rating: 4.2,
//     imageUrl: "/uploads/fitness_tracker.jpg" 
//   },
//   {
//     name: "DSLR Camera",
//     price: 799.99,
//     description: "24.2MP, 4K video",
//     category: "Electronics",
//     stock: 40,
//     rating: 4.8,
//     imageUrl: "/uploads/DSLR_camera.webp" 
//   },
//   {
//     name: "Air Fryer",
//     price: 89.99,
//     description: "5.8QT capacity, digital controls",
//     category: "Home",
//     stock: 75,
//     rating: 4.4,
//     imageUrl: "/uploads/air_fryer.png" 
//   },
//   {
//     name: "Robot Vacuum",
//     price: 299.99,
//     description: "Smart mapping, self-charging",
//     category: "Home",
//     stock: 50,
//     rating: 4.1,
//     imageUrl: "/uploads/best_robotic_vacuum_cleaner.avif" 
//   },
//   {
//     name: "Memory Foam Pillow",
//     price: 39.99,
//     description: "Orthopedic support",
//     category: "Home",
//     stock: 300,
//     rating: 4.3,
//     imageUrl: "/uploads/SoftTouch-Memory-Foam-Pillow.jpg" 
//   },
//   {
//     name: "Electric Toothbrush",
//     price: 59.99,
//     description: "3 modes, wireless charging",
//     category: "Health",
//     stock: 250,
//     rating: 4.6,
//     imageUrl: "/uploads/electictoothbrush.jpg" 
//   },
//   {
//     name: "Yoga Mat",
//     price: 29.99,
//     description: "Non-slip, 6mm thickness",
//     category: "Fitness",
//     stock: 175,
//     rating: 4.0,
//     imageUrl: "/uploads/yoga-mat-right.webp" 
//   },
//   {
//     name: "Resistance Bands",
//     price: 24.99,
//     description: "5-piece set with handles",
//     category: "Fitness",
//     stock: 200,
//     rating: 4.2,
//     imageUrl: "/uploads/bands.jpg" 
//   },
//   {
//     name: "Dumbbell Set",
//     price: 129.99,
//     description: "Adjustable 5-25kg",
//     category: "Fitness",
//     stock: 60,
//     rating: 4.7,
//     imageUrl: "/uploads/dumbbells.jpg" 
//   },
//   {
//     name: "Running Shoes",
//     price: 89.99,
//     description: "Lightweight, breathable",
//     category: "Sports",
//     stock: 90,
//     rating: 4.5,
//     imageUrl: "/uploads/runningshoes.jpg" 
//   },
//   {
//     name: "Bag",
//     price: 49.99,
//     description: "Waterproof, USB charging port",
//     category: "Home",
//     stock: 150,
//     rating: 4.3,
//     imageUrl: "/uploads/bag.webp" 
//   },
//   {
//     name: "Wireless Charger",
//     price: 19.99,
//     description: "15W fast charging",
//     category: "Electronics",
//     stock: 300,
//     rating: 4.0,
//     imageUrl: "/uploads/wireless charger.jpg" 
//   },
//   {
//     name: "Portable SSD",
//     price: 129.99,
//     description: "1TB, USB 3.2",
//     category: "Electronics",
//     stock: 80,
//     rating: 4.8,
//     imageUrl: "/uploads/ssd.webp" 
//   },
//   {
//     name: "Coffee Maker",
//     price: 59.99,
//     description: "12-cup programmable",
//     category: "Home",
//     stock: 100,
//     rating: 4.4,
//     imageUrl: "/uploads/coffee-maker.jpg" 
//   },
//   {
//     name: "Desk Lamp",
//     price: 34.99,
//     description: "Adjustable brightness",
//     category: "Home",
//     stock: 120,
//     rating: 4.1,
//     imageUrl: "/uploads/desklamp.webp" 
//   },
//   {
//     name: "Water Bottle",
//     price: 14.99,
//     description: "Insulated, 32oz",
//     category: "Accessories",
//     stock: 400,
//     rating: 4.2,
//     imageUrl: "/uploads/waterbottel.jpg" 
//   },
//   {
//     name: "Smart Bulb",
//     price: 24.99,
//     description: "RGB, voice control compatible",
//     category: "Home",
//     stock: 250,
//     rating: 4.3,
//     imageUrl: "/uploads/bulb.jpg" 
//   },
//   {
//     name: "Graphic T-Shirt",
//     price: 19.99,
//     description: "100% cotton, various designs",
//     category: "Clothing",
//     stock: 500,
//     rating: 4.0,
//     imageUrl: "/uploads/graphic t-shirt.avif" 
//   },
//   {
//     name: "Jeans",
//     price: 39.99,
//     description: "Slim fit, stretch fabric",
//     category: "Fashion",
//     stock: 300,
//     rating: 4.2,
//     imageUrl: "/uploads/jeans.jpg" 
//   },
//   {
//     name: "Sunglasses",
//     price: 29.99,
//     description: "UV protection, polarized",
//     category: "Accessories",
//     stock: 200,
//     rating: 4.1,
//     imageUrl: "/uploads/sunglasses.jpg" 
//   },
//   {
//     name: "Smart Plug",
//     price: 17.99,
//     description: "WiFi enabled, energy monitoring",
//     category: "Electronics",
//     stock: 350,
//     rating: 4.0,
//     imageUrl: "/uploads/smart_plug.webp" 
//   },
//   {
//     name: "External Battery",
//     price: 39.99,
//     description: "20000mAh, dual USB",
//     category: "Electronics",
//     stock: 180,
//     rating: 4.3,
//     imageUrl: "/uploads/power bank.jpg" 
//   },
//   {
//     name: "Keyboard Wrist Rest",
//     price: 12.99,
//     description: "Memory foam, ergonomic",
//     category: "Accessories",
//     stock: 400,
//     rating: 4.1,
//     imageUrl: "/uploads/keyboard.jpg" 
//   },
//   {
//     name: "Wireless Mouse",
//     price: 29.99,
//     description: "Ergonomic, silent click",
//     category: "Electronics",
//     stock: 250,
//     rating: 4.4,
//     imageUrl: "/uploads/mouse.jpeg" 
//   }
// ];
// (async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('✅ MongoDB connected successfully');
//     await Product.deleteMany();
//     const inserted = await Product.insertMany(sampleProducts);
//     console.log(
//       '🌱 Seeded Products:',
//       inserted.map((p) => ({ name: p.name, stock: p.stock }))
//     );
//     mongoose.connection.close();
//   } catch (err) {
//     console.error('❌ Seeding error:', err.message, err.stack);
//     process.exit(1);
//   }
// })();








require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product'); // Adjusted path to models/Product.js

const sampleProducts = [
  {
    name: "Wireless Earbuds Pro",
    price: 5799, // $129.99 × 83 ≈ ₹10,799
    description: "Active noise cancellation, 30hr battery",
    category: "Electronics",
    stock: 10,
    rating: 4.8,
    imageUrl: "/Uploads/earbuds1.webp"
  },
  {
    name: "Smart Watch X9",
    price: 10749, // $249.99 × 83 ≈ ₹20,749
    description: "Health monitoring, waterproof, OLED display",
    category: "Electronics",
    stock: 25,
    rating: 4.6,
    imageUrl: "/Uploads/Smart Watch X9.jpg"
  },
  {
    name: "4K Ultra HD TV",
    price: 74699, // $899.99 × 83 ≈ ₹74,699
    description: "55-inch Smart TV with HDR",
    category: "Electronics",
    stock: 30,
    rating: 4,
    imageUrl: "/Uploads/4k tv.avif"
  },
  {
    name: "Gaming Laptop",
    price: 124499, // $1499.99 × 83 ≈ ₹124,499
    description: "RTX 3070, 16GB RAM, 1TB SSD",
    category: "Electronics",
    stock: 25,
    rating: 4.9,
    imageUrl: "/Uploads/gaming_laptop.avif"
  },
  {
    name: "Wireless Keyboard",
    price: 2979, // $59.99 × 83 ≈ ₹4,979
    description: "Mechanical keys, RGB lighting",
    category: "Electronics",
    stock: 20,
    rating: 4.5,
    imageUrl: "/Uploads/keyboard.jpg"
  },
  {
    name: "Bluetooth Speaker",
    price: 6639, // $79.99 × 83 ≈ ₹6,639
    description: "Portable, 20hr playtime",
    category: "Electronics",
    stock: 20,
    rating: 4.3,
    imageUrl: "/Uploads/blth_speaker.webp"
  },
  {
    name: "Fitness Tracker",
    price: 4149, // $49.99 × 83 ≈ ₹4,149
    description: "Heart rate monitor, sleep tracking",
    category: "Electronics",
    stock: 80,
    rating: 4.2,
    imageUrl: "/Uploads/fitness_tracker.jpg"
  },
  {
    name: "DSLR Camera",
    price: 66399, // $799.99 × 83 ≈ ₹66,399
    description: "24.2MP, 4K video",
    category: "Electronics",
    stock: 40,
    rating: 4.8,
    imageUrl: "/Uploads/DSLR_camera.webp"
  },
  {
    name: "Air Fryer",
    price: 7469, // $89.99 × 83 ≈ ₹7,469
    description: "5.8QT capacity, digital controls",
    category: "Home",
    stock: 15,
    rating: 4.4,
    imageUrl: "/Uploads/air_fryer.png"
  },
  {
    name: "Robot Vacuum",
    price: 24899, // $299.99 × 83 ≈ ₹24,899
    description: "Smart mapping, self-charging",
    category: "Home",
    stock: 10,
    rating: 4.1,
    imageUrl: "/Uploads/best_robotic_vacuum_cleaner.avif"
  },
  {
    name: "Memory Foam Pillow",
    price: 319, // $39.99 × 83 ≈ ₹3,319
    description: "Orthopedic support",
    category: "Home",
    stock: 30,
    rating: 4.3,
    imageUrl: "/Uploads/SoftTouch-Memory-Foam-Pillow.jpg"
  },
  {
    name: "Electric Toothbrush",
    price: 4979, // $59.99 × 83 ≈ ₹4,979
    description: "3 modes, wireless charging",
    category: "Health",
    stock: 40,
    rating: 4.6,
    imageUrl: "/Uploads/electictoothbrush.jpg"
  },
  {
    name: "Yoga Mat",
    price: 1089, // $29.99 × 83 ≈ ₹2,489
    description: "Non-slip, 6mm thickness",
    category: "Fitness",
    stock: 75,
    rating: 4.0,
    imageUrl: "/Uploads/yoga-mat-right.webp"
  },
  {
    name: "Resistance Bands",
    price: 1074, // $24.99 × 83 ≈ ₹2,074
    description: "5-piece set with handles",
    category: "Fitness",
    stock: 20,
    rating: 4.2,
    imageUrl: "/Uploads/bands.jpg"
  },
  {
    name: "Dumbbell Set",
    price: 10799, // $129.99 × 83 ≈ ₹10,799
    description: "Adjustable 5-25kg",
    category: "Fitness",
    stock: 60,
    rating: 4.7,
    imageUrl: "/Uploads/dumbbells.jpg"
  },
  {
    name: "Running Shoes",
    price: 7469, // $89.99 × 83 ≈ ₹7,469
    description: "Lightweight, breathable",
    category: "Sports",
    stock: 90,
    rating: 4.5,
    imageUrl: "/Uploads/runningshoes.jpg"
  },
  {
    name: "Bag",
    price: 1149, // $49.99 × 83 ≈ ₹4,149
    description: "Waterproof, USB charging port",
    category: "Home",
    stock: 150,
    rating: 4.3,
    imageUrl: "/Uploads/bag.webp"
  },
  {
    name: "Wireless Charger",
    price: 1659, // $19.99 × 83 ≈ ₹1,659
    description: "15W fast charging",
    category: "Electronics",
    stock: 300,
    rating: 4.0,
    imageUrl: "/Uploads/wireless charger.jpg"
  },
  {
    name: "Portable SSD",
    price: 5799, // $129.99 × 83 ≈ ₹10,799
    description: "1TB, USB 3.2",
    category: "Electronics",
    stock: 80,
    rating: 4.8,
    imageUrl: "/Uploads/ssd.webp"
  },
  {
    name: "Coffee Maker",
    price: 4979, // $59.99 × 83 ≈ ₹4,979
    description: "12-cup programmable",
    category: "Home",
    stock: 100,
    rating: 4.4,
    imageUrl: "/Uploads/coffee-maker.jpg"
  },
  {
    name: "Desk Lamp",
    price: 1904, // $34.99 × 83 ≈ ₹2,904
    description: "Adjustable brightness",
    category: "Home",
    stock: 120,
    rating: 4.1,
    imageUrl: "/Uploads/desklamp.webp"
  },
  {
    name: "Water Bottle",
    price: 244, // $14.99 × 83 ≈ ₹1,244
    description: "Insulated, 32oz",
    category: "Accessories",
    stock: 400,
    rating: 4.2,
    imageUrl: "/Uploads/waterbottel.jpg"
  },
  {
    name: "Smart Bulb",
    price: 599, // $24.99 × 83 ≈ ₹2,074
    description: "RGB, voice control compatible",
    category: "Home",
    stock: 250,
    rating: 4.3,
    imageUrl: "/Uploads/bulb.jpg"
  },
  {
    name: "Graphic T-Shirt",
    price: 659, // $19.99 × 83 ≈ ₹1,659
    description: "100% cotton, various designs",
    category: "Clothing",
    stock: 500,
    rating: 4.0,
    imageUrl: "/Uploads/graphic t-shirt.avif"
  },
  {
    name: "Jeans",
    price: 1319, // $39.99 × 83 ≈ ₹3,319
    description: "Slim fit, stretch fabric",
    category: "Fashion",
    stock: 300,
    rating: 4.2,
    imageUrl: "/Uploads/jeans.jpg"
  },
  {
    name: "Sunglasses",
    price: 1489, // $29.99 × 83 ≈ ₹2,489
    description: "UV protection, polarized",
    category: "Accessories",
    stock: 200,
    rating: 4.1,
    imageUrl: "/Uploads/sunglasses.jpg"
  },
  {
    name: "Smart Plug",
    price: 193, // $17.99 × 83 ≈ ₹1,493
    description: "WiFi enabled, energy monitoring",
    category: "Electronics",
    stock: 350,
    rating: 4.0,
    imageUrl: "/Uploads/smart_plug.webp"
  },
  {
    name: "External Battery",
    price: 1319, // $39.99 × 83 ≈ ₹3,319
    description: "20000mAh, dual USB",
    category: "Electronics",
    stock: 180,
    rating: 4.3,
    imageUrl: "/Uploads/power bank.jpg"
  },
  {
    name: "Keyboard Wrist Rest",
    price: 1078, // $12.99 × 83 ≈ ₹1,078
    description: "Memory foam, ergonomic",
    category: "Accessories",
    stock: 400,
    rating: 4.1,
    imageUrl: "/Uploads/keyboard.jpg"
  },
  {
    name: "Wireless Mouse",
    price: 1489, // $29.99 × 83 ≈ ₹2,489
    description: "Ergonomic, silent click",
    category: "Electronics",
    stock: 250,
    rating: 4.4,
    imageUrl: "/Uploads/mouse.jpeg"
  }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    await Product.deleteMany();
    const inserted = await Product.insertMany(sampleProducts);
    console.log(
      '🌱 Seeded Products:',
      inserted.map((p) => ({ name: p.name, stock: p.stock }))
    );
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Seeding error:', err.message, err.stack);
    process.exit(1);
  }
})();