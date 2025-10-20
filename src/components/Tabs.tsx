import { useState } from "react";
import styles from "./Tabs.module.css";
import Videos from "./Videos"
import Feed from "./Feed"

const enum ActiveTab {
  Videos,
  Feed
}

export default function Tabs() {
  const [activeTab, setTab] = useState<ActiveTab>(ActiveTab.Feed);

  return (
    <div className={styles.tab_container}>
      <div className={styles.content_radio_container}>
        <div className={activeTab == ActiveTab.Videos ? styles.content_radio_active : styles.content_radio} onClick={() => setTab(ActiveTab.Videos)}>Videos</div>
        <div className={activeTab == ActiveTab.Feed ? styles.content_radio_active : styles.content_radio} onClick={() => setTab(ActiveTab.Feed)}>Feed</div>
      </div>
      <div className={styles.content_main}>
        {(activeTab == ActiveTab.Videos) && <Videos />}
        {(activeTab == ActiveTab.Feed) && <Feed />}
      </div>
    </div>
  );
}