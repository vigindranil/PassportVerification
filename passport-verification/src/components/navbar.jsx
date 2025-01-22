'use client'

import React, { useState, useEffect } from 'react'
import { Search, User, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/drop-down-menu'
import Image from 'next/image'
import { decrypt } from '@/utils/crypto'
import Cookies from "react-cookies";

const Navbar = () => {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [userImg, setUserImg] = useState("")
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    useEffect(() => {
        const base6gImg = sessionStorage.getItem('_img');
        setUserImg(`data:image/jpeg;base64,${base6gImg}`);

        const user_enc = Cookies.load('_ud');
        console.log("user_enc: " + user_enc);
        
        const user_dec = decrypt(user_enc);
        const user = JSON.parse(user_dec);

        setUserData(user);
        console.log("user: ",user);
    },[])

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    const handleLogout = () => {
        console.log('User logged out')
        window.location.reload()
    }

    return (
        <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white">
            <div className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="bg-white/20 border-none text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
            </div>

            <div className="flex items-center space-x-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div>
                            {userImg ? (
                                <Image
                                    className="rounded-full w-12 h-12"
                                    src={userImg}
                                    alt="User Avatar"
                                    width={50}
                                    height={50}
                                />
                            ) : (
                                <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center text-blue-500">
                                    U
                                </div>
                            )}
                        </div>
                    </DropdownMenuTrigger>

                <div className="text-sm">
                    <div>{userData && userData?.name}</div>
                    <div>{userData && userData?.rank}</div>
                </div>

                 <Button variant="outline" onClick={handleLogout} className ="text-white bg-red-500 hover:bg-slate-200 border-1 border-slate-800">
                  Sign-out
                </Button>
                </DropdownMenu>
            </div>
        </nav>
    )
}

export default Navbar

