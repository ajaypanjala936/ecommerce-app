




const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('User email transporter verification failed:', error);
  } else {
    console.log('User email transporter is ready');
  }
});

// Normalize image URL for backend
const normalizeImageUrl = (imageUrl) => {
  const defaultPlaceholder = 'Uploads/placeholder.jpg';
  if (!imageUrl) return defaultPlaceholder;
  const normalized = imageUrl
    .replace(/^http:\/\/localhost:5000/, '')
    .replace(/^\/?[Uu]ploads\//, 'Uploads/');
  return normalized.startsWith('Uploads/') ? normalized : defaultPlaceholder;
};

// Email template for personalized recommendations
const getRecommendationTemplate = (name, email, products) => {
  const API_BASE = process.env.API_BASE || 'http://localhost:5000';
  const defaultPlaceholder = 'Uploads/placeholder.jpg';
  const defaultPlaceholderPath = path.join(__dirname, '..', 'public', defaultPlaceholder);

  // Log if default placeholder is missing
  if (!fs.existsSync(defaultPlaceholderPath)) {
    console.warn(`Default placeholder not found: ${defaultPlaceholderPath}`);
  }

  const productGrid = products.map((product, index) => {
    let imageUrl = normalizeImageUrl(product.imageUrl);
    let imagePath = path.join(__dirname, '..', 'public', imageUrl);

    let finalImageUrl = imageUrl;
    if (!fs.existsSync(imagePath)) {
      console.warn(`Image file not found for ${product.name}: ${imagePath}, using default placeholder`);
      imagePath = defaultPlaceholderPath;
      finalImageUrl = defaultPlaceholder;
    }

    const cid = `product-image-${index}@shopease`;
    const fallbackUrl = `${API_BASE}/${finalImageUrl.replace(/\\/g, '/')}`;

    console.log(`Processing image for ${product.name}:`, {
      imageUrl,
      imagePath,
      exists: fs.existsSync(imagePath),
      finalImageUrl,
      fallbackUrl,
      cid,
    });

    return {
      html: `
        <div style="text-align: center;">
          <img src="cid:${cid}" alt="${product.name}" width="150" height="150" style="border-radius: 8px; display: block; margin: 0 auto;" onerror="this.src='${fallbackUrl}'" />
          <p style="font-size: 14px; margin: 5px 0;">${product.name}</p>
          <p style="font-size: 14px; margin: 5px 0;">${product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
        </div>
      `,
      attachment: fs.existsSync(imagePath)
        ? {
            filename: path.basename(finalImageUrl),
            path: imagePath,
            cid: cid,
          }
        : null,
    };
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: #28a745; color: #fff; padding: 20px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px; }
    .header h1 { margin: 0; font-size: 22px; }
    .content { padding: 20px; }
    .content p { font-size: 16px; line-height: 1.5; margin: 10px 0; }
    .product-grid { display: table; width: 100%; margin: 20px 0; }
    .product-grid > div { display: table-cell; width: 50%; padding: 10px; vertical-align: top; }
    .cta { display: inline-block; padding: 10px 20px; background: #28a745; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
    .footer a { color: #28a745; text-decoration: none; }
    @media screen and (max-width: 400px) {
      .product-grid > div { display: block; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Handpicked for You, ${name}!</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>We’ve selected some exciting products just for you. Check them out below!</p>
      <div class="product-grid">
        ${productGrid.map((item) => item.html).join('')}
      </div>
      <p><a href="http://localhost:3000/products" class="cta">Explore More Products</a></p>
    </div>
    <div class="footer">
      <p>Want to stop receiving these emails? <a href="http://localhost:3000/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a></p>
      <p>© 2025 ShopEase. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    html: htmlContent,
    attachments: productGrid.map((item) => item.attachment).filter((attachment) => attachment !== null),
  };
};

// Send emails to verified users
const sendUserEmails = async () => {
  try {
    console.log('Starting user email cron job...');

    // Fetch verified users
    const users = await User.find({ isVerified: true }).select('name email');
    if (users.length === 0) {
      console.log('No verified users found.');
      return;
    }

    // Fetch random products for recommendations
    const products = await Product.aggregate([
      { $match: { stock: { $gt: 0 } } }, // Only in-stock products
      { $sample: { size: 2 } }, // Randomly select 2 products
    ]);

    if (products.length === 0) {
      console.log('No products available for recommendations.');
      return;
    }

    console.log(`Selected products:`, products.map((p) => ({ name: p.name, imageUrl: p.imageUrl })));
    console.log(`Sending recommendations to ${users.length} users with ${products.length} products...`);

    // Send emails to all verified users
    const sendPromises = users.map((user) => {
      const { html, attachments } = getRecommendationTemplate(user.name, user.email, products);

      return transporter.sendMail({
        from: `"ShopEase" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Personalized Picks for You, ${user.name}!`,
        html,
        attachments,
      })
        .then(() => {
          console.log(`Recommendation email sent to ${user.email} with ${attachments.length} attachments`);
        })
        .catch((err) => {
          console.error(`Failed to send recommendation to ${user.email}:`, err);
        });
    });

    await Promise.all(sendPromises);
    console.log(`Completed sending recommendations to ${users.length} users.`);
  } catch (err) {
    console.error('Error in user email cron job:', err);
  }
};

// Schedule job every 60 minutes
const startUserEmailCron = () => {
  schedule.scheduleJob('*/60 * * * *', sendUserEmails);
  console.log('User email cron job scheduled (every 60 minutes).');
};

module.exports = { startUserEmailCron };