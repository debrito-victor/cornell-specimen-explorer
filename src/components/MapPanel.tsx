import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import type { SpecimenRecord } from "../lib/csv";
import { toNumber } from "../lib/filtering";

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

function FitBounds({ points }: { points: Point[] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    const bounds = points.map((point) => [point.lat, point.lon]) as [number, number][];
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 7 });
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
  const points = useMemo(() => {
    if (!latColumn || !lonColumn) return [];
    return rows
      .map((row) => {
        const lat = toNumber(row[latColumn]);
        const lon = toNumber(row[lonColumn]);
        if (lat === null || lon === null) return null;
        return {
          lat,
          lon,
          scientific: scientificColumn ? row[scientificColumn] : undefined,
          catalog: catalogColumn ? row[catalogColumn] : undefined,
          locality: localityColumn ? row[localityColumn] : undefined,
          row,
        };
      })
      .filter((point): point is Point => point !== null);
  }, [rows, latColumn, lonColumn, scientificColumn, catalogColumn, localityColumn]);

  const center = points.length ? [points[0].lat, points[0].lon] : [42.4534, -76.4735];

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Specimen Map</p>
          <p className="text-sm text-slate-600">Georeferenced records update with filters.</p>
        </div>
        <span className="badge">{points.length} points</span>
      </div>

      <div className="mt-4 h-[520px] overflow-hidden rounded-2xl border border-sky-200">
        <MapContainer center={center as [number, number]} zoom={5} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((point, index) => (
            <CircleMarker
              key={`${point.lat}-${point.lon}-${index}`}
              center={[point.lat, point.lon]}
              radius={6}
              pathOptions={{ color: "#E31B23", fillColor: "#FF8080", fillOpacity: 0.8 }}
              eventHandlers={{
                click: () => onSelectRow(point.row),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <div className="text-xs">
                  <div className="font-semibold">{point.scientific || "Unknown species"}</div>
                  <div>Catalog: {point.catalog || "N/A"}</div>
                  <div>{point.locality || "Locality not provided"}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
          <FitBounds points={points} />
        </MapContainer>
      </div>
    </div>
  );
}
