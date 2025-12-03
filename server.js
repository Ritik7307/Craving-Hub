const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Database setup
const db = new sqlite3.Database('./orders.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    // Create orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Orders table ready');
      }
    });
  }
});

// Email transporter configuration
// 
// EMAIL SETUP INSTRUCTIONS:
// 1. Go to https://myaccount.google.com/security
// 2. Enable 2-Step Verification
// 3. Go to "App passwords" and generate one for "Mail"
// 4. Replace 'YOUR_EMAIL@gmail.com' and 'YOUR_APP_PASSWORD' below
//
// EMAIL FLOW:
// - FROM: Restaurant's email (configured below)
// - TO: 24mc3040@rgipt.ac.in (fixed - all orders sent here)
// - Customer email: Varies per order (included in email body and replyTo)
//
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'YOUR_EMAIL@gmail.com', // ⬅️ REPLACE: Restaurant's Gmail address
    pass: process.env.EMAIL_PASS || 'YOUR_APP_PASSWORD' // ⬅️ REPLACE: 16-character Gmail App Password
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
    console.log('Please configure EMAIL_USER and EMAIL_PASS environment variables');
  } else {
    console.log('Email server is ready');
  }
});

// API Routes
app.post('/api/orders', async (req, res) => {
  try {
    const { name, email, phone, address, items, total } = req.body;

    if (!name || !email || !phone || !address || !items || !total) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert order into database
    const itemsJson = JSON.stringify(items);
    db.run(
      `INSERT INTO orders (name, email, phone, address, items, total) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone, address, itemsJson, total],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to save order' });
        }

        const orderId = this.lastID;

        // Send confirmation email to restaurant
        // Email is sent to: 24mc3040@rgipt.ac.in
        // Customer email varies and is included in the email body
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <h2 style="color: #ff4d4d; border-bottom: 2px solid #ff4d4d; padding-bottom: 10px;">New Order Received - Craving Hub</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <h3 style="color: #1f2933; margin-top: 0;">Order #${orderId}</h3>
              
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <h4 style="color: #374151; margin-top: 0;">Customer Information:</h4>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
                <p style="margin: 5px 0;"><strong>Delivery Address:</strong> ${address}</p>
              </div>

              <div style="margin: 20px 0;">
                <h4 style="color: #374151;">Order Items:</h4>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                  <thead>
                    <tr style="background-color: #e5e7eb;">
                      <th style="padding: 10px; text-align: left; border: 1px solid #d1d5db;">Item</th>
                      <th style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">Qty</th>
                      <th style="padding: 10px; text-align: right; border: 1px solid #d1d5db;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${items.map(item => `
                      <tr>
                        <td style="padding: 10px; border: 1px solid #d1d5db;">${item.name}</td>
                        <td style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">${item.quantity}</td>
                        <td style="padding: 10px; text-align: right; border: 1px solid #d1d5db;">₹${item.price * item.quantity}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                  <tfoot>
                    <tr style="background-color: #fef3c7; font-weight: bold;">
                      <td colspan="2" style="padding: 10px; border: 1px solid #d1d5db; text-align: right;">Total Amount:</td>
                      <td style="padding: 10px; text-align: right; border: 1px solid #d1d5db; color: #f97316; font-size: 1.1em;">₹${total}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 0.9em; margin: 5px 0;">
                  <strong>Order Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
                <p style="color: #6b7280; font-size: 0.9em; margin: 5px 0;">
                  <strong>Customer Email:</strong> <a href="mailto:${email}" style="color: #3b82f6;">${email}</a>
                </p>
              </div>
            </div>

            <p style="color: #6b7280; font-size: 0.85em; text-align: center; margin-top: 20px;">
              This is an automated order notification from Craving Hub
            </p>
          </div>
        `;

        const mailOptions = {
          from: process.env.EMAIL_USER || 'YOUR_EMAIL@gmail.com', // Restaurant's email (sender)
          to: '24mc3040@rgipt.ac.in', // Fixed recipient - all orders sent here
          subject: `New Order #${orderId} from ${name} (${email})`,
          html: emailHtml,
          replyTo: email // Customer's email for easy reply
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Email error:', error);
            // Order is saved, but email failed - still return success
            return res.json({
              success: true,
              orderId: orderId,
              message: 'Order placed successfully, but email notification failed'
            });
          }
          console.log('Email sent:', info.response);
          res.json({
            success: true,
            orderId: orderId,
            message: 'Order placed successfully and confirmation email sent'
          });
        });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all orders (for admin purposes)
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
    res.json(rows);
  });
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM orders WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch order' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(row);
  });
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure to configure EMAIL_USER and EMAIL_PASS environment variables for email functionality');
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});

