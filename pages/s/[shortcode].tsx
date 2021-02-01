import { GetServerSideProps } from "next";
import { useState } from "react";
import GitHubCard from "../../components/GitHubCard";
import { Repository } from "../../interfaces";
import { getRepoInformation } from "../../util/repo";
import bg from "../../styles/Background.module.css";
import { db } from "../../util/db";
import ErrorPage from "next/error";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { shortcode } = context.query;

  const query = await db.query("SELECT * FROM cards WHERE shortcode = $1", [
    shortcode,
  ]);

  if (query.rowCount == 0) {
    context.res.statusCode = 404;
    return { props: { err: 404 } };
  }

  const { owner, repo, color } = query.rows[0];

  const repository = await getRepoInformation(owner, repo);

  return {
    props: {
      repository,
      color,
    },
  };
};

type RepoPageProps = { repository: Repository; color: string; err: number };

export default function RepoPage({ repository, color, err }: RepoPageProps) {
  if (err) {
    return <ErrorPage statusCode={err} />;
  }
  const { name, owner } = repository;
  const [contributors, setContributors] = useState(null);

  if (contributors === null && process.browser) {
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
    <div className={bg["bg-layout"] + " " + bg["bg-" + color]}>
      <Head>
        <title>
          {owner.id}/{name} / Cardy GH
        </title>
      </Head>
      <GitHubCard
        repository={{
          ...repository,
          topContributors: contributors,
        }}
      />
    </div>
  );
}
