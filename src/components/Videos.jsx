import { useEffect, useState } from "react";
import styles from "./Videos.module.css";

export default function Videos() {
  const ENDPOINT_URL = "https://videos.goingfunctional.com/videos/v1/latest";
  const [items, setItems] = useState([]);
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
    <div style={{ paddingBottom: "1rem", height: "100%", width: "100%" }}>
      {items.map((it) => (
        <div key={it.id} >
          <h3>{it.title}</h3>
          <iframe
            className={styles.frameContainer}
            src={it.embed_url}
            loading="lazy"
            allowFullScreen
            title={it.title}
          />
        </div>
      ))}
    </div>
  );
}