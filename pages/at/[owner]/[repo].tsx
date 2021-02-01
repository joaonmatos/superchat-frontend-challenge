import { GetServerSideProps } from "next";
import { useState } from "react";
import GitHubCard from "../../../components/GitHubCard";
import { Repository } from "../../../interfaces";
import { getRepoInformation } from "../../../util/repo";
import bg from "../../../styles/Background.module.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { owner, repo } = context.query;
  if (typeof owner !== "string") {
    owner = owner[0];
  }
  if (typeof repo !== "string") {
    repo = repo[0];
  }

  const repository = await getRepoInformation(owner, repo);
  return {
    props: {
      repository,
    },
  };
};

type RepoPageProps = { repository: Repository };

export default function RepoPage({ repository }: RepoPageProps) {
  const { name, owner } = repository;
  const [contributors, setContributors] = useState(null);

  if (contributors === null) {
    (async () => {
      let req = await fetch(`/api/contributors/${owner.id}/${name}`);
      while (req.status != 200) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        req = await fetch(`/api/contributors/${owner.id}/${name}`);
      }
      setContributors(await req.json());
    })();
  }

  return (
    <div className={bg["bg-layout"] + " " + bg["bg-default"]}>
      <GitHubCard
        repository={{
          ...repository,
          topContributors: contributors,
        }}
      />
    </div>
  );
}
