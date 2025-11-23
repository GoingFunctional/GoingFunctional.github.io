import { useEffect, useState } from "react";
import styles from "./Videos.module.css";

type VideoItem = {
  id: string | number;
  title: string;
  embed_url: string;
};

const ENDPOINT_URL = "https://api.goingfunctional.com/videos/v1/latest";
export default function Videos() {
  const [items, setItems] = useState<VideoItem[]>([]);
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
    <div className={styles.container}>
      {items.map((it) => (
        <div className={styles.content_container} key={it.id} >
          <div className={styles.content_header}>{it.title}</div>
          <div className={styles.content_main}>
            <iframe
              className={styles.frameContainer}
              src={it.embed_url}
              loading="lazy"
              allowFullScreen
              title={it.title}
            />
          </div>
        </div>
      ))}
    </div>
  );
}