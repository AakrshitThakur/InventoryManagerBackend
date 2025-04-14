# Inventory Manager Backend

![Inventor Manager logo](https://github.com/AakrshitThakur/InventoryManagerFrontend/blob/main/public/images/InventoryManagerDeployedImgs/InventorManagerLogo.png?raw=true)

Inventory Manager is a MERN stack-based website that helps users manage inventory with CRUD operation.

## Tech Stack

**Client:** React.js, Tailwind.css

**Server:** Node.js, Express.js

**Database:** MongoDB Atlas

**Cloud:** Cloudinary to store user images

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`CLOUDINARY_CLOUD_NAME` Enter your Cloudinary cloud name

`CLOUDINARY_API_KEY` Enter your Cloudinary API key

`CLOUDINARY_API_SECRET` Enter your Cloudinary API secret

`AakrshitThakurUSER_PSD` Enter your MongoDB Atlas user password

`PORT` Enter the port where the server will be hosted.

`SESSION_SECRET` Enter your session secret

`EMAIL_HOST` Enter your email hosting service

`EMAIL_PORT` Enter your email hosting port

`EMAIL_USER` Enter your email address

`EMAIL_PASS` Enter your hashed email password

## Routes

### Shop Routes

| Method | Endpoint             | Description                                                                | Auth Required | Middleware                                                    |
| ------ | -------------------- | -------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------- |
| `GET`  | `/shops`             | Fetch all shops with optional filters (`owner`, `ShopName`, `address`)     | ❌ No         | None                                                          |
| `GET`  | `/shops/ViewMyShops` | Fetch all shops associated with the currently logged-in user               | ✅ Yes        | `CheckAuthentication`                                         |
| `GET`  | `/shops/:id`         | Get details of a specific shop by ID                                       | ✅ Yes        | `CheckAuthentication`, `GrantReadAccessForShops`              |
| `POST` | `/shops/create`      | Create a new shop (supports image upload via `ShopImg` field)              | ✅ Yes        | `CheckAuthentication`, `multer` (for image handling)          |
| `POST` | `/shops/:id/edit`    | Update a specific shop by ID (supports image update)                       | ✅ Yes        | `CheckAuthentication`, `CheckAuthorizationForShops`, `multer` |
| `POST` | `/shops/:id/delete`  | Delete a specific shop (including associated categories and image cleanup) | ✅ Yes        | `CheckAuthentication`, `CheckAuthorizationForShops`           |

### Category Routes

| Method | Endpoint                                                     | Description                                                        | Auth Required | Middleware                                                    |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------------ | ------------- | ------------------------------------------------------------- |
| `GET`  | `/shops/:id/stockroom/categories`                            | Fetch all categories for a specific shop                           | ✅ Yes        | `CheckAuthentication`, `GrantReadAccessForShops`              |
| `POST` | `/shops/:id/stockroom/categories/new`                        | Create a new category under a specific shop                        | ✅ Yes        | `CheckAuthentication`, `CheckAuthorizationForShops`           |
| `GET`  | `/shops/:id/stockroom/categories/:CategoryID`                | Fetch details of a specific category by ID                         | ✅ Yes        | `CheckAuthentication`, `GrantReadAccessForShops`              |
| `POST` | `/shops/:id/stockroom/categories/:CategoryID/new`            | Add a new item to a category (supports image upload via `ItemImg`) | ✅ Yes        | `CheckAuthentication`, `CheckAuthorizationForShops`, `multer` |
| `POST` | `/shops/:id/stockroom/categories/:CategoryID/:ItemID/edit`   | Edit an item under a category (supports image update)              | ✅ Yes        | `CheckAuthentication`, `CheckAuthorizationForShops`, `multer` |
| `POST` | `/shops/:id/stockroom/categories/:CategoryID/:ItemID/delete` | Delete an item from a category (including cloud image cleanup)     | ✅ Yes        | `CheckAuthentication`, `CheckAuthorizationForShops`           |
| `GET`  | `/shops/:id/stockroom/categories/:CategoryID/:ItemID`        | Fetch details of a specific item under a category                  | ✅ Yes        | `CheckAuthentication`, `GrantReadAccessForShops`              |

### Graph Analysis Route

| Method | Endpoint                                                    | Description                                                         | Auth Required | Middleware                                       |
| ------ | ----------------------------------------------------------- | ------------------------------------------------------------------- | ------------- | ------------------------------------------------ |
| `GET`  | `/shops/:id/stockroom/categories/:CategoryID/GraphAnalyses` | Fetch item-level analytics data from a category (for charts/graphs) | ✅ Yes        | `CheckAuthentication`, `GrantReadAccessForShops` |

### Create Item Request Route

| Method | Endpoint                                                       | Description                                                               | Auth Required | Middleware            |
| ------ | -------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------- | --------------------- |
| `POST` | `/shops/:id/stockroom/categories/:CategoryID/:ItemID/reqs/new` | Create a new item request (e.g., procurement, restock, or customer order) | ✅ Yes        | `CheckAuthentication` |

### Request Management Routes

| Method | Endpoint                                                       | Description                                                 | Auth Required | Middleware                                         |
| ------ | -------------------------------------------------------------- | ----------------------------------------------------------- | ------------- | -------------------------------------------------- |
| `GET`  | `/reqs/ViewReqsReceived`                                       | Fetch all requests **received** by the authenticated user   | ✅ Yes        | `CheckAuthentication`                              |
| `GET`  | `/reqs/ViewSentReqs`                                           | Fetch all requests **sent** by the authenticated user       | ✅ Yes        | `CheckAuthentication`                              |
| `GET`  | `/reqs/:id/accept`                                             | Accept a request (only if status is `init`)                 | ✅ Yes        | `CheckAuthentication`, `CheckAuthorizationForReqs` |
| `GET`  | `/reqs/:id/reject`                                             | Reject a request (only if status is `init`)                 | ✅ Yes        | `CheckAuthentication`, `CheckAuthorizationForReqs` |
| `POST` | `/reqs/:id/EditResponse`                                       | Add or update a response message (only if status is `init`) | ✅ Yes        | `CheckAuthentication`, `CheckAuthorizationForReqs` |
| `POST` | `/shops/:id/stockroom/categories/:CategoryID/:ItemID/reqs/new` | Create a new item request (e.g., restock, procurement)      | ✅ Yes        | `CheckAuthentication`                              |

### User Authentication Routes

| Method | Endpoint      | Description                                       | Auth Required | Notes                                                                       |
| ------ | ------------- | ------------------------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `POST` | `/signup`     | Initiate user signup process (sends OTP to email) | ❌ No         | - Stores OTP and user data in temporary session<br>- OTP valid for 1 minute |
| `POST` | `/verify-otp` | Validate OTP to complete registration             | ❌ No         | - Maximum 3 attempts allowed<br>- Expires after 1 minute                    |
| `POST` | `/login`      | Authenticate existing user (creates session)      | ❌ No         | - Uses secure password hashing<br>- Sets HTTP-only session cookie           |
| `POST` | `/logout`     | Terminate current user session                    | ✅ Yes        | - Destroys server session<br>- Clears client-side cookies                   |

## Run Locally

**⚠️ Important:** Make sure to configure the CORS origin according to your needs.

Clone the project

```bash
  git clone https://github.com/AakrshitThakur/InventoryManagerBackend.git
```

Go to the project directory

```bash
  cd InventoryManagerBackend
```

Install dependencies

```bash
  npm install / npm i
```

Start the server locally

```bash
  nodemon index.js / node index.js
```

## Deployment

To deploy this project run

```bash
  npm run deploy
```

## 🔗 Links

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aakrshit-thakur-14433627b/)

## Feedback

If you have any feedback, please reach out to us at thakurraakrshitt@gmail.com
