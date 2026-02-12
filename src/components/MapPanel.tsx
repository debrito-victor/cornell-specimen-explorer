import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useEffect, useMemo } from "react";
import type { SpecimenRecord } from "../lib/csv";
import { toNumber } from "../lib/filtering";

const MAX_MAP_POINTS_DESKTOP = 5000;
const MAX_MAP_POINTS_MOBILE = 1200;
const TOOLTIP_POINT_LIMIT = 1500;

type MapPanelProps = {
  rows: SpecimenRecord[];
  latColumn: string | null;
  lonColumn: string | null;
  scientificColumn: string | null;
  catalogColumn: string | null;
  localityColumn: string | null;
  onSelectRow: (row: SpecimenRecord) => void;
};

type Point = {
  lat: number;
  lon: number;
  scientific?: string;
  catalog?: string;
  locality?: string;
  row: SpecimenRecord;
};

function samplePoints(points: Point[], limit: number): Point[] {
  if (points.length <= limit) return points;

  const sampled: Point[] = [];
  const step = points.length / limit;

  for (let i = 0; i < limit; i += 1) {
    sampled.push(points[Math.floor(i * step)]);
  }

  return sampled;
}

function FitBounds({ points }: { points: Point[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    const bounds: [number, number][] = points.map((p) => [
      p.lat,
      p.lon,
    ]);

    map.fitBounds(bounds, {
      padding: [30, 30],
      maxZoom: 7,
    });
  }, [map, points]);

  return null;
}

export default function MapPanel({
  rows,
  latColumn,
  lonColumn,
  scientificColumn,
  catalogColumn,
  localityColumn,
  onSelectRow,
}: MapPanelProps) {
  const allPoints = useMemo<Point[]>(() => {
    if (!latColumn || !lonColumn) return [];

    const validPoints: Point[] = [];

    for (const row of rows) {
      const lat = toNumber(row[latColumn]);
      const lon = toNumber(row[lonColumn]);

      if (lat === null || lon === null) continue;

      validPoints.push({
        lat,
        lon,
        scientific: scientificColumn
          ? row[scientificColumn]
          : undefined,
        catalog: catalogColumn
          ? row[catalogColumn]
          : undefined,
        locality: localityColumn
          ? row[localityColumn]
          : undefined,
        row,
      });
    }

    return validPoints;
  }, [
    rows,
    latColumn,
    lonColumn,
    scientificColumn,
    catalogColumn,
    localityColumn,
  ]);

  const maxPoints = useMemo(() => {
    if (typeof window === "undefined") {
      return MAX_MAP_POINTS_DESKTOP;
    }

    return window.matchMedia("(max-width: 768px)").matches
      ? MAX_MAP_POINTS_MOBILE
      : MAX_MAP_POINTS_DESKTOP;
  }, []);

  const points = useMemo(() => {
    return samplePoints(allPoints, maxPoints);
  }, [allPoints, maxPoints]);

  const pointsWereLimited = allPoints.length > points.length;
  const showTooltips = points.length <= TOOLTIP_POINT_LIMIT;

  const firstPoint = points[0];

  const center: [number, number] = firstPoint
    ? [firstPoint.lat, firstPoint.lon]
    : [42.4534, -76.4735];

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">
            Specimen Map
          </p>
          <p className="text-sm text-slate-600">
            Georeferenced records update with filters.
          </p>
        </div>
        <span className="badge">
          {points.length} of {allPoints.length} points
        </span>
      </div>

      {pointsWereLimited && (
        <p className="mt-2 text-xs text-slate-600">
          Showing a sampled subset on the map to improve mobile stability.
        </p>
      )}

      <div className="mt-4 h-[520px] overflow-hidden rounded-2xl border border-sky-200">
        <MapContainer
          center={center}
          zoom={5}
          preferCanvas
          className="h-full w-full"
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {points.map((point, index) => (
            <CircleMarker
              key={`${point.lat}-${point.lon}-${index}`}
              center={[point.lat, point.lon]}
              radius={6}
              pathOptions={{
                color: "#E31B23",
                fillColor: "#FF8080",
                fillOpacity: 0.8,
              }}
              eventHandlers={{
                click: () => onSelectRow(point.row),
              }}
            >
              {showTooltips && (
                <Tooltip
                  direction="top"
                  offset={[0, -8]}
                  opacity={1}
                >
                  <div className="text-xs">
                    <div className="font-semibold">
                      {point.scientific || "Unknown species"}
                    </div>
                    <div>
                      Catalog: {point.catalog || "N/A"}
                    </div>
                    <div>
                      {point.locality ||
                        "Locality not provided"}
                    </div>
                  </div>
                </Tooltip>
              )}
            </CircleMarker>
          ))}

          <FitBounds points={points} />
        </MapContainer>
      </div>
    </div>
  );
}
