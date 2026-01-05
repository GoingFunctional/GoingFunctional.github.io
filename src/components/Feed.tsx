import { useEffect, useState } from "react";
import styles from "./Feed.module.css";

type FeedItem = {
  author: string;
  title: string;
  url: string;
  published_at: Date;
  excerpt: string;
};

const ENDPOINT_URL = "https://api.goingfunctional.com/feed/v1/";

function month_num_to_name(num: number): string {
  switch (num) {
    case 0: return "Jan";
    case 1: return "Feb";
    case 2: return "Mar";
    case 3: return "Apr";
    case 4: return "May";
    case 5: return "Jun";
    case 6: return "Jul";
    case 7: return "Aug";
    case 8: return "Sep";
    case 9: return "Oct";
    case 10: return "Nov";
    case 11: return "Dec";
    default: return "";
  }
}

export default function Feed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(ENDPOINT_URL);
        if (!r.ok) return;
        const data = await r.json();
        setItems(data.items ?? []);
      } catch { }
    })();
  }, [ENDPOINT_URL]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {items.map((it) => (
        <div className={styles.card} key={it.url}>
          <div className={styles.date_field}>
            <div className={styles.day_of_month}>{new Date(it.published_at).getDate()}</div>
            <div className={styles.month}>{month_num_to_name(new Date(it.published_at).getMonth())}</div>
          </div>
          <div className={styles.card_top_row} onClick={() => window.open(it.url, "_blank")}>
            <div className={styles.card_top_row_container} >
              <div className={styles.card_header}>{it.title}</div>
              <img className={styles.icon} src="adabeat_logo.png" />
            </div>
          </div>
          <div className={styles.card_main}>
            <div>{it.excerpt}</div>
            {it.author && <div className={styles.author}>- {it.author}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}