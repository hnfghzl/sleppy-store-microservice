# Postman Collection untuk Premium App Marketplace

File ini berisi collection Postman yang bisa diimport untuk testing API.

## Import ke Postman

1. Buka Postman
2. Klik "Import" di pojok kiri atas
3. Pilih file ini atau copy-paste JSON di bawah
4. Collection akan otomatis ter-import

## Collection JSON

```json
{
  "info": {
    "name": "Premium App Marketplace",
    "description": "API Collection untuk testing Premium App Marketplace",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"password123\",\n  \"fullName\": \"John Doe\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/register",
              "host": ["{{base_url}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Register Admin",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@example.com\",\n  \"password\": \"admin123\",\n  \"fullName\": \"Admin User\",\n  \"role\": \"admin\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/register",
              "host": ["{{base_url}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "var jsonData = pm.response.json();",
                  "pm.collectionVariables.set(\"token\", jsonData.token);"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          }
        },
        {
          "name": "Verify Token",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/auth/verify",
              "host": ["{{base_url}}"],
              "path": ["auth", "verify"]
            }
          }
        }
      ]
    },
    {
      "name": "Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/products?page=1&limit=10",
              "host": ["{{base_url}}"],
              "path": ["products"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Get Product by ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/products/1",
              "host": ["{{base_url}}"],
              "path": ["products", "1"]
            }
          }
        },
        {
          "name": "Create Product (Admin)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"New Premium App\",\n  \"description\": \"Amazing new application\",\n  \"category\": \"Productivity\",\n  \"price\": 99000,\n  \"features\": [\"Feature 1\", \"Feature 2\"],\n  \"imageUrl\": \"https://via.placeholder.com/300\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/products",
              "host": ["{{base_url}}"],
              "path": ["products"]
            }
          }
        },
        {
          "name": "Update Product (Admin)",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Updated App Name\",\n  \"description\": \"Updated description\",\n  \"category\": \"Productivity\",\n  \"price\": 89000,\n  \"features\": [\"Feature 1\", \"Feature 2\", \"Feature 3\"],\n  \"imageUrl\": \"https://via.placeholder.com/300\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/products/1",
              "host": ["{{base_url}}"],
              "path": ["products", "1"]
            }
          }
        },
        {
          "name": "Delete Product (Admin)",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/products/1",
              "host": ["{{base_url}}"],
              "path": ["products", "1"]
            }
          }
        }
      ]
    },
    {
      "name": "Orders",
      "item": [
        {
          "name": "Create Order",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"productId\": 1,\n  \"quantity\": 1,\n  \"totalPrice\": 699000\n}"
            },
            "url": {
              "raw": "{{base_url}}/orders",
              "host": ["{{base_url}}"],
              "path": ["orders"]
            }
          }
        },
        {
          "name": "Get My Orders",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/orders/my-orders",
              "host": ["{{base_url}}"],
              "path": ["orders", "my-orders"]
            }
          }
        },
        {
          "name": "Get Order by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/orders/1",
              "host": ["{{base_url}}"],
              "path": ["orders", "1"]
            }
          }
        },
        {
          "name": "Get All Orders (Admin)",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/orders?page=1&limit=10",
              "host": ["{{base_url}}"],
              "path": ["orders"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Update Order Status (Admin)",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"completed\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/orders/1/status",
              "host": ["{{base_url}}"],
              "path": ["orders", "1", "status"]
            }
          }
        }
      ]
    },
    {
      "name": "Payments",
      "item": [
        {
          "name": "Create Payment",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"orderId\": 1,\n  \"amount\": 699000,\n  \"paymentMethod\": \"bank_transfer\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/payments",
              "host": ["{{base_url}}"],
              "path": ["payments"]
            }
          }
        },
        {
          "name": "Get Payment by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/payments/1",
              "host": ["{{base_url}}"],
              "path": ["payments", "1"]
            }
          }
        },
        {
          "name": "Verify Payment",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"paymentReference\": \"PAY-1234567890-ABC123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/payments/1/verify",
              "host": ["{{base_url}}"],
              "path": ["payments", "1", "verify"]
            }
          }
        },
        {
          "name": "Get All Payments (Admin)",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/payments?page=1&limit=10",
              "host": ["{{base_url}}"],
              "path": ["payments"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "Get My Profile",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/users/me",
              "host": ["{{base_url}}"],
              "path": ["users", "me"]
            }
          }
        },
        {
          "name": "Update My Profile",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"fullName\": \"John Doe Updated\",\n  \"phone\": \"+628123456789\",\n  \"address\": \"Jakarta, Indonesia\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/users/me",
              "host": ["{{base_url}}"],
              "path": ["users", "me"]
            }
          }
        },
        {
          "name": "Get All Users (Admin)",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/users?page=1&limit=10",
              "host": ["{{base_url}}"],
              "path": ["users"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Get User by ID (Admin)",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/users/1",
              "host": ["{{base_url}}"],
              "path": ["users", "1"]
            }
          }
        },
        {
          "name": "Delete User (Admin)",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/users/1",
              "host": ["{{base_url}}"],
              "path": ["users", "1"]
            }
          }
        }
      ]
    }
  ]
}
```

## Cara Menggunakan

1. Import collection ini ke Postman
2. Pastikan semua services sudah running
3. Mulai dengan folder "Auth" untuk register dan login
4. Token akan otomatis tersimpan setelah login
5. Gunakan token tersebut untuk endpoint yang memerlukan autentikasi
