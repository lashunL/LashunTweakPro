import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function RamBar({ used, total, percent }) {
  const data = [{ name: 'RAM', used: Number(used), free: Math.max(0, Number(total) - Number(used)) }];
  return (
    <div>
      <h3 className="font-semibold mb-2">Memory Usage</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" hide domain={[0, Number(total)]} />
          <Tooltip formatter={(value) => `${value.toFixed(2)} GB`} />
          <Bar dataKey="used" stackId="a" fill="#7c3aed" radius={[0, 10, 10, 0]} />
          <Bar dataKey="free" stackId="a" fill="#1e293b" radius={[10, 0, 0, 10]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-sm text-slate-300">
        <span>{used.toFixed(2)} GB used</span>
        <span>{percent.toFixed(1)}%</span>
        <span>{total.toFixed(2)} GB total</span>
      </div>
    </div>
  );
}
