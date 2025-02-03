"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { Users, TrendingUp, TrendingDown } from "lucide-react";

interface StatisticsCardProps {
  title: string;
  count: number;
  change: number;
}

export function StatisticsCard({ title, count, change }: StatisticsCardProps) {
  const isPositive = change >= 0;
  const changePercentage = Math.abs(change).toFixed(1);
  const { open } = useSidebar();

  return (
    <Card
      className={`${open ? "w-[300px] " : " w-[360px]"} overflow-hidden transition-all hover:shadow-lg hover:bg-accent`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
          {title}
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count.toLocaleString()}</div>
        <div
          className={`flex items-center text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}
        >
          {isPositive ? (
            <TrendingUp className="mr-1 h-4 w-4" />
          ) : (
            <TrendingDown className="mr-1 h-4 w-4" />
          )}
          <span>{changePercentage}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
