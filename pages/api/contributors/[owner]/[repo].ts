import { NextApiRequest, NextApiResponse } from "next";
import { getRepoContributors } from "../../../../util/repo";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { owner, repo },
  } = req;
  if (typeof owner === "string" && typeof repo === "string") {
    getRepoContributors(owner, repo).then((repo) =>
      repo != null ? res.status(200).json(repo) : res.status(202).end()
    );
  } else {
    res.status(400).end();
  }
};
