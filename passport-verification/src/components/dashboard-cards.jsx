import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const DashboardCard = ({ title, value, icon: Icon, description, color, link, type }) => (
    <Link href={link}>
        <Card className={`bg-gradient-to-br from-purple-600 to-purple-600 text-white`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 bg-${color}-400`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs opacity-70">{description}</p>
            </CardContent>
        </Card>
    </Link>
)

export default DashboardCard
