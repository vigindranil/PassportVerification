'use client'
import React, { useEffect, useState } from 'react'
import { Home, Upload, FileText, FileUp, FileInput, ShieldCheck, Search, FileCheck2, FolderSync, File, Files, CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Cookies from "react-cookies";


const Sidebar = () => {
    const pathname = usePathname();
    const [currentHref, setCurrentHref] = useState(pathname);
    const type_id = Cookies.load("type");
    const [type, setType] = useState(null);

    useEffect(() => {
        type_id && setType(type_id);
        setCurrentHref(pathname);
    }, [pathname, type_id])

    const isActive = (href) => {
        return currentHref == href;
    }

    return (
        <div className="flex flex-col h-screen w-64 bg-gradient-to-b from-purple-600 to-indigo-700 text-white">
            <div className="p-5">
                <h2 className="text-2xl font-bold">Dashboard</h2>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2 px-3">
                    {[
                        { type_id: 10, icon: Home, label: 'Home', href: '/dashboard' },
                        { type_id: 10, icon: Upload, label: 'Upload Data', href: '/upload' },
                        { type_id: 10, icon: CirclePlus, label: 'Create User', href: '/createUserForm' },
                        { type_id: 40, icon: Home, label: 'Home', href: '/dashboard-eo' },
                        { type_id: 40, icon: File, label: 'All Files', href: '/allFiles' },
                        { type_id: 30, icon: Home, label: 'Home', href: '/dashboard-oc' },
                        { type_id: 30, icon: FileUp, label: 'All Files', href: '/allFiles-oc' },
                        // { type_id: 10, icon: FileText, label: 'View PDF Count', href: '/settings' },
                        // { type_id: 10, icon: Files, label: 'Manage Officers', href: '/settings' },
                        // { type_id: 10, icon: FolderSync, label: 'Re-Submit Files', href: '/settings' },
                        // { type_id: 10, icon: FileCheck2, label: 'File Complited', href: '/settings' },
                        // { type_id: 10, icon: Search, label: 'CRS Data Search', href: '/settings' },
                    ]?.map((item) => (
                        type == item?.type_id &&
                        <li key={item.label}>
                            <Link href={item.href} className={`flex items-center p-2 rounded-lg transition-colors ${isActive(item?.href) ? 'bg-white text-indigo-800' : 'hover:bg-indigo-800'}`}>
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar

