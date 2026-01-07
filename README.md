# YelpCamp

A full-stack web application designed for users to create, view, and review campgrounds. This project was built using Node.js, Express, MongoDB, and Bootstrap.

## Features

- **Authentication**:
  - User Login with username and password
  - User Registration
  - Admin/Author roles (only creators can edit/delete their posts)
  
- **Campgrounds**:
  - Create, view, edit, and delete campgrounds
  - View all campgrounds on a map (integration pending/if applicable)
  - Search/Filter campgrounds

- **Reviews**:
  - Users can leave reviews and ratings for any campground
  - Users can delete their own reviews

- **Security**:
  - Cross-Site Scripting (XSS) protection (via EJS escaping)
  - Mongo Injection protection
  - Form validation using Joi

## Tech Stack

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - Bootstrap 5 (Responsive Design)
  - EJS (Embedded JavaScript Templates)

- **Backend**:
  - Node.js
  - Express.js (v5)

- **Database**:
  - MongoDB
  - Mongoose (v8)

- **Authentication & Validation**:
  - Passport.js (Local Strategy)
  - Joi (Schema Validation)

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd YelpCamp
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start MongoDB**
    Ensure your local MongoDB instance is running.
    ```bash
    mongod
    ```

4.  **Run the application**
    ```bash
    node app.js
    ```
    or with nodemon if installed:
    ```bash
    nodemon app.js
    ```

5.  **Visit the App**
    Open your browser and navigate to:
    `http://localhost:3000`

## Database Management

To view and interact with the database using the command line:

1.  **Open a new terminal window**

2.  **Start the MongoDB Shell**
    ```bash
    mongosh
    ```

3.  **Switch to the YelpCamp database**
    ```javascript
    use yelp-camp
    ```

4.  **View Collections**
    ```javascript
    show collections
    ```
    You should see: `campgrounds`, `reviews`, `users`.

5.  **Query Data** (Example: Find all campgrounds)
    ```javascript
    db.campgrounds.find()
    ```

## Directory Structure

- `models/` - Mongoose schemas and models (Campground, Review, User)
- `routes/` - Express routings for campgrounds, reviews, and users
- `views/` - EJS templates for rendering pages
- `public/` - Static assets (CSS, JS, Images)
- `seeds/` - Database seeding scripts
- `utils/` - Helper functions and error handling classes

## License

This project is open source and available under the [ISC License](LICENSE).
