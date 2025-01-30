import Link from 'next/link';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import clsx from 'clsx';

const DashboardCard = ({ title, value, icon: Icon, description, color, link }) => (
  <Link href={link}>
    <Card
      className={clsx(
        'text-white bg-gradient-to-br',
        {
          'from-purple-600 to-purple-400': color === 'purple',
          'from-blue-600 to-blue-400': color === 'blue',
          'from-green-600 to-green-400': color === 'green',
          'from-yellow-600 to-yellow-400': color === 'yellow',
          'from-lime-600 to-lime-400': color === 'lime',
        }
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-6 w-6" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs opacity-70">{description}</p>
      </CardContent>
    </Card>
  </Link>
);

export default DashboardCard;
