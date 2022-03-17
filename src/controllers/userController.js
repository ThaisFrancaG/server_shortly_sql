import bcrypt from "bcrypt";
import { connection } from "../database.js";

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await connection.query(
      "SELECT * FROM users WHERE email=$1",
      [user.email]
    );
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await connection.query(
      `
      INSERT INTO 
        users(name, email, password) 
      VALUES ($1, $2, $3)
    `,
      [user.name, user.email, passwordHash]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUser(req, res) {
  const { user } = res.locals;
  const shortenedUrls = [];
  const finalUser = { ...user, shortenedUrls: shortenedUrls };
  console.log(finalUser);
  console.log("CHAMOU AQUI");
  console.log("CHAMOU AQUI");

  console.log(user);
  try {
    res.send(finalUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
