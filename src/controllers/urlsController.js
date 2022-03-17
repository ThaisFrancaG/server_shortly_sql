import { connection } from "../database.js";

export async function postUrl(req, res) {
  try {
    const { url } = req.body;
    if (!url) {
      return res.sendStatus(422);
    }
    let urlCode = parseInt(Math.random() * (999999 - 111111));

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

export async function getUrl(req, res) {
  try {
    const { shortUrl } = req.params;

    let checkUrl = await connection.query(
      `
        SELECT * FROM urls WHERE "shortUrl"=$1;
        `,
      [`srtly${shortUrl}`]
    );

    console.log(checkUrl.rows);
    console.log(checkUrl.rows[0]);

    if (checkUrl.rows.length === 0) {
      return res.sendStatus(404);
    }
    res.status(200).send(checkUrl.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deleteUrl(req, res) {}
