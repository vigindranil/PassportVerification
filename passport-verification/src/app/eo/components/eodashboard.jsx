import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Users, DollarSign, TrendingUp, ShoppingBag, CircleDashed, TrendingDown, ArrowRightToLine, Send } from 'lucide-react'

const EoDashboardCard = ({ title, value, icon: Icon, description, color }) => (
    <Card className={`${color} text-white`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs opacity-70">{description}</p>
        </CardContent>
    </Card>
)

const EoDashboardCards = () => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            
            <EoDashboardCard
                            title="Total Application"
                            value="10"
                            icon={TrendingUp}
                            //description="5% increase from last week"
                           color="bg-gradient-to-br from-blue-400 to-blue-600"
                        />
            
            
            <EoDashboardCard
                title="Total Pending"
                value="6"
                icon={CircleDashed}
                //description="10% increase from last month"
               color="bg-gradient-to-br from-lime-400 to-lime-600"
            />
           
            <EoDashboardCard
                title="Proceed"
                value="1"
                icon={ArrowRightToLine}
                //description="15% increase from yesterday"
              color="bg-gradient-to-br from-purple-400 to-purple-600"
            />
          
        </div>
        
    )
}

export default EoDashboardCards

