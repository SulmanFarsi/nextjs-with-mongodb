"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar as _,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/server/user";
import {
  ChevronDown,
  ChevronUp,
  Loader,
  Package,
  Package2,
  User,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { PropsWithChildren, useState, useTransition } from "react";
interface SidebarProps extends PropsWithChildren {
  data: Awaited<ReturnType<typeof getCurrentUser>>;
}
const Sidebar: React.FC<SidebarProps> = (props) => {
  const [logoutBox, setLogoutBox] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const to = useRouter();
  const pathName = usePathname();

  const logoutUser = () => {
    startTransition(async () => {
      await signOut({
        redirect: false,
      });
      toast({
        title: "SUCCESS",
        description: "Logout Successfully!",
        duration: 3000,
      });
      setTimeout(() => {
        to.push("/account/login");
      }, 3000);
    });
  };
  const sidebarLinks = [
    {
      href: "/dashboard",
      text: "Dashboard",
      icon: Package2,
    },
    {
      text: "Users",
      icon: Users,
      child: [
        {
          text: "Add New",
          href: "/dashboard/users/new",
        },
        {
          text: "View All",
          href: "/dashboard/users",
        },
      ],
    },
  ];
  return (
    <_>
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center justify-start space-x-2">
                <Package2 />
                <h1 className="text-2xl">Dashboard</h1>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarLinks.map((i, e) =>
                i.child ? (
                  <Collapsible key={e}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <i.icon className="w-4 h-4" /> {i.text}
                          <ChevronDown className="ml-auto w-4 h-4" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </SidebarMenuItem>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {i.child.map((sub, _) => (
                          <SidebarMenuSubItem
                            className={`${pathName === sub.href ? "bg-accent" : ""}`}
                            key={_}
                          >
                            <SidebarMenuSubButton asChild>
                              <Link prefetch={true} href={sub.href}>
                                {sub.text}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={e}>
                    <SidebarMenuButton
                      className={`${pathName === i.href ? "bg-accent" : ""}`}
                      asChild
                    >
                      <Link prefetch={true} href={i.href}>
                        <i.icon className="w-4 h-4" />
                        {i.text}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <AlertDialog open={logoutBox}>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User /> {props.data.user?.username}{" "}
                    <ChevronUp className="w-4 h-4 ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem>Account</DropdownMenuItem>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onClick={() => setLogoutBox(true)}>
                      Logout
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
                <AlertDialogContent>
                  <AlertDialogTitle>Are you sure to logout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. You will need to log in again
                    to access your account.
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setLogoutBox(false)}
                      disabled={isPending}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <Button variant={"destructive"} asChild>
                      <AlertDialogAction
                        onClick={() => {
                          setLogoutBox(true);
                          logoutUser();
                        }}
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          "Logout"
                        )}
                      </AlertDialogAction>
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </_>
  );
};

export default Sidebar;
