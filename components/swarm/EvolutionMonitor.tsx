import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchEvolutionStats } from '../../api/swarm';
import { Activity } from 'lucide-react';

const EvolutionMonitor: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const stats = await fetchEvolutionStats();
      setData(stats);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-neon-green" />
          Evolutionary Trajectory
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-neon-cyan animate-pulse font-mono text-sm">
            INITIALIZING_DATA_STREAM...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="cycle" 
                stroke="#666" 
                tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
              />
              <YAxis 
                stroke="#666" 
                tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#eee' }}
                itemStyle={{ fontFamily: 'monospace' }}
              />
              <Legend wrapperStyle={{ fontFamily: 'monospace', paddingTop: '10px' }}/>
              <Line 
                type="monotone" 
                dataKey="success" 
                stroke="#00f3ff" 
                strokeWidth={2} 
                dot={false} 
                name="Successful Mutations"
                activeDot={{ r: 6, fill: '#00f3ff' }}
              />
              <Line 
                type="monotone" 
                dataKey="failure" 
                stroke="#ff003c" 
                strokeWidth={2} 
                dot={false}
                name="System Rejections" 
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EvolutionMonitor;