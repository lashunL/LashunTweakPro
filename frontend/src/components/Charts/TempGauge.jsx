import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export default function TempGauge({ temp }) {
  const safeTemp = Math.max(0, Number(temp));
  const data = [{ name: 'Temp', value: safeTemp, fill: safeTemp > 80 ? '#ef4444' : '#22c55e' }];
  return (
    <div>
      <h3 className="font-semibold mb-2">Average Temp (°C)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={180} endAngle={0}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="text-center text-2xl font-bold">{safeTemp.toFixed(1)}°C</div>
    </div>
  );
}
