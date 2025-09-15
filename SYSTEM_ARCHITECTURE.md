# iREPLY Inventory Management System - Architecture Documentation

## 🏗️ System Overview

The iREPLY Inventory Management System is a modern, full-stack web application built with Laravel 12 (Backend) and React 18 (Frontend), designed for comprehensive equipment and asset management.

## 📊 Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Laravel API    │    │   MySQL Database│
│                 │    │                 │    │                 │
│ • Components    │◄──►│ • Controllers   │◄──►│ • Tables        │
│ • Hooks         │    │ • Models        │    │ • Relationships │
│ • Context       │    │ • Middleware    │    │ • Constraints   │
│ • Services      │    │ • Routes        │    │ • Indexes       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🗄️ Database Schema

### Core Tables

#### 1. **users** (Enhanced)
```sql
- id (Primary Key)
- name, email, password
- role_id (Foreign Key → roles.id)
- employee_id, position, department, phone
- is_active (Boolean)
- timestamps
```

#### 2. **roles**
```sql
- id (Primary Key)
- name (unique: super_admin, admin, employee)
- display_name, description
- permissions (JSON array)
- is_active (Boolean)
- timestamps
```

#### 3. **equipment_categories**
```sql
- id (Primary Key)
- name, slug (unique)
- description, icon
- is_active (Boolean)
- timestamps
```

#### 4. **equipment**
```sql
- id (Primary Key)
- name, brand, model
- specifications, serial_number (unique), asset_tag (unique)
- status (enum: available, in_use, maintenance, retired)
- condition (enum: excellent, good, fair, poor)
- purchase_price, purchase_date, warranty_expiry
- notes, location
- category_id (Foreign Key → equipment_categories.id)
- timestamps
```

#### 5. **requests**
```sql
- id (Primary Key)
- user_id (Foreign Key → users.id)
- equipment_id (Foreign Key → equipment.id)
- request_type (enum: borrow, permanent_assignment, maintenance)
- request_mode (enum: onsite, wfh, hybrid)
- reason, start_date, end_date
- status (enum: pending, approved, rejected, cancelled)
- approved_by (Foreign Key → users.id)
- approved_at, approval_notes, rejection_reason
- timestamps
```

#### 6. **transactions**
```sql
- id (Primary Key)
- request_id (Foreign Key → requests.id)
- equipment_id (Foreign Key → equipment.id)
- user_id (Foreign Key → users.id)
- transaction_type (enum: issue, return, transfer, maintenance)
- status (enum: active, completed, overdue, cancelled)
- issued_at, returned_at, expected_return_date
- condition_on_issue, condition_on_return, notes
- processed_by (Foreign Key → users.id)
- timestamps
```

## 🔐 Authentication & Authorization

### Authentication Flow
1. **Login**: POST `/api/auth/login`
2. **Token Generation**: Laravel Sanctum creates access token
3. **Token Storage**: Frontend stores token in localStorage
4. **Request Headers**: Token sent with each API request
5. **Token Validation**: Middleware validates token on protected routes

### Role-Based Access Control (RBAC)

#### Roles Hierarchy
```
Super Admin (super_admin)
├── Full system access
├── User management
├── Role management
└── All CRUD operations

Admin (admin)
├── Equipment management
├── Request approval/rejection
├── User management (limited)
└── Reports access

Employee (employee)
├── View equipment
├── Create requests
├── View own requests
└── Limited access
```

#### Permissions System
```json
{
  "super_admin": [
    "equipment.create", "equipment.read", "equipment.update", "equipment.delete",
    "requests.create", "requests.read", "requests.update", "requests.delete", 
    "requests.approve", "requests.reject",
    "transactions.create", "transactions.read", "transactions.update", "transactions.delete",
    "users.create", "users.read", "users.update", "users.delete",
    "roles.create", "roles.read", "roles.update", "roles.delete",
    "reports.read", "analytics.read"
  ],
  "admin": [
    "equipment.create", "equipment.read", "equipment.update", "equipment.delete",
    "requests.create", "requests.read", "requests.update", "requests.delete",
    "requests.approve", "requests.reject",
    "transactions.create", "transactions.read", "transactions.update", "transactions.delete",
    "users.create", "users.read", "users.update",
    "reports.read", "analytics.read"
  ],
  "employee": [
    "equipment.read",
    "requests.create", "requests.read", "requests.update",
    "transactions.read"
  ]
}
```

## 🚀 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/login           - User login
POST   /api/auth/logout          - User logout
GET    /api/auth/me              - Get current user
PUT    /api/auth/profile         - Update profile
PUT    /api/auth/change-password - Change password
POST   /api/auth/register        - Register user (Admin only)
```

### Equipment Endpoints
```
GET    /api/equipment            - List equipment (with filters)
POST   /api/equipment            - Create equipment
GET    /api/equipment/{id}       - Get equipment details
PUT    /api/equipment/{id}       - Update equipment
DELETE /api/equipment/{id}       - Delete equipment
GET    /api/equipment-statistics - Get equipment statistics
```

### Request Endpoints
```
GET    /api/requests             - List requests (with filters)
POST   /api/requests             - Create request
GET    /api/requests/{id}        - Get request details
PUT    /api/requests/{id}        - Update request
DELETE /api/requests/{id}        - Delete request
POST   /api/requests/{id}/approve - Approve request
POST   /api/requests/{id}/reject  - Reject request
GET    /api/request-statistics   - Get request statistics
```

### Transaction Endpoints
```
GET    /api/transactions         - List transactions
POST   /api/transactions         - Create transaction
GET    /api/transactions/{id}    - Get transaction details
PUT    /api/transactions/{id}    - Update transaction
DELETE /api/transactions/{id}    - Delete transaction
```

### User Endpoints (Admin only)
```
GET    /api/users                - List users
POST   /api/users                - Create user
GET    /api/users/{id}           - Get user details
PUT    /api/users/{id}           - Update user
DELETE /api/users/{id}           - Delete user
```

## 🎨 Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── SuperAdminUpdated.jsx    - Main admin dashboard
│   ├── Loading.jsx              - Loading spinner
│   ├── Notification.jsx         - Toast notifications
│   └── NotificationContainer.jsx - Notification manager
├── contexts/
│   └── AppContext.jsx           - Global state management
├── hooks/
│   └── useApi.js                - Custom API hooks
└── services/
    └── api.js                   - API service layer
```

### State Management
- **React Context**: Global application state
- **Custom Hooks**: API state management
- **Local Storage**: Authentication persistence
- **Real-time Updates**: Optimistic UI updates

### Key Features
- **Responsive Design**: Mobile-first approach
- **Real-time Notifications**: Toast notifications
- **Loading States**: Skeleton loaders
- **Error Handling**: Comprehensive error management
- **Pagination**: Efficient data loading
- **Search & Filters**: Advanced filtering capabilities

## 🔧 Development Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Laravel 12

### Installation Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd IReply-inventory
```

2. **Backend Setup**
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
```

3. **Frontend Setup**
```bash
npm install
npm run dev
```

4. **Start Development Server**
```bash
php artisan serve
# In another terminal
npm run dev
```

### Default Credentials
```
Super Admin:
Email: superadmin@ireply.com
Password: admin123

Admin:
Email: admin@ireply.com
Password: admin123

Employee:
Email: john.francisco@ireply.com
Password: password123
```

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Model and service testing
- **Feature Tests**: API endpoint testing
- **Integration Tests**: Database interaction testing

### Frontend Testing
- **Component Tests**: React component testing
- **Hook Tests**: Custom hook testing
- **Integration Tests**: API integration testing

## 📈 Performance Optimizations

### Backend Optimizations
- **Database Indexing**: Optimized queries
- **Eager Loading**: Reduced N+1 queries
- **Caching**: Redis for session storage
- **API Pagination**: Efficient data loading

### Frontend Optimizations
- **Code Splitting**: Lazy loading components
- **Memoization**: React.memo and useMemo
- **Virtual Scrolling**: Large list optimization
- **Image Optimization**: WebP format support

## 🔒 Security Measures

### Backend Security
- **CSRF Protection**: Laravel CSRF tokens
- **SQL Injection**: Eloquent ORM protection
- **XSS Protection**: Input sanitization
- **Rate Limiting**: API rate limiting
- **CORS Configuration**: Cross-origin protection

### Frontend Security
- **XSS Prevention**: React's built-in protection
- **Token Management**: Secure token storage
- **Input Validation**: Client-side validation
- **HTTPS Enforcement**: Secure communication

## 🚀 Deployment

### Production Environment
- **Web Server**: Nginx/Apache
- **PHP-FPM**: Process management
- **Database**: MySQL with replication
- **Cache**: Redis cluster
- **CDN**: Static asset delivery

### Environment Variables
```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

## 📊 Monitoring & Analytics

### Application Monitoring
- **Error Tracking**: Laravel Telescope
- **Performance Monitoring**: Application metrics
- **User Analytics**: Usage statistics
- **Database Monitoring**: Query performance

### Business Metrics
- **Equipment Utilization**: Usage statistics
- **Request Processing**: Approval times
- **User Activity**: Login patterns
- **System Health**: Uptime monitoring

## 🔄 Future Enhancements

### Planned Features
- **Mobile App**: React Native application
- **Advanced Reporting**: Business intelligence
- **Barcode Scanning**: Equipment tracking
- **Email Notifications**: Automated alerts
- **Audit Trail**: Complete activity logging
- **Multi-tenant**: Organization support

### Technical Improvements
- **Microservices**: Service decomposition
- **Event Sourcing**: Audit trail implementation
- **GraphQL**: Flexible API queries
- **Real-time Updates**: WebSocket integration
- **Progressive Web App**: Offline capabilities

## 📞 Support & Maintenance

### Documentation
- **API Documentation**: Swagger/OpenAPI
- **User Manual**: End-user guide
- **Developer Guide**: Technical documentation
- **Deployment Guide**: Production setup

### Maintenance Schedule
- **Daily**: System health checks
- **Weekly**: Performance monitoring
- **Monthly**: Security updates
- **Quarterly**: Feature releases

---

**Last Updated**: September 2024
**Version**: 1.0.0
**Maintainer**: iREPLY Development Team
