import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function CPUPie({ value }) {
  const data = [
    { name: 'Used', value: Number(value) },
    { name: 'Free', value: Math.max(0, 100 - Number(value)) }
  ];
  const COLORS = ['#7c3aed', '#0f172a'];

  return (
    <div>
      <h3 className="font-semibold mb-2">CPU Usage</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80} innerRadius={50} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => `${val.toFixed(1)}%`} />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center text-2xl font-bold">{Number(value).toFixed(1)}%</div>
    </div>
  );
}
