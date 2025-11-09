import { useEffect, useState } from "react";
import styles from "./AdventOfCode.module.css";

type Profile = {
  id: number;
  name: string;
  location: string | null;
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
            const r = await fetch(PROFILE_BASE_URL + u.userName);
            if (!r.ok) return null;
            const d = await r.json();
            return {
              id: d.id,
              name: d.name ?? d.login,
              location: d.location,
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
    <div className={styles.container} style={{ paddingBottom: "1rem", height: "100%", width: "100%" }}>
      {profiles.map((it) => (
        <div className={styles.content_container} key={it.id} >
          <div className={styles.content_header}>
            <h3>{it.name}</h3>
            <h2>{it.location}</h2>
            <img className={styles.avatar} alt={it.name} src={it.profile_pic_url ?? "adabeat_logo.png"}></img>
          </div>
          <div className={styles.content_main}>
            {it.solutions?.sort((a, b) => (a.day - b.day)).map((s) => (
              <div key={s.day}>
                <div>Day: {s.day}</div>
                {s.writeUp && <div><a href={s.writeUp} >Read more</a></div>}
                {s.solution1 && <div><a href={s.solution1} >Solution 1</a></div>}
                {s.solution2 && <div><a href={s.solution2} >Solution 2</a></div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}