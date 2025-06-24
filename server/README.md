# Invoice Tracker Backend

A complete REST API backend for the Invoice Tracker application built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- 🔐 JWT Authentication with bcrypt password hashing
- 👤 User registration and login
- 📄 Invoice management (CRUD operations)
- 👥 Client management
- 💰 Expense tracking
- 📊 Statistics and analytics
- ✅ Input validation and error handling
- 🔒 Route protection and authorization
- 🚀 RESTful API design

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Logging**: Morgan

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository and navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `config.env` file in the server root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/invoice-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

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

### Health Check
- `GET /api/health` - API health check

## Request/Response Format

### Authentication Example

**Register User:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected Routes

For protected routes, include the JWT token in the Authorization header:
```bash
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## Database Models

### User
- name, email, password, role, avatar, timestamps

### Client
- user (reference), name, email, phone, address, company, taxId, timestamps

### Invoice
- user (reference), client (reference), invoiceNumber, issueDate, dueDate, items[], subtotal, tax, total, status, notes, timestamps

### Expense
- user (reference), description, amount, category, date, paymentMethod, receipt, notes, timestamps

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Route protection middleware
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- Environment variable protection

## Development

### Project Structure
```
server/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── clientController.js
│   ├── expenseController.js
│   └── invoiceController.js
├── middlewares/
│   ├── auth.js
│   └── error.js
├── models/
│   ├── Client.js
│   ├── Expense.js
│   ├── Invoice.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── client.js
│   ├── expense.js
│   ├── invoice.js
│   └── user.js
├── config.env
├── package.json
├── README.md
└── server.js
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/invoice-tracker |
| JWT_SECRET | JWT signing secret | (required) |
| NODE_ENV | Environment mode | development |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License 