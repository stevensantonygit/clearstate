"use client"

import React from "react"
import Link from "next/link"
import { useState } from "react"
import { Building2, Menu, User, Plus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import CosmicThemeToggle from "@/components/cosmic-theme-toggle-navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import StyledSignInButton from "@/components/styled-signin-button"

export function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { user, userProfile, logout } = useAuth()

  return (
    <header className="fixed top-0 z-50 w-full bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Navigation - Left Side */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 mr-12">
              <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-light text-white tracking-wide">PropertySG</span>
            </Link>

            {/* Navigation Menu - Directly after logo */}
            <div className="hidden lg:flex">
              <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white/80 hover:text-white hover:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10">
                    Properties
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-black/95 backdrop-blur-xl border-white/10">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-white/20 to-white/5 p-6 no-underline outline-none focus:shadow-md"
                            href="/properties"
                          >
                            <Building2 className="h-6 w-6 text-white" />
                            <div className="mb-2 mt-4 text-lg font-medium text-white">
                              All Properties
                            </div>
                            <p className="text-sm leading-tight text-white/70">
                              Browse all available properties in Singapore
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/properties/hdb" title="HDB Flats" className="text-white hover:bg-white/10">
                        Public housing options across Singapore
                      </ListItem>
                      <ListItem href="/properties/condo" title="Condominiums" className="text-white hover:bg-white/10">
                        Private condominium developments
                      </ListItem>
                      <ListItem href="/properties/landed" title="Landed Properties" className="text-white hover:bg-white/10">
                        Houses, bungalows and terrace homes
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/agents" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white/80 hover:text-white hover:bg-white/10")}>
                      Agents
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/about" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white/80 hover:text-white hover:bg-white/10")}>
                      About
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            </div>
          </div>

          {/* Actions - Right Side */}
          <div className="flex items-center justify-end space-x-4">
            <div className="hidden md:block">
              <CosmicThemeToggle />
            </div>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Button size="sm" className="hidden lg:flex gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 font-light">
                  <Plus className="h-4 w-4" />
                  List Property
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userProfile?.avatar} />
                        <AvatarFallback className="bg-white/20 text-white text-xs">
                          {userProfile?.name?.charAt(0) || <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-xl border-white/10">
                    <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/10">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/10">
                      <Building2 className="mr-2 h-4 w-4" />
                      My Properties
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={logout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <StyledSignInButton href="/login" />
            )}

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-black/95 backdrop-blur-xl border-white/10">
                  <div className="flex flex-col space-y-6 py-6">
                    <Link 
                      href="/" 
                      className="flex items-center space-x-3"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/5 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xl font-light text-white">PropertySG</span>
                    </Link>
                    
                    <nav className="flex flex-col space-y-4">
                      <Link
                        href="/properties"
                        className="text-lg font-light text-white/80 hover:text-white transition-colors"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        Properties
                      </Link>
                      <Link
                        href="/agents"
                        className="text-lg font-light text-white/80 hover:text-white transition-colors"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        Agents
                      </Link>
                      <Link
                        href="/about"
                        className="text-lg font-light text-white/80 hover:text-white transition-colors"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        About
                      </Link>
                    </nav>

                    <div className="md:hidden pt-4">
                      <CosmicThemeToggle />
                    </div>

                    <div className="flex flex-col space-y-4 pt-6">
                      {user ? (
                        <>
                          <Button className="w-full gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 font-light">
                            <Plus className="h-4 w-4" />
                            List Property
                          </Button>
                          <Button variant="outline" className="w-full gap-2 bg-transparent border-white/20 text-white hover:bg-white/10 font-light" onClick={logout}>
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                          <Button variant="outline" className="w-full gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 font-light">
                            <User className="h-4 w-4" />
                            Sign In
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
