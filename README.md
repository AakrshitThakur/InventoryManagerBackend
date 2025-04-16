# Inventory Manager Backend

![Inventor Manager logo](https://github.com/AakrshitThakur/InventoryManagerFrontend/blob/main/public/images/Navbar.png)

Inventory Manager is a MERN stack-based website that helps users manage inventory with CRUD operation.

## Features

- User Authentication and Authorization  
  Session-based login system with fine-grained access control for viewing and editing data.

- Shop Management  
  Create, read, update, and delete shops. Attach images via Cloudinary.

- Category and Item Management  
  Nested category structure per shop with items including images and metadata.

- Cloudinary Integration  
  Upload and manage images for shops and items.

- Graph Analysis Support  
  Backend-ready endpoints for analyzing stock quantities over time.

- Email Support  
  Send notifications and alerts using SMTP.

---

## Tech Stack

| Layer         | Tech                             |
| ------------- | -------------------------------- |
| Backend       | Node.js, Express.js              |
| Database      | MongoDB Atlas                    |
| Media         | Cloudinary                       |
| Email Service | SMTP (Gmail, SendGrid supported) |
| Security      | Express-Session, Dotenv          |

---

## Project Structure

```
InventoryManagerBackend/
├── DemoData/            # Sample JSON data
├── middlewares/         # Authentication and Authorization
├── models/              # Mongoose schemas
├── routers/             # Route handlers (shops, auth, categories)
├── utils/               # Utility functions (e.g., cloudinary, email)
├── index.js             # Server entry point
├── package.json         # Dependencies and scripts
└── .env                 # Local environment variables
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/AakrshitThakur/InventoryManagerBackend.git
cd InventoryManagerBackend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and include the following:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

AakrshitThakurUSER_PSD=your_mongodb_password
PORT=5000
SESSION_SECRET=your_session_secret

EMAIL_HOST=smtp.emailprovider.com
EMAIL_PORT=587
EMAIL_USER=youremail@example.com
EMAIL_PASS=your_email_password
```

### 4. Start the server

```bash
npm start
```

The application will run at: `http://localhost:5000`

---

## Authentication & Middleware

- `CheckAuthentication`: Validates user session.
- `CheckAuthorizationForShops`: Ensures the user owns the shop.
- `GrantReadAccessForShops`: Allows shared access for viewing.
- `multer`: Handles image uploads for shops and items.

---

## API Reference

### Shop Routes

| Method | Endpoint           | Description                      | Auth Required | Middleware                                              |
| ------ | ------------------ | -------------------------------- | ------------- | ------------------------------------------------------- |
| GET    | /shops             | Get all shops                    | No            | -                                                       |
| GET    | /shops/ViewMyShops | Get user-owned shops             | Yes           | CheckAuthentication                                     |
| GET    | /shops/:id         | Get shop by ID                   | Yes           | CheckAuthentication, GrantReadAccessForShops            |
| POST   | /shops/create      | Create a new shop (image upload) | Yes           | CheckAuthentication, multer                             |
| POST   | /shops/:id/edit    | Update a shop                    | Yes           | CheckAuthentication, CheckAuthorizationForShops, multer |
| POST   | /shops/:id/delete  | Delete a shop                    | Yes           | CheckAuthentication, CheckAuthorizationForShops         |

### Category and Item Routes

| Method | Endpoint                                                   | Description           | Auth Required | Middleware                         |
| ------ | ---------------------------------------------------------- | --------------------- | ------------- | ---------------------------------- |
| GET    | /shops/:id/stockroom/categories                            | List categories       | Yes           | GrantReadAccessForShops            |
| POST   | /shops/:id/stockroom/categories/new                        | Create category       | Yes           | CheckAuthorizationForShops         |
| GET    | /shops/:id/stockroom/categories/:CategoryID                | View category details | Yes           | GrantReadAccessForShops            |
| POST   | /shops/:id/stockroom/categories/:CategoryID/new            | Add item              | Yes           | CheckAuthorizationForShops, multer |
| POST   | /shops/:id/stockroom/categories/:CategoryID/:ItemID/edit   | Edit item             | Yes           | CheckAuthorizationForShops, multer |
| POST   | /shops/:id/stockroom/categories/:CategoryID/:ItemID/delete | Delete item           | Yes           | CheckAuthorizationForShops         |
| GET    | /shops/:id/stockroom/categories/:CategoryID/:ItemID        | View item             | Yes           | GrantReadAccessForShops            |

### Graph Analysis

| Method | Endpoint                                                  | Description             | Auth Required | Middleware              |
| ------ | --------------------------------------------------------- | ----------------------- | ------------- | ----------------------- |
| GET    | /shops/:id/stockroom/categories/:CategoryID/GraphAnalysis | Graph data for category | Yes           | GrantReadAccessForShops |

---

### Request Management Routes

| Method | Endpoint                                                 | Description                    | Auth Required | Middleware                                         |
| ------ | -------------------------------------------------------- | ------------------------------ | ------------- | -------------------------------------------------- |
| `GET`  | `/reqs/ViewReqsReceived`                                 | View all requests received     | Yes           | `CheckAuthentication`                              |
| `GET`  | `/reqs/ViewSentreqs`                                     | View all requests sent         | Yes           | `CheckAuthentication`                              |
| `GET`  | `/reqs/:id/accept`                                       | Accept a request               | Yes           | `CheckAuthentication`, `CheckAuthorizationForReqs` |
| `GET`  | `/reqs/:id/reject`                                       | Reject a request               | Yes           | `CheckAuthentication`, `CheckAuthorizationForReqs` |
| `POST` | `/reqs/:id/EditResponse`                                 | Add or edit a response message | Yes           | `CheckAuthentication`, `CheckAuthorizationForReqs` |
| `POST` | `/:id/stockroom/categories/:CategoryID/:ItemID/reqs/new` | Create a new request           | Yes           | `CheckAuthentication`                              |

### Authentication Routes

| Method | Endpoint     | Description                                    | Auth Required | Notes                                           |
| ------ | ------------ | ---------------------------------------------- | ------------- | ----------------------------------------------- |
| `POST` | `/signup`    | Start signup process — sends OTP to user email | No            | Stores OTP and user info temporarily in session |
| `POST` | `/VerifyOTP` | Verify OTP and complete signup                 | No            | Max 3 attempts; OTP expires in 1 minute         |
| `POST` | `/login`     | Login an existing user and store session       | No            | Compares hashed password                        |
| `POST` | `/logout`    | Logout the current user and destroy session    | Yes           | Clears session and cookie                       |

## Security Notes

- Uses express-session to manage user sessions.
- All sensitive credentials are stored securely using dotenv.
- Custom middleware is used for authentication and authorization.
- Uploaded images are stored in Cloudinary and removed when no longer needed.

---

## Sample Data

Sample payloads and testing data are located in the `DemoData/` directory.

---

## Contributing

1. Fork this repository
2. Create a new feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to GitHub (`git push origin feature/your-feature`)
5. Create a pull request describing your changes

---

## Contact

**Author**: Aakrshit Thakur  
GitHub: [@AakrshitThakur](https://github.com/AakrshitThakur)

## Feedback

If you have any feedback, please reach out to us at thakurraakrshitt@gmail.com
