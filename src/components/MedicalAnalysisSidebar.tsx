import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Camera,
  Home,
  Brain,
  Heart,
  Activity,
  Users,
  Settings,
  HelpCircle,
  Stethoscope,
  Pill,
  User,
  Calendar,
  Sparkles,
  Shield,
  Leaf,
  ShoppingCart,
  Package,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';

const mainMenuItems = [
  { 
    title: 'Home', 
    url: '/', 
    icon: Home,
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Dashboard & Overview'
  },
  { 
    title: 'Medical Analysis', 
    url: '/analysis', 
    icon: Camera,
    gradient: 'from-purple-500 to-pink-500',
    description: 'AI Image Analysis'
  },
  { 
    title: 'Symptom Checker', 
    url: '/symptom-checker', 
    icon: Stethoscope,
    gradient: 'from-red-500 to-orange-500',
    description: 'Health Assessment'
  },
  { 
    title: 'Health Recommendations', 
    url: '/recommendations', 
    icon: Heart,
    gradient: 'from-green-500 to-emerald-500',
    description: 'Personalized Tips'
  },
  { 
    title: 'AI Assistant', 
    url: '/assistant', 
    icon: Brain,
    gradient: 'from-indigo-500 to-blue-500',
    description: 'Virtual Vaidya'
  },
  { 
    title: 'Dashboard', 
    url: '/dashboard', 
    icon: Activity,
    gradient: 'from-teal-500 to-green-500',
    description: 'Health Metrics'
  },
];

const secondaryMenuItems = [
  { 
    title: 'Ayurvedic Products', 
    url: '/products', 
    icon: Pill,
    gradient: 'from-amber-500 to-orange-500'
  },
  { 
    title: 'Shopping Cart', 
    url: '/cart', 
    icon: ShoppingCart,
    gradient: 'from-emerald-500 to-teal-500'
  },
  { 
    title: 'My Orders', 
    url: '/orders', 
    icon: Package,
    gradient: 'from-blue-500 to-indigo-500'
  },
  { 
    title: 'Nutrition Advisor', 
    url: '/nutrition', 
    icon: Leaf,
    gradient: 'from-green-500 to-lime-500'
  },
  { 
    title: 'Fitness Planner', 
    url: '/fitness', 
    icon: Activity,
    gradient: 'from-violet-500 to-purple-500'
  },
  { 
    title: 'Consultation', 
    url: '/consultation', 
    icon: Users,
    gradient: 'from-rose-500 to-pink-500'
  },
  { 
    title: 'Prakriti Test', 
    url: '/prakriti-test', 
    icon: User,
    gradient: 'from-cyan-500 to-blue-500'
  },
];

const utilityMenuItems = [
  { 
    title: 'User Profile', 
    url: '/profile', 
    icon: User,
    gradient: 'from-indigo-500 to-purple-500'
  },
  { 
    title: 'Health Alerts', 
    url: '/alerts', 
    icon: Calendar,
    gradient: 'from-red-500 to-rose-500'
  },
  { 
    title: 'Subscriptions', 
    url: '/subscriptions', 
    icon: Settings,
    gradient: 'from-gray-500 to-slate-500'
  },
  { 
    title: 'Help & Support', 
    url: '#', 
    icon: HelpCircle,
    gradient: 'from-blue-500 to-indigo-500'
  },
];

export function MedicalAnalysisSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const getNavClass = (path: string) =>
    isActive(path)
      ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-r-2 border-primary font-medium shadow-sm transform scale-[1.02]'
      : 'hover:bg-accent/50 hover:text-accent-foreground transition-all duration-300 hover:transform hover:scale-[1.01] hover:shadow-sm';

  return (
    <Sidebar className="border-r bg-gradient-to-b from-background via-background to-muted/20 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="border-b border-border/50 px-4 py-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center space-x-3 animate-fade-in">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Camera className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse shadow-sm"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              AyurGen
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              AI Medical Platform
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-3 py-2 flex items-center">
            <Sparkles className="h-3 w-3 mr-2 text-primary" />
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainMenuItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={`${getNavClass(item.url)} group`}>
                    <Link 
                      to={item.url} 
                      className="flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className={`h-8 w-8 rounded-lg bg-gradient-to-r ${item.gradient} p-1.5 shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                        <item.icon className="h-full w-full text-white" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">{item.title}</span>
                        {item.description && (
                          <span className="text-xs text-muted-foreground truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {item.description}
                          </span>
                        )}
                      </div>
                      {isActive(item.url) && (
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-3 py-2 flex items-center">
            <Heart className="h-3 w-3 mr-2 text-emerald-500" />
            Health Services
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {secondaryMenuItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={`${getNavClass(item.url)} group`}>
                    <Link 
                      to={item.url} 
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-300"
                      style={{ animationDelay: `${(index + mainMenuItems.length) * 0.05}s` }}
                    >
                      <div className={`h-7 w-7 rounded-lg bg-gradient-to-r ${item.gradient} p-1.5 shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                        <item.icon className="h-full w-full text-white" />
                      </div>
                      <span className="text-sm font-medium flex-1">{item.title}</span>
                      {isActive(item.url) && (
                        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-3 py-2 flex items-center">
            <Shield className="h-3 w-3 mr-2 text-blue-500" />
            Utilities
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {utilityMenuItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={`${getNavClass(item.url)} group`}>
                    <Link 
                      to={item.url} 
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-300"
                      style={{ animationDelay: `${(index + mainMenuItems.length + secondaryMenuItems.length) * 0.05}s` }}
                    >
                      <div className={`h-7 w-7 rounded-lg bg-gradient-to-r ${item.gradient} p-1.5 shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                        <item.icon className="h-full w-full text-white" />
                      </div>
                      <span className="text-sm font-medium flex-1">{item.title}</span>
                      {isActive(item.url) && (
                        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-2 bg-gradient-to-r from-muted/10 to-muted/5 space-y-4">
        <UserMenu />
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
          <div className="text-xs text-muted-foreground">
            v2.0.1
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
