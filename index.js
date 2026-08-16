import { where } from "sequelize";
import { user, blogs } from "./db.js";
import { Op } from "sequelize";

async function userRegistration(
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
) {
  const existing = await user.findOne({ where: { email } });
  if (existing) {
    console.log("User already exists");
    return null;
  }
  const newUser = await user.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
  });
  return newUser;
}

async function userLogin(email, password) {
  const existing = await user.findOne({ where: { email } });

  if (!existing) {
    console.log("Invalid email or password");
    return null;
  }

  if (!existing.isActive) {
    console.log("User is deactivated");
    return null;
  }

  if (existing.password !== password) {
    console.log("Invalid email or password");
    return null;
  }

  return existing;
}

async function getUserBlogs(userId) {
  const userBlogs = await blogs.findAll({ where: { userId } });
  return userBlogs;
}

async function searchBlog(searchTerm) {
  const blog = await blogs.findOne({
    where: {
      [Op.or]: [{ id: searchTerm }, { blogTitle: searchTerm }],
    },
  });
  return blog;
}

async function createBlog(userId, blogTitle, blog, category) {
  const newBlog = await blogs.create({ userId, blogTitle, blog, category });
  return newBlog;
}

async function updateBlog(userId, blogId, blogTitle, blog, category) {
  const existingBlog = await blogs.findOne({ where: { id: blogId } });

  if (!existingBlog) {
    console.log("blog not found");
    return null;
  }

  if (existingBlog.userId !== userId) {
    console.log("You are not authorized to update this blog");
    return null;
  }

  existingBlog.blogTitle = blogTitle;
  existingBlog.blog = blog;
  existingBlog.category = category;
  await existingBlog.save();

  return existingBlog;
}

async function deleteBlog(userId, blogId) {
  const existingBlog = await blogs.findOne({ where: { id: blogId } });

  if (!existingBlog) {
    console.log("Blog not found");
    return null;
  }

  if (existingBlog.userId !== userId) {
    console.log("You are not authorized to delete this blog");
    return null;
  }

  await existingBlog.destroy();
  return true;
}

export {
  userRegistration,
  userLogin,
  getUserBlogs,
  searchBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
