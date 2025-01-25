import { Card, CardContent, CardHeader } from "./ui/card";
import { TypeIcon as type, LucideIcon } from 'lucide-react'
import { cn } from "@/lib/utils"

export function DashboardCard({
  title,
  value,
  icon: Icon,
  percentageChange,
  className,
  variant = 'blue'
}) {
  const gradients = {
    blue: 'bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800',
    green: 'bg-gradient-to-br from-green-400 to-green-600 dark:from-green-600 dark:to-green-800',
    purple: 'bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800',
    yellow: 'bg-gradient-to-br from-yellow-400 to-yellow-600 dark:from-yellow-600 dark:to-yellow-800',
    pink: 'bg-gradient-to-br from-pink-400 to-pink-600 dark:from-pink-600 dark:to-pink-800',
    orange: 'bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-600 dark:to-orange-800',
    cyan: 'bg-gradient-to-br from-cyan-400 to-cyan-600 dark:from-cyan-600 dark:to-cyan-800',
  }

  const iconColors = {
    blue: 'text-blue-100 dark:text-blue-200',
    green: 'text-green-100 dark:text-green-200',
    purple: 'text-purple-100 dark:text-purple-200',
    yellow: 'text-yellow-100 dark:text-yellow-200',
    pink: 'text-pink-100 dark:text-pink-200',
    orange: 'text-orange-100 dark:text-orange-200',
    cyan: 'text-cyan-100 dark:text-cyan-200',
  }

  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-200 border-none text-white",
      gradients[variant],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-lg font-medium">{title}</div>
        <Icon className={cn("h-6 w-6", iconColors[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value.toLocaleString()}</div>
        {percentageChange !== undefined && (
          <div className="flex items-center mt-2">
            <span className={cn(
              "text-sm font-medium inline-flex items-center",
              percentageChange > 0 ? "text-green-200 dark:text-green-300" : "text-red-200 dark:text-red-300"
            )}>
              {percentageChange > 0 ? "↑" : "↓"} {Math.abs(percentageChange)}%
            </span>
            <span className="text-sm text-white/80 ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

