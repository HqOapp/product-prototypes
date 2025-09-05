"use client";

import {
  FileText,
  MessageSquare,
  BarChart3,
  Calendar,
  Megaphone,
  Palette,
  Settings,
  Layers,
  Package,
  ChevronDown,
  ChevronRight,
  ScrollText,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/lib/navigation-context";
import { useState, useEffect } from "react";
import { createHqoCrmRoute } from "@/lib/hqo-crm-routes";

interface SubMenuItem {
  title: string;
  href: string;
  active: boolean;
  icon?: any;
}

interface NavItem {
  title: string;
  icon: any;
  href: string;
  active: boolean;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  submenu?: SubMenuItem[];
}

export function ExperienceSidebar() {
  const pathname = usePathname();
  const { isNavigationHidden } = useNavigation();

  // Check if offerings section should be expanded
  const isProductsExpanded = pathname.startsWith(createHqoCrmRoute("/experience/offerings"));
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    () => ({
      products: isProductsExpanded,
    })
  );

  // Update expanded state when route changes
  useEffect(() => {
    const shouldExpand = pathname.startsWith(createHqoCrmRoute("/experience/offerings"));
    setExpandedItems((prev) => ({
      ...prev,
      products: shouldExpand,
    }));
  }, [pathname]);

  const engageNavItems: NavItem[] = [
    {
      title: "Collections",
      icon: Layers,
      href: createHqoCrmRoute("/experience/collections"),
      active:
        pathname === createHqoCrmRoute("/experience/collections") ||
        pathname.startsWith(createHqoCrmRoute("/experience/collections/")),
    },
    {
      title: "Offerings",
      icon: Package,
      href: createHqoCrmRoute("/experience/offerings"),
      active:
        pathname === createHqoCrmRoute("/experience/offerings") ||
        pathname.startsWith(createHqoCrmRoute("/experience/offerings/")),
      hasSubmenu: true,
      isExpanded: expandedItems.products,
      submenu: [
        {
          title: "Offerings overview",
          href: createHqoCrmRoute("/experience/offerings/overview-2"),
          active:
            pathname === createHqoCrmRoute("/experience/offerings/overview-2") ||
            pathname.startsWith(createHqoCrmRoute("/experience/offerings/overview-2/")),
        },
        {
          title: "Inventory",
          href: createHqoCrmRoute("/experience/offerings/inventory"),
          active:
            pathname === createHqoCrmRoute("/experience/offerings/inventory") ||
            pathname.startsWith(createHqoCrmRoute("/experience/offerings/inventory/")),
        },
        {
          title: "Bundles",
          href: createHqoCrmRoute("/experience/offerings/bundles"),
          active:
            pathname === createHqoCrmRoute("/experience/offerings/bundles") ||
            pathname.startsWith(createHqoCrmRoute("/experience/offerings/bundles/")),
        },
      ],
    },
    {
      title: "Content",
      icon: FileText,
      href: createHqoCrmRoute("/experience/content"),
      active: pathname === createHqoCrmRoute("/experience/content"),
    },
    {
      title: "Communications",
      icon: MessageSquare,
      href: createHqoCrmRoute("/experience/communications"),
      active: pathname === createHqoCrmRoute("/experience/communications"),
    },
    {
      title: "Surveys",
      icon: BarChart3,
      href: createHqoCrmRoute("/experience/surveys"),
      active: pathname === createHqoCrmRoute("/experience/surveys"),
    },
    {
      title: "Events",
      icon: Calendar,
      href: createHqoCrmRoute("/experience/events"),
      active: pathname === createHqoCrmRoute("/experience/events"),
    },
    {
      title: "Waivers",
      icon: ScrollText,
      href: createHqoCrmRoute("/experience/waivers"),
      active:
        pathname === createHqoCrmRoute("/experience/waivers") ||
        pathname.startsWith(createHqoCrmRoute("/experience/waivers/")),
    },
    // Services is still hidden for now
    // {
    //   title: "Services",
    //   icon: Megaphone,
    //   href: "/experience/services",
    //   active: pathname === "/experience/services",
    // },
  ];

  const setupNavItems = [
    {
      title: "Theme",
      icon: Palette,
      href: createHqoCrmRoute("/experience/theme"),
      active: pathname === createHqoCrmRoute("/experience/theme"),
    },
    {
      title: "Features",
      icon: Settings,
      href: createHqoCrmRoute("/experience/features"),
      active: pathname === createHqoCrmRoute("/experience/features"),
    },
  ];

  if (isNavigationHidden) {
    return null;
  }

  return (
    <div className="border-r bg-white w-64">
      <div className="flex h-full flex-col">
        <nav className="flex-1 space-y-1 p-4 pt-6">
          {/* Navigation Items */}
          <div className="mb-6">
            <div className="space-y-1">
              {engageNavItems.map((item) => (
                <div key={item.title}>
                  {item.hasSubmenu ? (
                    <div>
                      <div
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                          item.active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        onClick={() => {
                          setExpandedItems((prev) => ({
                            ...prev,
                            products: !prev.products,
                          }));
                        }}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="flex-1">{item.title}</span>
                        {item.isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>

                      {/* Main Products Link - Hidden for now */}
                      {false && item.isExpanded && (
                        <div className="mt-1">
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ml-6",
                              pathname === createHqoCrmRoute("/experience/offerings") &&
                                !pathname.includes("/inventory")
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <span>Overview</span>
                          </Link>
                        </div>
                      )}

                      {/* Submenu Items */}
                      {item.isExpanded && item.submenu && (
                        <div className="mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ml-6",
                                subItem.active
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              {subItem.icon && (
                                <subItem.icon className="h-4 w-4" />
                              )}
                              <span>{subItem.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        item.active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SETUP Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              SETUP
            </h3>
            <div className="space-y-1">
              {setupNavItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
