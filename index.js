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

export { userRegistration, userLogin, getUserBlogs, searchBlog };
