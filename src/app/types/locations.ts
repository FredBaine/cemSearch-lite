export interface LocationGroup {
  section: string;
  lot: string;
  // Note: Document ID is used as the section-lot identifier (format: "${section}-${lot}")
  geoHash: string;
  coordinates?: {
    northEast: {
      lat: number;
      lng: number;
    };
    southWest: {
      lat: number;
      lng: number;
    };
  };
}
