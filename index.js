import { where } from "sequelize";
import { user } from "./db.js";

export async function userRegistration(
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
