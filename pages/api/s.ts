import { Octokit } from "@octokit/rest";
import { nanoid } from "nanoid";
import { db } from "../../util/db";
import type { NextApiRequest, NextApiResponse } from "next";

async function process(
  owner: string,
  repo: string,
  color: string
): Promise<string> {
  const id = nanoid(10);
  const res = await db.query(
    "INSERT INTO cards(shortcode, owner, repo, color) VALUES($1, $2, $3, $4) RETURNING *",
    [id, owner, repo, color]
  );
  return res.rows[0].shortcode;
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { owner, repo, color = "default" } = req.body || {};
      if (
        !owner ||
        typeof owner !== "string" ||
        !repo ||
        typeof repo !== "string" ||
        !color ||
        typeof color !== "string" ||
        !["red", "blue", "green", "default"].includes(color)
      ) {
        res.status(400).json("Invalid inputs.");
      }
      const octokit = new Octokit();
      octokit.repos.get({ owner, repo }).then((apiCall) => {
        switch (apiCall.status) {
          case 200:
            process(owner, repo, color)
              .then((shorturl) => res.status(200).json(shorturl))
              .catch(() => {
                res.status(404).json("Repository not found.");
              });
            break;
          default:
            res.status(404).json("Repository not found.");
        }
      });
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.status(400).end();
  }
};
