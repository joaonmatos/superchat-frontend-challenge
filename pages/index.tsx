import Head from "next/head";
import bg from "../styles/Background.module.css";
import card from "../styles/Card.module.css";
import { useState } from "react";
import Link from "next/link";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      rootUrl: process.env.CANONICAL_ROOT,
    },
  };
};

export default function Home({ rootUrl }) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [processing, setProcessing] = useState(false);

  const [color, setColor] = useState("blue");

  const [result, setResult] = useState(false as string | boolean);

  const onSubmit = async () => {
    setProcessing(true);
    setResult(false);
    const post = await fetch("/api/s/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner,
        repo,
        color,
      }),
    });
    if (post.status == 200) {
      setProcessing(false);
      setResult(`${window.location.origin}/s/${await post.text()}`);
    } else {
      setProcessing(false);
      alert(`Error ${post.status}: ${await post.text()}`);
    }
  };

  return (
    <div className={`${bg["bg-layout"]} ${bg["bg-" + color]}`}>
      <Head>
        <title>Home Page - Cardy GH</title>
        <meta property="og:title" content="Home Page" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://${rootUrl}/`} />
        <meta property="og:image" content={`https://${rootUrl}/og-thumb.png`} />
        <meta property="og:description" content="Home page for Cardy GH" />
        <meta property="og:site_name" content="Cardy GH" />
      </Head>
      <div
        className={`${card.card} flex flex-col justify-start items-center py-4`}
      >
        <h1 className="text-4xl text-gray-700 my-8">Cardy GH</h1>
        <HomeForm
          owner={owner}
          setOwner={setOwner}
          repo={repo}
          setRepo={setRepo}
          processing={processing}
          onSubmit={onSubmit}
          setColor={setColor}
        />
        {typeof result === "string" ? (
          <>
            <h2 className="text-2xl mb-3">Result</h2>
            <Link href={result}>
              <a
                className={`px-4 text-center whitespace-nowrap overflow-ellipsis overflow-hidden max-w-full`}
              >
                {result}
              </a>
            </Link>
            <button
              className="mt-3 py-1 px-3 border-gray-600 border rounded-lg bg-white text-gray-700"
              onClick={() => {
                navigator.clipboard.writeText(result);
              }}
            >
              Copy to Clipboard
            </button>
          </>
        ) : (
          <> </>
        )}
      </div>
    </div>
  );
}

function HomeForm({
  owner,
  setOwner,
  repo,
  setRepo,
  processing,
  onSubmit,
  setColor,
}) {
  return (
    <form
      className="flex flex-col mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <p className="italic font-medium my-4">
        Create a card for your GitHub repository
      </p>
      <label className="mt-3" htmlFor="owner">
        Repository Owner
        <br />
        <input
          name="owner"
          type="text"
          id="owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          required
          disabled={processing}
          className="mt-2 border w-full border-gray-400 rounded text-lg px-2 hover:border-gray-600 focus:border-gray-600"
        />
      </label>
      <label className="my-3" htmlFor="repo">
        Repository Name
        <br />
        <input
          name="repo"
          id="repo"
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          required
          disabled={processing}
          className="my-2 border w-full border-gray-400 rounded text-lg px-2 hover:border-gray-600 focus:border-gray-600"
        />
      </label>
      <div className="flex py-4 w-full justify-around">
        <input
          type="radio"
          name="color"
          id="color-red"
          value="red"
          alt="Red background for page"
          onChange={() => setColor("red")}
        />
        <label
          htmlFor="color-red"
          className={`rounded-full w-12 h-12 ${bg["bg-red"]}`}
        ></label>
        <input
          type="radio"
          name="color"
          id="color-green"
          value="green"
          alt="Green background for page"
          onChange={() => setColor("green")}
        />
        <label
          htmlFor="color-green"
          className={`rounded-full w-12 h-12 ${bg["bg-green"]}`}
        ></label>
        <input
          type="radio"
          name="color"
          id="color-blue"
          value="blue"
          defaultChecked
          alt="Blue background for page"
          onChange={() => setColor("blue")}
        />
        <label
          htmlFor="color-blue"
          className={`rounded-full w-12 h-12 ${bg["bg-blue"]}`}
        ></label>
      </div>
      <input
        type="submit"
        disabled={processing}
        value={processing ? "Processing..." : "Create"}
        className="mt-3 py-2 border-gray-600 border rounded-lg bg-white text-gray-700 text-l"
      />
    </form>
  );
}
