import { connection } from "../database.js";

export async function postUrl(req, res) {
  try {
    const { url } = req.body;
    if (!url) {
      return res.sendStatus(422);
    }
    let urlCode = Date.now();
    let shortUrl = `srtly${urlCode}`;

    await connection.query(
      `
        INSERT INTO 
        urls("shortUrl",url)
        VALUES ($1,$2)
        `,
      [shortUrl, url]
    );
    res.status(201).send(shortUrl);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
