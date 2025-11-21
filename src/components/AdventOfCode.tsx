import { useEffect, useState } from "react";
import styles from "./AdventOfCode.module.css";

type Profile = {
  id: number;
  name: string | null;
  login: string;
  location: string | null;
  bio: string | null;
  profile_url: string;
  profile_pic_url: string | null;
  solutions: Solution[] | null;
};

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

function toRawGithubUrl(url: string | null) {
  if (url === null || url === undefined) return null;
  return url
    .replace("https://github.com/", "https://raw.githubusercontent.com/")
    .replace("/blob/", "/");
}

const USER_URL = "https://raw.githubusercontent.com/GoingFunctional/AdventOfCode2025/refs/heads/main/solutions.json";
const SOLUTION_BASE_URL = "https://api.github.com/users/";
const PROFILE_BASE_URL = "https://api.github.com/users/";
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
        //fixed = (data.user ?? []).map((it: User) => {
        //  it.solutions.map((s) => {
        //    return {
        //      ...s,
        //      writeUp: toRawGithubUrl(s.writeUp),
        //    } as Solution;
        //  })
        //})
      } catch (e) { console.log(e) }
      setUsers(fixed);
    })();
  }, [USER_URL]);

  useEffect(() => {
    (async () => {
      if (users.length === 0) return;

      const fetched = await Promise.all(
        users.map(async (u) => {
          try {
            const r = await fetch((PROFILE_BASE_URL + u.userName),
              {
                method: "GET",
                headers: {
                  "Authorization": "Bearer <add>"
                }
              });
            if (!r.ok) return null;
            const d = await r.json();
            return {
              id: d.id,
              name: d.name,
              login: d.login,
              location: d.location,
              bio: d.bio,
              profile_url: d.html_url,
              profile_pic_url: d.avatar_url,
              solutions: u.solutions,
            } as Profile;
          } catch (e) { console.log(e) }
        })
      );

      setProfiles(fetched.filter(Boolean) as Profile[]);
    })();
  }, [users]);

  return (
    <div className={styles.container}>
      {profiles.map((it) => (
        <div className={styles.content_container} key={it.id} >
          <div className={styles.content_header}>
            <div className={styles.header_container}>
              <div className={styles.header_avatar_container}>
                <a href={it.profile_url} >
                  <img className={styles.avatar} alt={it.login} src={it.profile_pic_url ?? "user-question.svg"}></img>
                </a>
              </div>
              <div className={styles.header_info}>
                <a href={it.profile_url}><h2>{it.name != null && it.name + " "}{it.name != null && "("}<span className={styles.login}>{it.login}</span>{it.name && ")"}</h2></a>
                <h3>{it.location}</h3>
                <div className={styles.bio}>{it.bio}</div>
              </div>
            </div>
          </div>
          <div className={styles.content_wrap} >
            {(it.solutions == null || it.solutions.length == 0) && <div className={styles.solution_row} key="0"><div className={styles.no_solutions}>[No solutions uploaded yet]</div></div>}
            {it.solutions?.sort((a, b) => (a.day - b.day)).map((s) => (
              <div className={styles.solution_row} key={s.day}>
                <a href={"https://adventofcode.com/2024/day/" + s.day} ><div className={styles.solution_day_header}><h2>Day: {s.day}</h2></div></a>
                {s.writeUp && <div className={styles.read_more}><a href={s.writeUp} >Write-up</a></div>}
                {s.solution1 && <div className={styles.solution_content}><a href={s.solution1} >Solution 1</a></div>}
                {s.solution2 && <div className={styles.solution_content}><a href={s.solution2} >Solution 2</a></div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}