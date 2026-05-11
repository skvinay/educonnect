import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface OpportunityChartProps {
  shortTerm: number;
  longTerm: number;
  title: string;
}

export const OpportunityChart = ({ shortTerm, longTerm, title }: OpportunityChartProps) => {
  const data = [
    {
      name: "Short-term (0-5 yrs)",
      opportunities: shortTerm,
      fill: "hsl(var(--primary))",
    },
    {
      name: "Long-term (5-15 yrs)",
      opportunities: longTerm,
      fill: "#010545",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Career Opportunities Outlook
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Projected job market growth for {title} careers
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                tickFormatter={(value) => `${value}%`}
                className="text-xs fill-muted-foreground"
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={120}
                className="text-xs fill-muted-foreground"
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, "Growth Potential"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="opportunities" radius={[0, 8, 8, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="p-3 rounded-lg bg-primary/10">
            <p className="text-2xl font-bold text-primary">{shortTerm}%</p>
            <p className="text-xs text-muted-foreground">Short-term Growth</p>
          </div>
          <div className="p-3 rounded-lg bg-accent/10">
            <p className="text-2xl font-bold text-accent">{longTerm}%</p>
            <p className="text-xs text-muted-foreground">Long-term Growth</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
