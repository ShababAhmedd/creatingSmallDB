import {
  userRegistration,
  userLogin,
  getUserBlogs,
  searchBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  allBlog,
  allUsers,
  allUserBlogs,
  updateUserStatus,
  deleteUser,
} from "./index.js";
import { closeDB, initDB } from "./db.js";
import readline from "readline";

await initDB();

console.log("Welcome to blogDB!");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function adminMenu(loggedInUser) {
  let exit = false;

  while (!exit) {
    const choice = (
      await askQuestion(
        "\nAdmin Menu:\n1. View All Users\n2. View All Blogs\n3. Search Blog by ID/Title\n4. Update User\n5. Delete User\n6. Delete Blog\n7. Logout\n",
      )
    ).trim();

    if (choice == 1) {
      const users = await allUsers();
      users.forEach((user) => {
        console.log(
          `ID: ${user.id} - First Name: ${user.firstName} - Last Name: ${user.lastName} - Email: ${user.email} - Active: ${user.isActive} - Role: ${user.role}`,
        );
      });
    } else if (choice == 2) {
      const allBlogsList = await allUserBlogs();
      if (allBlogsList.length == 0) {
        console.log("No blogs are found");
      } else {
        allBlogsList.forEach((blog) => {
          console.log(
            `ID: ${blog.id} - Title: ${blog.blogTitle} - User ID: ${blog.userId}`,
          );
        });
      }
    } else if (choice == 3) {
      const searchTerm = (await askQuestion("Enter blog ID or title: ")).trim();
      const blog = await searchBlog(searchTerm);
      if (!blog) {
        console.log("No blog found");
      } else {
        console.log(
          `\nID: ${blog.id}\nTitle: ${blog.blogTitle}\nCategory: ${blog.category}\nContent: ${blog.blog}\nUser ID: ${blog.userId}`,
        );
      }
    } else if (choice == 4) {
      const userID = (await askQuestion("Enter user ID to update: ")).trim();
      const statusInput = (
        await askQuestion("Set isActive (true/false): ")
      ).trim();
      const isActive = statusInput === "true";
      const updated = await updateUserStatus(userID, isActive);

      if (updated) {
        console.log("User status updated successfully");
      }
    } else if (choice == 5) {
      const userID = (await askQuestion("Enter user ID to delete: ")).trim();
      const deleted = await deleteUser(userID);
      if (deleted) {
        console.log("User deleted successfully");
      }
    } else if (choice == 6) {
      const blogId = (await askQuestion("Enter blog ID to delete: ")).trim();
      const deleted = await deleteBlog(
        loggedInUser.id,
        loggedInUser.role,
        blogId,
      );
      if (deleted) {
        console.log("Blog deleted successfully");
      }
    } else if (choice == 7) {
      console.log("Logging out...");
      exit = true;
    } else {
      console.log("Invalid Option");
    }
  }
}

async function userMenu(loggedInUser) {
  let exit = false;

  while (!exit) {
    const choise = (
      await askQuestion(
        "\nUser Menu:\n1. View Your Blogs\n2. Search Blog by ID/Title\n3. Create Blog\n4. Update Blog\n5. Delete Blog\n6. Logout\n",
      )
    ).trim();

    if (choise == 1) {
      const userBlogs = await getUserBlogs(loggedInUser.id);
      if (userBlogs.length === 0) {
        console.log("No blogs are found");
      } else {
        console.log("\nYour Blogs: ");
        userBlogs.forEach((blog) => {
          console.log(`ID: ${blog.id} - ${blog.blogTitle}`);
        });
      }
    } else if (choise == 2) {
      const searchTerm = (await askQuestion("Enter blog ID or title: ")).trim();
      const blog = await searchBlog(searchTerm);
      if (!blog) {
        console.log("No blog found");
      } else {
        console.log(
          `\nID: ${blog.id}\nTitle: ${blog.blogTitle}\nCategory: ${blog.category}\nContent: ${blog.blog}`,
        );
      }
    } else if (choise == 3) {
      const blogTitle = await askQuestion("Enter the blog title: ");
      const blog = await askQuestion("Enter blog content: ");
      const category = await askQuestion("Enter blog category: ");
      await createBlog(loggedInUser.id, blogTitle, blog, category);
      console.log("Blog created successfully");
    } else if (choise == 4) {
      const blogId = (await askQuestion("Enter blog ID to update: ")).trim();
      const blogTitle = await askQuestion("Enter new blog title: ");
      const blog = await askQuestion("Enter new blog content: ");
      const category = await askQuestion("Enter new category: ");
      const updated = await updateBlog(
        loggedInUser.id,
        blogId,
        blogTitle,
        blog,
        category,
      );
      if (updated) {
        console.log("Blog updated successfully");
      }
    } else if (choise == 5) {
      const blogId = (await askQuestion("Enter blog ID to delete: ")).trim();
      const deleted = await deleteBlog(
        loggedInUser.id,
        loggedInUser.role,
        blogId,
      );
      if (deleted) {
        console.log("Blog deleted successfully");
      }
    } else if (choise == 6) {
      console.log("Logging out...");
      exit = true;
    } else {
      console.log("Invalid Option");
    }
  }
}

async function main() {
  const option = (
    await askQuestion(
      "Please select one of the following options:\n1. View All Blogs\n2. Login\n3. Register\n(Make sure you only enter the option number)\n",
    )
  ).trim();

  if (option == 1) {
    const blogList = await allBlog();

    if (blogList.length === 0) {
      console.log("No blogs are found");
    } else {
      console.log("\nAll Blogs");
      blogList.forEach((blog) => {
        console.log(`ID: ${blog.id} - Title: ${blog.blogTitle}`);
      });
    }
  } else if (option == 2) {
    const email = await askQuestion("Please enter your email: ");
    const password = await askQuestion("Please enter your password: ");
    const login = await userLogin(email, password);
    if (login) {
      console.log(`Welcome back, ${login.firstName}!`);
      console.log(`Role: ${login.role}`);
      if (login.role == "admin") {
        await adminMenu(login);
      } else {
        await userMenu(login);
      }
    }
  } else if (option == 3) {
    const firstName = await askQuestion("Enter your first name: ");
    const lastName = await askQuestion("Enter your last name: ");
    const email = await askQuestion("Enter your email: ");
    const password = await askQuestion("Enter your password: ");

    const newUser = await userRegistration(
      firstName,
      lastName,
      email,
      password,
    );
    if (newUser) {
      console.log("New User created.");
    }
  } else {
    console.log("Invalid Option");
  }

  rl.close();
  await closeDB();
}

await main();
