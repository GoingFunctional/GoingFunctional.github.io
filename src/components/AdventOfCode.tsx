import { useEffect, useState } from "react";
import styles from "./AdventOfCode.module.css";

type Profile = {
  name: string | null;
  login: string;
  location: string | null;
  bio: string | null;
  profile_url: string;
  profile_pic_url: string | null;
  solutions: Solution[] | null;
};

type GhProfile = {
  name: string | null,
  login: string,
  location: string | null,
  bio: string | null,
  html_url: string,
  avatar_url: string | null,
}

type GhProfiles = {
  profiles: GhProfile[]
}

type Solution = {
  day: number;
  writeUp: string | null;
  solution1: string | null;
  solution2: string | null;
}

type User = {
  userName: string;
  solutions: Solution[];
}

//function toRawGithubUrl(url: string | null) {
//  if (url === null || url === undefined) return null;
//  return url
//    .replace("https://github.com/", "https://raw.githubusercontent.com/")
//    .replace("/blob/", "/");
//}

const USER_URL = "https://raw.githubusercontent.com/GoingFunctional/AdventOfCode2025/refs/heads/main/solutions.json";
const PROFILE_BASE_URL = "https://api.goingfunctional.com/gh-profiles/v1/";
export default function Profiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(USER_URL);
        var fixed = [];
        if (!r.ok) return;
        const data = await r.json();
        fixed = data.user ?? [];
      } catch (e) { console.log(e) }
      setUsers(fixed);
    })();
  }, [USER_URL]);

  useEffect(() => {
    (async () => {
      if (users.length === 0) return;
      let names = users.map((u) => u.userName);
      const fetched = async () => {
        try {
          const r = await fetch((PROFILE_BASE_URL + "?names=" + names));
          if (!r.ok) return null;
          return await r.json() as GhProfiles;
        } catch (e) { console.log(e) }
      };

      let result = await fetched();
      if (!result) return;

      setProfiles(result.profiles.map((p) => {
        const user = users.find((u) => u.userName === p.login);
        const solutions: Solution[] = user?.solutions ?? [];
        return {
          name: p.name,
          login: p.login,
          location: p.location,
          bio: p.bio,
          profile_url: p.html_url,
          profile_pic_url: p.avatar_url,
          solutions,
        } as Profile;
      }));
    })();
  }, [users]);

  return (
    <div className={styles.container}>
      {profiles.map((it) => (
        <div className={styles.content_container} key={it.login} >
          <div className={styles.content_header}>
            <div className={styles.header_container}>
              <div className={styles.header_avatar_container}>
                <a href={it.profile_url} target="_blank" rel="noopener noreferrer">
                  <img className={styles.avatar} alt={it.login} src={it.profile_pic_url ?? "user-question.svg"}></img>
                </a>
              </div>
              <div className={styles.header_info}>
                <a href={it.profile_url} target="_blank" rel="noopener noreferrer"><h2>{it.name != null && it.name + " "}{it.name != null && "("}<span className={styles.login}>{it.login}</span>{it.name && ")"}</h2></a>
                <h3>{it.location}</h3>
                <div className={styles.bio}>{it.bio}</div>
              </div>
            </div>
          </div>
          <div className={styles.content_wrap} >
            {(it.solutions == null || it.solutions.length == 0) && <div className={styles.solution_row} key="0"><div className={styles.no_solutions}>[No solutions uploaded yet]</div></div>}
            {it.solutions?.sort((a, b) => (a.day - b.day)).map((s) => (
              <div className={styles.solution_row} key={s.day}>
                <a href={"https://adventofcode.com/2025/day/" + s.day} target="_blank" rel="noopener noreferrer"><div className={styles.solution_day_header}><h2>Day: {s.day}</h2></div></a>
                {s.writeUp && <div className={styles.read_more}><a href={s.writeUp} target="_blank" rel="noopener noreferrer">Write-up</a></div>}
                {s.solution1 && <div className={styles.solution_content}><a href={s.solution1} target="_blank" rel="noopener noreferrer">Solution 1</a></div>}
                {s.solution2 && <div className={styles.solution_content}><a href={s.solution2} target="_blank" rel="noopener noreferrer">Solution 2</a></div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
