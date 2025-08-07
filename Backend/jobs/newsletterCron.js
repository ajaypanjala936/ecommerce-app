const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Newsletter = require('../models/Newsletter');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

// HTML template for the offer email
const getOfferTemplate = (email, unsubscribeUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; color: #212529; background: #f8f9fa; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; border-radius: 12px; }
    .header { text-align: center; padding: 20px 0; }
    .header h1 { color: #343a40; font-size: 24px; }
    .content { padding: 20px; }
    .content p { font-size: 16px; line-height: 1.6; color: #495057; }
    .cta { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #007bff, #0056b3); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .cta:hover { background: linear-gradient(135deg, #0056b3, #003d82); }
    .unsubscribe { text-align: center; padding: 20px 0; font-size: 14px; color: #6c757d; }
    .unsubscribe a { color: #007bff; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Special Offer from Express.com!</h1>
    </div>
    <div class="content">
      <p>Hello ${email},</p>
      <p>Enjoy <strong>10% off</strong> your next purchase! Use code <strong>SAVE10</strong> at checkout.</p>
      <p>Hurry, this offer expires in 24 hours!</p>
      <a href="http://localhost:3000/products" class="cta">Shop Now</a>
    </div>
    <div class="unsubscribe">
      <p>Don't want these offers? <a href="${unsubscribeUrl}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`;

// Cron job to send offers every 5 minutes
const startNewsletterOfferCron = () => {
  cron.schedule('*/60 * * * *', async () => {
    try {
      console.log('Starting newsletter offer cron job...');

      // Fetch all subscribers
      const subscribers = await Newsletter.find({});
      if (subscribers.length === 0) {
        console.log('No subscribers found.');
        return;
      }

      console.log(`Sending offers to ${subscribers.length} subscribers...`);

      // Send emails to all subscribers
      const sendPromises = subscribers.map((subscriber) => {
        const unsubscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
        const html = getOfferTemplate(subscriber.email, unsubscribeUrl);

        // Comment out for testing, uncomment for production
        return transporter.sendMail({
          from: `"Express.com" <${process.env.EMAIL_USER}>`,
          to: subscriber.email,
          subject: 'Exclusive 10% Off Offer from Express.com!',
          html,
        }).then(() => {
          console.log(`Offer email sent to ${subscriber.email}`);
        }).catch((err) => {
          console.error(`Failed to send offer to ${subscriber.email}:`, err);
        });

        // For testing, log instead of sending
        /*
        console.log(`Preparing offer email for ${subscriber.email}`);
        return Promise.resolve();
        */
      });

      await Promise.all(sendPromises);
      console.log(`Completed sending offers to ${subscribers.length} subscribers.`);
    } catch (err) {
      console.error('Error in newsletter offer cron job:', err);
    }
  });

  console.log('Newsletter offer cron job scheduled (every 5 minutes).');
};

module.exports = { startNewsletterOfferCron };