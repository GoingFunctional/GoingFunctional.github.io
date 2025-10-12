// scripts/extract-centers.js
import fs from "fs";
import path from "path";
import * as turf from "@turf/turf";

// Path to your GeoJSON file
const inputPath = path.resolve("public/data/municipalities.geojson");
const outputPath = path.resolve("public/data/municipality_centers.geojson");

// Read the file
const geojson = JSON.parse(fs.readFileSync(inputPath, "utf8"));

// Compute centroids
const centers = turf.featureCollection(
  geojson.features.map((feature) => {
    const center = turf.center(feature); // geometric center (centroid)
    center.properties = {
      name:
        feature.properties.KOM_NAMN ||
        feature.properties.shapeName ||
        "Unknown",
    };
    return center;
  })
);

// Save to new file
fs.writeFileSync(outputPath, JSON.stringify(centers, null, 2));
console.log(
  `✅ Extracted ${centers.features.length} centroids → ${outputPath}`
);

