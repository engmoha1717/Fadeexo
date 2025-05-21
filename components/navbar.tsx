"use client"

import { MobileSidebar } from './sidebar'
import { UserButton } from '@clerk/nextjs'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Navbar() {
  return (
    <div className="flex items-center p-4 border-b bg-white">
      <MobileSidebar />
      <div className="flex items-center gap-x-4 ml-auto">
        <div className="flex items-center gap-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "h-8 w-8"
            }
          }}
        />
      </div>
    </div>
  )
}