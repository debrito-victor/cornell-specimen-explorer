import { useMemo } from "react";
import type { SpecimenRecord } from "../lib/csv";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

type DashboardProps = {
  rows: SpecimenRecord[];
  speciesColumn: string | null;
  latColumn: string | null;
  lonColumn: string | null;
  groupColumn: string | null;
  yearColumn: string | null;
};

function uniqueCount(rows: SpecimenRecord[], column: string | null): number {
  if (!column) return 0;
  const set = new Set<string>();
  rows.forEach((row) => {
    const value = row[column];
    if (value) set.add(value);
  });
  return set.size;
}

const COLORS = ['#B31B1B', '#F7B538', '#006699', '#4A7729', '#9E2B25', '#D47500', '#073949', '#5F7C8A', '#A8201A', '#C85A17'];

export default function Dashboard({ rows, speciesColumn, latColumn, lonColumn, groupColumn, yearColumn }: DashboardProps) {
  const totalSpecimens = rows.length;
  const totalSpecies = uniqueCount(rows, speciesColumn);
  const geoCount = rows.filter((row) => row[latColumn ?? ""] && row[lonColumn ?? ""]).length;

  const groupCounts = useMemo(() => {
    if (!groupColumn) return [] as [string, number][];
    const counts = new Map<string, number>();
    rows.forEach((row) => {
      const value = row[groupColumn];
      if (!value) return;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [rows, groupColumn]);

  const pieChartData = useMemo(() => {
    return groupCounts.map(([name, value]) => ({ name, value }));
  }, [groupCounts]);

  const yearData = useMemo(() => {
    if (!yearColumn) return [];
    
    const yearCounts = new Map<number, number>();
    rows.forEach((row) => {
      const yearValue = row[yearColumn];
      if (!yearValue) return;
      
      const year = parseInt(String(yearValue).trim());
      if (isNaN(year) || year < 1800 || year > 2030) return;
      
      yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1);
    });

    const sortedYears = Array.from(yearCounts.entries())
      .sort((a, b) => a[0] - b[0]);

    let cumulative = 0;
    return sortedYears.map(([year, count]) => {
      cumulative += count;
      return { year, count: cumulative };
    });
  }, [rows, yearColumn]);

  return (
    <div className="space-y-6">
      <div className="card">
        <p className="text-xl font-semibold">Collection Numbers</p>
        <p className="text-sm text-white/60">
          A quick snapshot of the Cornell University Museum of Vertebrates fish collection.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Total specimens</p>
            <p className="mt-3 text-3xl font-semibold">{totalSpecimens.toLocaleString()}</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Total species</p>
            <p className="mt-3 text-3xl font-semibold">{totalSpecies.toLocaleString()}</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Georeferenced records</p>
            <p className="mt-3 text-3xl font-semibold">{geoCount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {groupCounts.length > 0 && (
        <div className="card">
          <p className="text-lg font-semibold">Families</p>
          <p className="text-sm text-white/60">
            Top families in the collection.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {groupCounts.map(([group, count], index) => (
              <div key={group} className="glass rounded-2xl p-5">
                <p className="text-sm font-semibold">{group}</p>
                <p className="mt-2 text-2xl font-semibold text-cornell-200">
                  {count.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {pieChartData.length > 0 && (
        <div className="card">
          <p className="text-lg font-semibold">Family Distribution</p>
          <p className="text-sm text-white/60">
            Proportion of specimens by family.
          </p>
          <div className="mt-6" style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {yearData.length > 0 && (
        <div className="card">
          <p className="text-lg font-semibold">Cumulative Specimens Collected by Year</p>
          <p className="text-sm text-white/60">
            Growth of the collection over time.
          </p>
          <div className="mt-6" style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="year" 
                  stroke="#fff"
                  tick={{ fill: '#fff' }}
                />
                <YAxis 
                  stroke="#fff"
                  tick={{ fill: '#fff' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#B31B1B" 
                  strokeWidth={2}
                  dot={false}
                  name="Total Specimens"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}