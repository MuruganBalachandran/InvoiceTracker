# Invoice Tracker

A full-stack web application for managing invoices, clients, and expenses with real-time analytics and beautiful UI.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI/UX**: Beautiful, responsive design with dark/light theme support
- **Real-time Analytics**: Interactive charts and statistics
- **Invoice Management**: Create, edit, and manage invoices with PDF generation
- **Client Management**: Organize and track client information
- **Expense Tracking**: Categorize and monitor expenses
- **Dashboard**: Comprehensive overview with key metrics
- **Authentication**: Secure login/signup with JWT

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Complete CRUD operations for all entities
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Integration**: Scalable NoSQL database
- **Input Validation**: Comprehensive validation and error handling
- **Security**: Password hashing, CORS, Helmet security headers
- **Statistics**: Advanced analytics and reporting endpoints

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Lucide React** for icons
- **React PDF** for invoice generation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Morgan** for logging

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `config.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/invoice-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the client directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/updateprofile` - Update user profile
- `PUT /api/auth/changepassword` - Change password

### Invoices
- `GET /api/invoices` - Get all invoices (with pagination and filters)
- `GET /api/invoices/:id` - Get single invoice
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `PATCH /api/invoices/:id/status` - Update invoice status
- `GET /api/invoices/stats` - Get invoice statistics

### Clients
- `GET /api/clients` - Get all clients (with pagination and search)
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/stats` - Get client statistics

### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats` - Get expense statistics
- `GET /api/expenses/categories` - Get expense categories

## 📁 Project Structure

```
InvoiceTracker/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and slices
│   │   ├── services/      # API service
│   │   ├── styles/        # Global styles
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Backend Node.js application
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Express middlewares
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── package.json
│   └── server.js
└── README.md
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Registration**: Users can create accounts with email and password
2. **Login**: Users authenticate with email/password and receive a JWT token
3. **Protected Routes**: All API endpoints (except auth) require a valid JWT token
4. **Token Storage**: Tokens are stored in localStorage and automatically included in API requests

### Example API Usage

```javascript
// Register a new user
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});

// Login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

// Use token for protected requests
const token = loginResponse.data.token;
const invoices = await fetch('http://localhost:5000/api/invoices', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes
- **Interactive Charts**: Real-time data visualization
- **Modern Components**: Beautiful, accessible UI components
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 📊 Dashboard Features

- **Financial Overview**: Total income, expenses, and net income
- **Invoice Statistics**: Status breakdown and trends
- **Expense Analytics**: Category-wise expense tracking
- **Recent Activity**: Latest invoices and expenses
- **Quick Actions**: Fast access to common tasks

## 🔧 Development

### Running in Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Building for Production

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd server
   npm start
   ```

## 🚀 Deployment

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or DigitalOcean
- Set environment variables for production
- Use MongoDB Atlas for cloud database

### Frontend Deployment
- Build the application: `npm run build`
- Deploy to platforms like Vercel, Netlify, or GitHub Pages
- Update the API URL in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Review the API endpoints
3. Check the console for error messages
4. Ensure MongoDB is running and accessible
5. Verify environment variables are set correctly

## 🎯 Roadmap

- [ ] Email notifications for overdue invoices
- [ ] Multi-currency support
- [ ] Advanced reporting and exports
- [ ] Mobile app development
- [ ] Team collaboration features
- [ ] Integration with payment gateways
- [ ] Automated invoice reminders
- [ ] Advanced analytics and insights 