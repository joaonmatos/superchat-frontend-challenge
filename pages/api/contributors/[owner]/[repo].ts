import { NextApiRequest, NextApiResponse } from "next";
import { getRepoContributors } from "../../../../util/repo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { owner, repo },
  } = req;
  if (typeof owner === "string" && typeof repo === "string") {
    const repoInformation = await getRepoContributors(owner, repo);
    if (repoInformation === null) {
      res.status(202).end();
    } else {
      res.status(200).json(repoInformation);
    }
  } else {
    res.status(400).end();
  }
};
