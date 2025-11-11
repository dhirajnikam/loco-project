# Loco Frontend - React TypeScript

React frontend application for the Loco Locomotive Pilot Assessment System.

## 🚀 Tech Stack

- **Framework:** React 18.x
- **Language:** TypeScript
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Build Tool:** Create React App
- **Styling:** CSS3 (Custom)

## 📁 Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx      # Route guard for authentication
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── pages/
│   ├── Login.tsx                # Login page
│   ├── Register.tsx             # Registration page
│   ├── Dashboard.tsx            # Main dashboard
│   ├── Auth.css                 # Auth pages styling
│   └── Dashboard.css            # Dashboard styling
├── services/
│   └── api.ts                   # API service layer (NestJS backend)
├── types/
│   └── index.ts                 # TypeScript interfaces
└── App.tsx                      # Main app with routing
```

## 🔧 Installation

```bash
npm install
```

## 🏃 Running the App

```bash
# Development mode (runs on port 3001)
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🌐 Environment Variables

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:3000/api/v1
PORT=3001
```

## 📡 API Integration

The frontend connects to the NestJS backend at `http://localhost:3000/api/v1`

**Endpoints Used:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `GET /analytics/dashboard` - Dashboard metrics
- And more...

## 🔐 Authentication

- JWT token stored in localStorage
- Automatic token injection in API requests
- Auto-redirect to login on 401 errors
- Protected routes with role-based access

## 👥 User Roles

1. **Admin** - Full system access
2. **Evaluator** - Test management, candidate viewing
3. **Supervisor** - Read-only analytics access
4. **Candidate** - Take tests, view results

## 🎨 Features

### ✅ Implemented
- User Registration & Login
- JWT Authentication
- Protected Routes
- Role-based UI
- Dashboard with Analytics
- Responsive Design
- Error Handling
- Loading States

### 🚧 To Be Implemented
- Test Taking Interface
- Results Viewing
- Test Management (Admin/Evaluator)
- Candidate Management
- User Profile Page
- Reports Generation
- Real-time Session Updates

## 📱 Responsive Design

- Mobile-friendly layout
- Tablet optimization
- Desktop full features

## 🛠️ Development

### Adding New Pages

1. Create page in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`
3. Add to ProtectedRoute if auth required

### Adding New API Calls

1. Add types in `src/types/index.ts`
2. Add method in `src/services/api.ts`
3. Use in components with try/catch

### Example API Usage

```typescript
import apiService from '../services/api';

const fetchTests = async () => {
  try {
    const data = await apiService.getTests(1, 10);
    console.log(data);
  } catch (error) {
    console.error('Failed to fetch tests', error);
  }
};
```

## 🔒 Security

- JWT tokens with automatic injection
- Protected routes enforcement
- Role-based access control
- Secure token storage
- CORS configured

## 🎨 Styling

Custom CSS with:
- Gradient backgrounds
- Card-based layouts
- Hover effects
- Responsive grid system
- Modern color palette

## 🚀 Deployment

### Build

```bash
npm run build
```

### Deploy

Build folder can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting

## 📚 Additional Documentation

- [React Documentation](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 🤝 Integration with Backend

**Backend:** `/home/user/loco-project/loco-backend`
**Frontend:** `/home/user/loco-project/loco-frontend`

Both must run simultaneously:
1. Start backend: `cd loco-backend && npm run start:dev` (port 3000)
2. Start frontend: `cd loco-frontend && npm start` (port 3001)

## 🐛 Common Issues

### CORS Errors
- Ensure backend CORS is configured for `http://localhost:3001`
- Check `.env` file in backend

### API Connection Failed
- Verify backend is running on port 3000
- Check `REACT_APP_API_URL` in frontend `.env`

### Login Not Working
- Ensure MongoDB is running
- Check backend logs for errors
- Verify JWT_SECRET is set in backend

---

**Built with ❤️ using React & TypeScript**
