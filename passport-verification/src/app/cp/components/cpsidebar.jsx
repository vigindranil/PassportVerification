'use client'
import React, { useEffect, useState } from 'react'
import { Home, Upload, FileText, FileUp, FileInput, ShieldCheck, Search, FileCheck2, FolderSync, File, Files, CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


const CpSidebar = () => {
    const pathname = usePathname();
    const [currentHref, setCurrentHref] = useState(pathname);

    useEffect(() => {
        setCurrentHref(pathname);
    }, [pathname])

    const isActive = (href) => {
        return currentHref == href;
    }

    return (
        <div className="flex flex-col h-screen w-64 bg-gradient-to-b from-purple-600 to-indigo-700 text-white">
            <div className="p-5">
                <h2 className="text-2xl font-bold"> CP USer</h2>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2 px-3">
                    {[
                        { icon: Home, label: 'Home', href: '/dashboard' },
                        { icon: Upload, label: 'Upload Data', href: '/upload' },
                  
                        { icon: FileInput, label: 'Proceed Files', href: '/analytics' },
                        { icon: FileUp, label: 'File Dispatched', href: '/settings' },
                        { icon: FileText, label: 'View PDF Count', href: '/settings' },
                        { icon: Files, label: 'Manage Officers', href: '/settings' },
                        { icon: File, label: 'All Files', href: '/allFiles' },
                        { icon: FolderSync, label: 'Re-Submit Files', href: '/settings' },
                        { icon: FileCheck2, label: 'File Complited', href: '/settings' },
                        { icon: Search, label: 'CRS Data Search', href: '/settings' },
                    ].map((item) => (
                        <li key={item.label}>
                            <Link href={item.href} className={`flex items-center p-2 rounded-lg transition-colors ${isActive(item.href) ? 'bg-white text-indigo-800' : 'hover:bg-indigo-800'}`}>
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

export default CpSidebar

