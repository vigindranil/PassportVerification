"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function DynamicChartCard({
  title,
  description,
  data,
  dataKey,
  chartConfig,
  activeIndex,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-90}
              height={240}
              textAnchor="end"
              tickFormatter={(value) =>
                chartConfig[value]?.Application || String(value)
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="Application" // This is the key for bar height!
              strokeWidth={2}
              fill="#3B82F6"
              radius={8}
              activeIndex={activeIndex}
              activeBar={(props) => (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.payload.fill}
                  strokeDasharray={4}
                  strokeDashoffset={4}
                />
              )}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
