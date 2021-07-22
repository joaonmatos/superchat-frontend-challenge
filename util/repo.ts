import { Octokit } from "@octokit/rest";
import { RepoOwner, Repository } from "../interfaces";

export async function getRepoInformation(
  owner: string,
  name: string
): Promise<Repository> {
  const octokit = new Octokit();

  const information = await octokit.repos.get({ owner, repo: name });

  // select an avatar image to use. first priority is github avatar
  // second is the gravatar. lastly there is a default internal avatar
  const { avatar_url, gravatar_id } = information.data.owner;
  const avatar =
    avatar_url != ""
      ? avatar_url
      : gravatar_id != ""
      ? `https://www.gravatar.com/avatar/${gravatar_id}` // from the gravatar documentation
      : "/identicon.png";

  const stars = information.data.stargazers_count;
  const ownerInfo: RepoOwner = { id: owner, avatar };

  return {
    name,
    owner: ownerInfo,
    stars,
    topContributors: null,
  };
}

/**
 * Resolves into the list of up to 10 contributors that contributed the most.
 * The list is sorted from biggest to smallest contributor
 * TODO deal with 4xx and 5xx errors
 * @param owner The owner of the github.com repository
 * @param repo The name of the repository
 */
export async function getRepoContributors(
  owner: string,
  repo: string
): Promise<string[]> {
  const octokit = new Octokit();
  try {
    const request = await octokit.repos.getContributorsStats({ owner, repo });
    if (request.status == 200) {
      return request.data
        .sort((a, b) => b.total - a.total)
        .map((contribution) => contribution.author.login)
        .slice(0, 10);
    } else return null;
  } catch (e) {
    return null;
  }
}
