import { Repository } from "../interfaces";
import styles from "../styles/Card.module.css";
import Link from "next/link";

export default function GitHubCard(props: { repository: Repository }) {
  const { name, owner, stars, topContributors } = props.repository;
  const personUrl = `https://github.com/${owner.id}`;
  const repoUrl = `https://github.com/${owner.id}/${name}`;
  return (
    <div className={styles.card + " " + styles["gh-card"]}>
      <h1 className=" flex flex-col justify-center items-center text-center text-3xl hover:text-blue-600">
        <a href={repoUrl}>{name}</a>
      </h1>

      <p className="flex items-center justify-start px-10">
        <span className="text-gray-500 mr-2">by</span>
        <img
          src={owner.avatar}
          alt={`${owner.id}'s profile picture`}
          width={24}
          height={24}
          className="ml-2 mr-1 rounded-full"
        />
        <a className="mx-1" href={personUrl}>
          {owner.id}
        </a>
      </p>
      <p className="flex justify-between items-center px-10">
        <span className="flex items-center text-gray-500 text-sm">
          Stars:<span className="ml-2 text-blue-600 text-lg">{stars}</span>
        </span>

        <a
          href={repoUrl}
          className="border flex py-2 px-2 w-20 items-center rounded-md justify-around"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            stroke="currentColor"
            className="inline-block text-yellow-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          Star
        </a>
      </p>
      <div className="px-10 flex flex-col justify-start">
        <h2 className="mt-4 mb-2 text-2xl text-gray-500 text-center">
          Top Contributors
        </h2>
        {topContributors != null ? (
          <ol>
            {topContributors.map((contributor, i) => (
              <li key={i} className="my-2">
                <a href={`https://github.com/${contributor}`}>{contributor}</a>
              </li>
            ))}
          </ol>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <p className="text-center mt-2">
        Created with{" "}
        <Link href="/">
          <a className="italic text-gray-400">Cardy GH</a>
        </Link>
      </p>
    </div>
  );
}
