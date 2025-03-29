import Link from 'next/link';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import clsx from 'clsx';

const DashboardCard = ({ title, value, icon: Icon, description, color, link }) => (
  <Link href={link}>
    <Card
      className={clsx(
        `text-white bg-gradient-to-br hover:shadow-xl hover:ring-2 hover:ring-white`,
        {
          'from-purple-700 to-purple-300': color === 'purple',
          'from-blue-700 to-blue-300': color === 'blue',
          'from-green-700 to-green-300': color === 'green',
          'from-yellow-700 to-yellow-300': color === 'yellow',
          'from-lime-700 to-lime-300': color === 'lime',
          'from-red-700 to-red-300': color === 'red',
          'from-teal-700 to-teal-300': color === 'teal',
          'from-orange-700 to-orange-300': color === 'orange',
          'from-pink-700 to-pink-300': color === 'pink',
        }
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium whitespace-pre-wrap">{title}</CardTitle>
        <Icon className={`h-8 w-8 bg-slate-900/15 p-[6px] rounded-full`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs opacity-70">{description}</p>
      </CardContent>
    </Card>
  </Link>
);

export default DashboardCard;
