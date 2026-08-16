import {
  userRegistration,
  userLogin,
  getUserBlogs,
  searchBlog,
  createBlog,
  updateBlog,
  deleteBlog,
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
      const deleted = await deleteBlog(loggedInUser.id, blogId);
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
    // View All Blogs - to be implemented later
  } else if (option == 2) {
    const email = await askQuestion("Please enter your email: ");
    const password = await askQuestion("Please enter your password: ");
    const login = await userLogin(email, password);
    if (login) {
      console.log(`Welcome back, ${login.firstName}!`);
      console.log(`Role: ${login.role}`);
      await userMenu(login);
    }
  } else if (option == 3) {
    const firstName = await askQuestion("Enter your first name: ");
    const lastName = await askQuestion("Enter your last name: ");
    const email = await askQuestion("Enter your email: ");
    const phone = await askQuestion("Enter your phone number: ");
    const password = await askQuestion("Enter your password: ");

    await userRegistration(firstName, lastName, email, phone, password);
  } else {
    console.log("Invalid Option");
  }

  rl.close();
  await closeDB();
}

await main();
