# BlogDB

A console-based blog management application built with Node.js and MySQL. Users can register, log in, and manage their own blogs, while admins can manage all users and blogs across the system.

## Features

- View all blogs without logging in
- User registration and login
- Users can create, view, update, and delete their own blogs
- Search for a blog by ID or title
- Admins can view all users/blogs, update a user's active status, and delete any user or blog
- Deactivated users (`isActive: false`) are blocked from logging in

## Technologies Used

- [Node.js](https://nodejs.org/)
- JavaScript (ES Modules)
- [MySQL](https://www.mysql.com/)
- [Sequelize](https://sequelize.org/) (ORM)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Prerequisites

- Node.js installed
- A running MySQL server

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/ShababAhmedd/creatingSmallDB.git
   cd creatingSmallDB
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root by copying the provided example, then fill in your database credentials:

   ```bash
   cp .env.example .env
   ```

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=blogdb
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   ```

   Make sure the database (e.g. `blogdb`) exists in your MySQL server before running the app. The `users` and `blogs` tables are created automatically on startup.

## Running the Project

```bash
node main.js
```

Follow the on-screen prompts to view blogs, register, or log in. After logging in, a `user` sees their personal blog menu while an `admin` sees the admin management menu.

> Note: New accounts are created with the `user` role by default. To grant admin access, manually update a user's `role` column to `admin` in the database.
