import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, BarChart3, TrendingUp, Globe, LogOut, User, Settings, History, FileText } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const navItems = [
    { href: "/analyze", label: "SEO Analysis", icon: Search, active: location === "/analyze", id: "analysis" },
    { href: "/history", label: "Scan History", icon: History, active: location === "/history", id: "history" },
    { href: "/advanced-reporting", label: "Advanced Reports", icon: FileText, active: location === "/advanced-reporting", id: "reporting" },
  ];

  return (
    <header className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity duration-200">
              <div className="relative">
                <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="absolute inset-0 bg-blue-600 dark:bg-blue-400 rounded-full opacity-0 hover:opacity-10 transition-opacity duration-200"></div>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">SEO Analyzer</span>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-105"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-9">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                    <AvatarFallback className="text-xs">{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.firstName || user?.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.firstName || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                
                {/* Mobile Navigation */}
                <div className="md:hidden">
                  {navItems.map((item) => (
                    <Link key={`mobile-${item.id}`} href={item.href}>
                      <DropdownMenuItem className="flex items-center space-x-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                  <DropdownMenuSeparator />
                </div>

                <DropdownMenuItem className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 dark:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}