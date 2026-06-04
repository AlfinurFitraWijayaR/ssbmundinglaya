"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface StudentDemographicChartProps {
  data: {
    year: string;
    count: number;
  }[];
}

export default function StudentDemographicChart({
  data,
}: StudentDemographicChartProps) {
  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#71717a" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#71717a" }}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: any) => [`${value} Siswa`, "Jumlah"]}
          />
          <Bar
            dataKey="count"
            fill="var(--color-brand-gold)"
            radius={[4, 4, 0, 0]}
            barSize={30}
            // Tambahkan animasi atau gaya khusus jika perlu
            style={{
              filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))",
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
