import { Octokit } from "@octokit/rest";
import { nanoid } from "nanoid";
import { db } from "../../util/db";
import type { NextApiRequest, NextApiResponse } from "next";

async function process(
  owner: string,
  repo: string,
  color: string
): Promise<string> {
  try {
    const id = nanoid(10);
    console.log(`Creating ${color} shortlink ${id} for ${owner}/${repo}`);
    const res = await db.query(
      "INSERT INTO cards(shortcode, owner, repo, color) VALUES($1, $2, $3, $4) RETURNING *",
      [id, owner, repo, color]
    );
    console.log(`Result of INSERT query: ${res}`);
    return res.rows[0].shortcode;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
      try {
        // check if the repository exists.
        // if the GitHub API returns anything other than 200,
        // this call will throw an error
        const _ = await octokit.repos.get({ owner, repo });
        const shorturl = await process(owner, repo, color);
        res.status(200).json(shorturl);
      } catch (e) {
        res
          .status(404)
          .json(
            "Repository not found. Please make sure you submit an existing GitHub public repository"
          );
      }
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.status(400).end();
  }
};
