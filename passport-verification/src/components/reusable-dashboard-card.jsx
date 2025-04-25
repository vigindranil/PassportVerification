import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardCard({
  header,
  icon: Icon,
  data,
  route,
  color = "bg-primary",
  description,
  className,
  index,
}) {
  return (
    <Link href={route} className="block">
      <Card className={cn("transition-all hover:shadow-md bg-gradient-to-r from-zinc-100 via-gray-50 to-white", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <h3 className="font-medium text-sm text-muted-foreground">
            {header}
          </h3>
          <div className={cn("p-2 rounded-full", color)}>
            <Icon className="h-4 w-4 text-primary-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
        {index == 1 && (
          <CardFooter className="pt-0">
            <span className="text-xs text-muted-foreground">
              Click to view details
            </span>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
