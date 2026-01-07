# Architecture Overview - Premium App Marketplace

## System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  (Web Browser, Mobile App, Postman, etc.)                      │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │
┌───────────────────────────▼────────────────────────────────────┐
│                       API GATEWAY                               │
│                      (Port 3000)                                │
│  • Request Routing                                              │
│  • Authentication Middleware                                    │
│  • Rate Limiting                                                │
│  • CORS Handling                                                │
└─────┬────────┬────────┬────────┬────────┬─────────────────────┘
      │        │        │        │        │
      │        │        │        │        │
   ┌──▼──┐  ┌─▼───┐  ┌─▼────┐ ┌─▼─────┐ ┌▼──────┐
   │Auth │  │Prod │  │Order│  │Payment│ │ User  │
   │:3001│  │:3002│  │:3003│  │:3004  │ │ :3005 │
   └──┬──┘  └─┬───┘  └─┬────┘ └─┬─────┘ └┬──────┘
      │        │        │        │        │
   ┌──▼────┐┌─▼─────┐┌─▼──────┐┌▼──────┐┌▼───────┐
   │auth_db││prod_db││order_db││pay_db ││user_db │
   │ :5432 ││ :5432 ││  :5432 ││ :5432 ││ :5432  │
   └───────┘└───────┘└────────┘└───────┘└────────┘
```

## Microservices Details

### 1. API Gateway

**Purpose**: Single entry point for all client requests

**Responsibilities**:

- Route requests to appropriate microservices
- Handle authentication/authorization
- Apply rate limiting
- Enable CORS
- Aggregate responses if needed

**Technology Stack**:

- Express.js
- Axios (for inter-service communication)
- express-rate-limit
- helmet (security)

### 2. Auth Service

**Purpose**: Handle user authentication and authorization

**Responsibilities**:

- User registration
- User login
- JWT token generation
- Token verification
- Password hashing

**Technology Stack**:

- Express.js
- PostgreSQL
- bcryptjs
- jsonwebtoken
- Joi (validation)

**Database Schema**:

```sql
users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### 3. Product Service

**Purpose**: Manage premium application catalog

**Responsibilities**:

- List all products (with pagination, filtering, search)
- Get product details
- Create/Update/Delete products (admin only)
- Product categorization

**Technology Stack**:

- Express.js
- PostgreSQL
- Joi (validation)

**Database Schema**:

```sql
products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  features JSONB,
  image_url VARCHAR(500),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### 4. Order Service

**Purpose**: Manage customer orders

**Responsibilities**:

- Create new orders
- Track order status
- List user orders
- List all orders (admin)
- Update order status
- Cancel orders

**Technology Stack**:

- Express.js
- PostgreSQL
- Joi (validation)
- Axios (communicate with other services)

**Database Schema**:

```sql
orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**Order Status Flow**:

```
pending → paid → processing → completed
   ↓
cancelled
```

### 5. Payment Service

**Purpose**: Handle payment processing

**Responsibilities**:

- Initiate payments
- Generate payment references
- Verify payments
- Track payment status
- Update order status after payment

**Technology Stack**:

- Express.js
- PostgreSQL
- Joi (validation)
- Axios (communicate with Order Service)

**Database Schema**:

```sql
payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  order_id INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_reference VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  verified_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**Payment Methods**:

- credit_card
- bank_transfer
- e-wallet
- virtual_account

### 6. User Service

**Purpose**: Manage user profiles and data

**Responsibilities**:

- Get user profile
- Update user profile
- List all users (admin)
- Delete users (admin)
- User statistics

**Technology Stack**:

- Express.js
- PostgreSQL
- Joi (validation)

**Database Schema**:

```sql
users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Communication Patterns

### Synchronous Communication (HTTP/REST)

- API Gateway ↔ All Microservices
- Payment Service → Order Service (update order status after payment)

### Data Flow Example: Complete Purchase Flow

```
1. User Registration/Login
   Client → API Gateway → Auth Service

2. Browse Products
   Client → API Gateway → Product Service

3. Create Order
   Client → API Gateway → Order Service

4. Make Payment
   Client → API Gateway → Payment Service

5. Verify Payment
   Client → API Gateway → Payment Service → Order Service
   (Payment Service updates Order status)
```

## Security

### Authentication Flow

```
1. User logs in
   ↓
2. Auth Service validates credentials
   ↓
3. Generate JWT token with user info
   ↓
4. Return token to client
   ↓
5. Client includes token in subsequent requests
   ↓
6. API Gateway validates token via Auth Service
   ↓
7. Request forwarded to target service
```

### Authorization

- **Public**: Product listing, product details
- **Authenticated**: Create orders, payments, view own data
- **Admin Only**: CRUD products, view all orders/payments/users

## Database Strategy

### Database per Service Pattern

Each microservice has its own PostgreSQL database:

- **Pros**:
  - Service independence
  - Technology flexibility
  - Easier scaling
  - Fault isolation
- **Cons**:
  - Data consistency challenges
  - No foreign key constraints across services
  - More complex queries

### Data Consistency

- Eventually consistent
- Use service-to-service calls for data updates
- Consider implementing saga pattern for complex transactions

## Scalability Considerations

### Horizontal Scaling

Each service can be scaled independently:

```
Load Balancer
     │
     ├─── API Gateway Instance 1
     ├─── API Gateway Instance 2
     └─── API Gateway Instance 3
          │
          ├─── Auth Service Instances
          ├─── Product Service Instances
          ├─── Order Service Instances
          └─── Payment Service Instances
```

### Caching Strategy (Future Enhancement)

- Redis for session management
- Cache product catalog
- Cache user profiles

### Message Queue (Future Enhancement)

- RabbitMQ/Kafka for async operations
- Email notifications
- Payment confirmations
- Order processing

## Deployment

### Docker Compose (Current)

- Single-host deployment
- All services in one docker-compose file
- Suitable for development and small-scale production

### Kubernetes (Future)

- Multi-host orchestration
- Auto-scaling
- Self-healing
- Service mesh (Istio)

## Monitoring & Logging (Future Enhancement)

### Centralized Logging

- ELK Stack (Elasticsearch, Logstash, Kibana)
- Aggregate logs from all services

### Monitoring

- Prometheus for metrics
- Grafana for visualization
- Health check endpoints

### Distributed Tracing

- Jaeger/Zipkin
- Track requests across services

## API Gateway Patterns

### Circuit Breaker

Prevent cascading failures when a service is down

### Retry Logic

Automatic retry for failed requests

### Timeout Management

Set appropriate timeouts for each service

## Best Practices Implemented

1. **Single Responsibility**: Each service has one clear purpose
2. **Loose Coupling**: Services communicate via REST APIs
3. **High Cohesion**: Related functionality grouped together
4. **Database per Service**: Data isolation
5. **API Gateway Pattern**: Centralized entry point
6. **JWT Authentication**: Stateless authentication
7. **Input Validation**: Joi validation on all inputs
8. **Error Handling**: Consistent error responses
9. **Environment Configuration**: .env files for configuration
10. **Docker Support**: Containerized services

## Future Enhancements

1. **API Versioning**: Support multiple API versions
2. **Rate Limiting per User**: More granular rate limits
3. **WebSockets**: Real-time notifications
4. **Email Service**: Separate service for notifications
5. **File Upload Service**: Handle product images
6. **Analytics Service**: Business intelligence
7. **Admin Dashboard**: Web UI for admin operations
8. **Customer Dashboard**: Web UI for customers
9. **API Documentation**: Swagger/OpenAPI
10. **Automated Testing**: Unit, integration, e2e tests
