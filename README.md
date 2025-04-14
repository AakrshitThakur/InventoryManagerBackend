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

`CLOUDINARY_API_KEY`
Enter your Cloudinary API key

`CLOUDINARY_API_SECRET`
Enter your Cloudinary API secret

`AakrshitThakurUSER_PSD` Enter your MongoDB Atlas user password

`PORT` Enter the port where the server will be hosted.

`SESSION_SECRET` Enter your session secret

## Routes

## 🛍️ Shop Routes

| Method | Endpoint             | Description                                                           | Auth Required | Middleware                                                    |
| ------ | -------------------- | --------------------------------------------------------------------- | ------------- | ------------------------------------------------------------- |
| `GET`  | `/shops`             | Fetch all shops with optional filter (`owner`, `ShopName`, `address`) | ❌            | None                                                          |
| `GET`  | `/shops/ViewMyShops` | Fetch all shops associated with the currently logged-in user          | ✅            | `CheckAuthentication`                                         |
| `GET`  | `/shops/:id`         | Get a specific shop by ID                                             | ✅            | `CheckAuthentication`, `GrantReadAccessForShops`              |
| `POST` | `/shops/create`      | Create a new shop (with optional image upload via `ShopImg`)          | ✅            | `CheckAuthentication`, `multer`                               |
| `POST` | `/shops/:id/edit`    | Edit a specific shop by ID (with optional image update)               | ✅            | `CheckAuthentication`, `CheckAuthorizationForShops`, `multer` |
| `POST` | `/shops/:id/delete`  | Delete a specific shop and associated categories + image cleanup      | ✅            | `CheckAuthentication`, `CheckAuthorizationForShops`           |

| Category routes                                              | Method | Authentication | Authorization | Description                                                                          |
| ------------------------------------------------------------ | ------ | -------------- | ------------- | ------------------------------------------------------------------------------------ |
| `/shops/:id/stockroom/categories`                            | GET    | Yes            | Yes           | Retrieves all categories associated with a specific shop.                            |
| `/shops/:id/stockroom/categories/new`                        | POST   | Yes            | Yes           | Creates a new category under a specific shop.                                        |
| `/shops/:id/stockroom/categories/:CategoryID`                | GET    | Yes            | Yes           | Retrieves details of a specific category under a shop.                               |
| `/shops/:id/stockroom/categories/:CategoryID/new`            | POST   | Yes            | Yes           | Adds a new item under a specific category.                                           |
| `/shops/:id/stockroom/categories/:CategoryID/:ItemID/edit`   | POST   | Yes            | Yes           | Edits an existing item under a category, with an option to upload a new image.       |
| `/shops/:id/stockroom/categories/:CategoryID/:ItemID/delete` | POST   | Yes            | Yes           | Deletes an item from a category and removes the associated image from cloud storage. |
| `/shops/:id/stockroom/categories/:CategoryID/:ItemID`        | GET    | Yes            | Yes           | Retrieves item details from a category.                                              |

| GraphAnalyses routes                                        | Method | Authentication | Authorization | Description                                                                                                                 |
| ----------------------------------------------------------- | ------ | -------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `/shops/:id/stockroom/categories/:CategoryID/GraphAnalyses` | GET    | Yes            | Yes           | Retrieves item data from a category for graphical analysis, including prices, discounts, stock status, and payment details. |

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
