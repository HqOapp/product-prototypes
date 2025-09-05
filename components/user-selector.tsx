"use client"

import { useEffect } from "react"
import { UserCircle, ChevronDown, LogOut, Settings, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { useNavigation } from "@/lib/navigation-context"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { usePersona } from "@/lib/providers/persona-provider"
import { useUser } from "@/lib/providers/user-provider"

interface UserSelectorProps {
  mode: string;
}

export function UserSelector({ mode }: UserSelectorProps) {
  const { isNavigationHidden, toggleNavigation } = useNavigation();
  const { setPersona } = usePersona();
  const { selectedUser, setSelectedUser, availableUsers, updateUserForMode } = useUser();

  // Update selected user when mode changes
  useEffect(() => {
    updateUserForMode(mode);
  }, [mode, updateUserForMode]);

  // Handle user selection (no automatic persona mapping)
  const handleUserSelection = (user: typeof selectedUser) => {
    setSelectedUser(user);
    // Note: Persona is now independent of user selection
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-50">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt={selectedUser.name} />
            <AvatarFallback>
              {selectedUser.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium">{selectedUser.name}</p>
            <p className="text-xs text-muted-foreground">{selectedUser.company}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{selectedUser.name}</p>
            {selectedUser.title && (
              <p className="text-xs text-muted-foreground">{selectedUser.title}</p>
            )}
            <p className="text-xs text-muted-foreground">{selectedUser.company}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableUsers.length > 1 && (
          <>
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              Switch User
            </DropdownMenuLabel>
            {availableUsers.map((user) => (
                             <DropdownMenuItem
                 key={user.name}
                 onClick={() => handleUserSelection(user)}
                 className={selectedUser.name === user.name ? "bg-gray-100" : ""}
               >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                  <AvatarFallback>
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm">{user.name}</span>
                  {user.title && <span className="text-xs text-muted-foreground">{user.title}</span>}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center space-x-2">
            {isNavigationHidden ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm">Hide navigation</span>
          </div>
          <Switch
            checked={isNavigationHidden}
            onCheckedChange={toggleNavigation}
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 