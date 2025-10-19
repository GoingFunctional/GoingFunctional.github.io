import { useEffect, useState } from "react";
import styles from "./Tabs.module.css";
import Videos from "./Videos"
import Feed from "./Feed"

export default function Tabs() {
  //const [items, setItems] = useState([]);

  return (
    <div style={{ paddingBottom: "1rem", height: "100%", width: "100%" }}>
      {/* <Videos /> */}
      <Feed />
    </div>
  );
}