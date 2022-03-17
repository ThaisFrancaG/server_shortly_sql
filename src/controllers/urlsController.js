import { connection } from "../database.js";

export async function postUrl(req, res) {
  try {
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "");
    const { url } = req.body;
    if (!url) {
      return res.sendStatus(422);
    }
    let urlCode = parseInt(Math.random() * (999999 - 111111));

    let shortUrl = `srtly${urlCode}`;

    let userId = await connection.query(
      `
        SELECT "userId" FROM sessions WHERE token=$1
        `,
      [token]
    );

    await connection.query(
      `
        INSERT INTO
        urls("shortUrl",url,"userId")
        VALUES ($1,$2,$3)
        `,
      [shortUrl, url, userId.rows[0].userId]
    );
    res.status(201).send(shortUrl);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUrl(req, res) {
  try {
    const { shortUrl } = req.params;

    let checkUrl = await connection.query(
      `
        SELECT * FROM urls WHERE "shortUrl"=$1;
        `,
      [`srtly${shortUrl}`]
    );

    if (checkUrl.rows.length === 0) {
      return res.sendStatus(404);
    }
    res.status(200).send(checkUrl.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deleteUrl(req, res) {
  try {
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "");

    const { id } = req.params;

    let checkUrlId = await connection.query(
      `
        SELECT * FROM urls WHERE id=$1
        `,
      [id]
    );
    if (checkUrlId.rows.length === 0) {
      return res.sendStatus(404);
    }
    let currentUserId = await connection.query(
      `
        SELECT "userId" FROM sessions WHERE token=$1
        `,
      [token]
    );
    let urlUserId = await connection.query(
      `
        SELECT "userId" FROM urls WHERE id=$1
        `,
      [id]
    );

    if (urlUserId.rows[0].userId !== currentUserId.rows[0].userId) {
      return res.sendStatus(401);
    }

    await connection.query(
      `
        DELETE from urls WHERE id=$1`,
      [id]
    );

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
