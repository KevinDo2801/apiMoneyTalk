# Transaction API - User Security Implementation

## Overview
This API has been updated to implement proper user association and security. All transactions are now scoped to individual users, ensuring data privacy and security.

## Key Security Features

### 1. Authentication Required
- All transaction endpoints now require a valid JWT token
- Token must be provided in the `Authorization` header as `Bearer <token>`
- Invalid or missing tokens return 401 Unauthorized

### 2. User Data Isolation
- Each transaction is associated with a specific user via `user_id`
- Users can only access, modify, or delete their own transactions
- Database queries are automatically filtered by user ID

### 3. Row Level Security (RLS)
- Database-level security policies ensure data isolation
- Even if application logic fails, database prevents cross-user access
- Policies cover SELECT, INSERT, UPDATE, and DELETE operations

## API Endpoints

All endpoints require authentication via JWT token.

### Headers Required
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### 1. Create Transaction
```
POST /api/transactions
```
**Body:**
```json
{
  "type": "income|expense",
  "category": "string",
  "amount": number,
  "note": "string (optional)",
  "date": "YYYY-MM-DD (optional, defaults to today)"
}
```

### 2. Get All Transactions
```
GET /api/transactions?type=income&category=food&startDate=2024-01-01&limit=10&offset=0
```

### 3. Get Transaction by ID
```
GET /api/transactions/:id
```

### 4. Update Transaction
```
PUT /api/transactions/:id
```
**Body:** Same as create, all fields optional

### 5. Delete Transaction
```
DELETE /api/transactions/:id
```

## Database Schema

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  note TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Security Policies
- **SELECT**: Users can only view their own transactions
- **INSERT**: Users can only create transactions for themselves
- **UPDATE**: Users can only update their own transactions
- **DELETE**: Users can only delete their own transactions

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required. Please provide a valid Bearer token."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Transaction not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields: type, category, and amount are required"
}
```

## Migration Required

Run the following SQL migration to add user association:

```sql
-- See src/migrations/add_user_id_to_transactions.sql
```

## Testing the API

### 1. Get Authentication Token
First, authenticate with Supabase to get a JWT token.

### 2. Test with cURL
```bash
# Create a transaction
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "category": "food",
    "amount": 25.50,
    "note": "Lunch at restaurant"
  }'

# Get all transactions
curl -X GET http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Benefits

1. **Data Privacy**: Users can only see their own transactions
2. **Prevent Data Leaks**: No accidental cross-user data exposure
3. **Database-Level Security**: RLS policies provide additional protection
4. **Token-Based Auth**: Secure JWT authentication
5. **Automatic Filtering**: All queries automatically include user context

## Implementation Notes

- The `user_id` is automatically extracted from the JWT token
- All service methods now require a `userId` parameter
- Controllers validate authentication before processing requests
- Database queries include user filtering at the service level
- RLS policies provide defense-in-depth security
