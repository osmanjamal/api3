// src/components/dashboard/PerformanceChart.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/utils/helpers';

interface PerformanceData {
 date: string | number;
 pnl: number;
}

interface PerformanceChartProps {
 data: PerformanceData[];
 title?: string;
 className?: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, title = 'Performance Overview', className }) => {
 return (
   <Card className={className}>
     <CardHeader>
       <CardTitle>{title}</CardTitle>
     </CardHeader>
     <CardContent>
       <div className="w-full h-[400px]">
         <ResponsiveContainer width="100%" height="100%">
           <LineChart data={data}>
             <CartesianGrid strokeDasharray="3 3" />
             <XAxis 
               dataKey="date"
               tickFormatter={(value) => {
                 const date = new Date(value);
                 return date.toLocaleDateString();
               }}
             />
             <YAxis
               tickFormatter={(value) => formatCurrency(value)}
             />
             <Tooltip
               labelFormatter={(value) => new Date(value).toLocaleDateString()}
               formatter={(value: number) => [formatCurrency(value), 'PNL']}
             />
             <Line
               type="monotone"
               dataKey="pnl"
               stroke="#2563eb"
               strokeWidth={2}
               dot={false}
               activeDot={{ r: 8 }}
             />
           </LineChart>
         </ResponsiveContainer>
       </div>
     </CardContent>
   </Card>
 );
};

export default PerformanceChart;