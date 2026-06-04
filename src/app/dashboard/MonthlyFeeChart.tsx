"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface MonthlyFeeChartProps {
  data: {
    month: string;
    amount: number;
  }[];
}

export default function MonthlyFeeChart({ data }: MonthlyFeeChartProps) {
  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-brand-gold)"
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor="var(--color-brand-gold)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#71717a" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#71717a" }}
            tickFormatter={(value: any) => `Rp ${(Number(value || 0) / 1000)}k`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: any) => [
              `Rp ${Number(value || 0).toLocaleString("id-ID")}`,
              "Total",
            ]}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="var(--color-brand-gold)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorAmount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
