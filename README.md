# Craving Hub - Restaurant Booking Website

An online restaurant booking website with a menu carousel, shopping cart system, and order management with email notifications.

## Features

- 🍔 **Menu Carousel**: Scrollable menu items with images and prices
- 🛒 **Shopping Cart**: Add, remove, and update quantities
- 💰 **Dynamic Pricing**: Real-time total calculation
- 📧 **Email Notifications**: Automatic order confirmation emails
- 💾 **Database**: SQLite database for order storage
- 📱 **Responsive Design**: Works on all devices

## Quick Start

**IMPORTANT: The server must be running for orders to work!**

1. Install dependencies: `npm install`
2. Start the server: `npm start` (or double-click `start-server.bat` on Windows)
3. Open `http://localhost:3000` in your browser

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

**You MUST start the server before placing orders!**

```bash
npm start
```

Or on Windows, you can double-click `start-server.bat`

The server will run on `http://localhost:3000`

### 3. Configure Google Maps API (Optional but Recommended)

To show your restaurant location on the map:

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Maps JavaScript API" for your project
3. Open `index.html` and replace `YOUR_API_KEY` with your actual API key
4. Open `script.js` and update the `restaurantLocation` coordinates with your restaurant's location

See `GOOGLE_MAPS_SETUP.md` for detailed instructions.

### 4. Configure Email (Required for order notifications)

The system sends order confirmation emails to `24mc3040@rgipt.ac.in`. You need to configure email credentials:

**Option A: Using Environment Variables (Recommended)**

Create a `.env` file in the root directory:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Option B: Edit server.js directly**

Update the email configuration in `server.js`:

```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});
```

**For Gmail:**
1. Enable 2-Step Verification
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated app password (not your regular password)

### 5. Open the Website

Once the server is running, open your browser and go to:
- `http://localhost:3000`

**Note:** If you see "Error connecting to server" when placing an order, make sure the server is running!

## Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # Frontend JavaScript (cart, carousel)
├── server.js           # Backend server (Express, database, email)
├── package.json        # Node.js dependencies
├── orders.db           # SQLite database (created automatically)
└── README.md           # This file
```

## API Endpoints

### POST /api/orders
Create a new order

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "items": [
    {
      "id": 1,
      "name": "Double Cheese Blast Burger",
      "price": 249,
      "quantity": 2
    }
  ],
  "total": 498
}
```

### GET /api/orders
Get all orders (for admin)

### GET /api/orders/:id
Get order by ID

## Contact Information

- **Phone**: 7307255940
- **Order Confirmation Email**: 24mc3040@rgipt.ac.in

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Email**: Nodemailer

## Notes

- The database file (`orders.db`) is created automatically on first run
- All orders are stored locally in SQLite
- Email notifications are sent to the configured recipient email
- The cart persists in browser localStorage

## Troubleshooting

**Email not sending?**
- Check your email credentials
- For Gmail, make sure you're using an App Password, not your regular password
- Check that 2-Step Verification is enabled

**Database errors?**
- Make sure the application has write permissions in the project directory
- Delete `orders.db` and restart the server to recreate it

**Port already in use?**
- Change the PORT in `server.js` or set `PORT` environment variable

