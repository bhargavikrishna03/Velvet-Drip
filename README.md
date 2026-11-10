# ☕ Velvet Drip – Cafe Website

**Velvet Drip** is a modern and responsive cafe website built using the MERN stack and Tailwind CSS. It provides customers with an attractive menu browsing experience, shopping cart, and online order placement through WhatsApp. It also includes an admin dashboard for managing menu items and orders.

## 🚀 Features

### 👨‍🍳 Customer Features
- Responsive and modern cafe website.
- Browse food and beverage items by category.
- View dish details, prices, and availability.
- Add items to the shopping cart.
- Increase, decrease, and remove cart items.
- Calculate the total order amount automatically.
- Place orders by submitting customer details.
- Send order details through WhatsApp.
- Track orders using a unique tracking link.

### 🔐 Admin Features
- Secure admin login using JWT authentication.
- Admin dashboard for managing cafe operations.
- Add, edit, and delete menu items.
- Manage dish availability.
- View customer orders.
- Monitor order details and status.

## 🛠️ Technologies Used

**Frontend**
- React.js
- Tailwind CSS
- JavaScript
- React Router DOM
- Context API

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MongoDB
- Mongoose

**Authentication & Integration**
- JSON Web Token (JWT)
- WhatsApp integration

## 📁 Project Structure

```text
Velvet-Drip/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

*Note: Adjust the folder names above if your actual project structure is different.*

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/Velvet-Drip.git
```

### 2. Navigate to the Project

```bash
cd Velvet-Drip
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

### 4. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/menu` | Retrieve menu items |
| POST | `/api/menu` | Add a menu item |
| POST | `/api/auth` | Admin authentication |
| POST | `/api/orders` | Place a customer order |
| GET | `/api/orders` | Retrieve orders (authenticated) |

*The endpoints listed are based on the current project implementation. Update this section if you add or change routes.*

## 🔒 Environment Variables

Keep sensitive credentials in `.env` files. Never upload database connection strings, JWT secrets, or passwords to GitHub.

## 🌐 Future Improvements

- QR code-based order tracking.
- Online payment integration.
- Enhanced admin order management.
- Improved authentication and authorization.
- Better customer order notifications.
- Cloud-based image storage.

## 👩‍💻 Developer

**Katikam Bhargavi**

Full Stack Developer | MERN Stack Developer

## 📌 Project Status

**Development and deployment in progress.**

---

⭐ If you like this project, consider giving the repository a star!