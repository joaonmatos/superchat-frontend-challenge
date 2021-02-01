import { GetStaticProps } from "next";
import Head from "next/head";
import GitHubCard from "../components/GitHubCard";
import { Repository } from "../interfaces";
import { testRepo } from "../util/test-data";

export default function Home(props: { repository: Repository }) {
  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 w-screen h-screen flex items-center justify-center">
      <Head>
        <title>Home Page / Cardy GH</title>
      </Head>
      <GitHubCard repository={props.repository} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async function () {
  return {
    props: {
      repository: testRepo,
    },
  };
};
