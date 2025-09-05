"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { OverviewTab } from "./tabs/overview-tab";
import { LeaseDocsTab } from "./tabs/lease-docs-tab";
import { ContactsTab } from "./tabs/contacts-tab";
import { TenantHealthTab } from "./tabs/tenant-health-tab";
import { AppConfigTab } from "./tabs/app-config-tab";
import { ActivityTab } from "./tabs/activity-tab";
import { NotesTab } from "./tabs/notes-tab";
import { BuildingsTab } from "./tabs/buildings-tab";
import { CreditsTab } from "./tabs/credits-tab";
import { InlineEdit, InlineImageEdit } from "./ui/inline-edit";
import { FloatingNotePanel } from "./ui/floating-note-panel";
import { ContactNotesPanel } from "./ui/contact-notes-panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSearch } from "./global-search";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Mail, FileText } from "lucide-react";
import Link from "next/link";
import { createHqoCrmRoute } from "@/lib/hqo-crm-routes";
import { getTenantById } from "@/lib/leasesData";

const tabs = [
  { id: "overview", name: "Overview" },
  { id: "activity", name: "Activity" },
  { id: "contacts", name: "Contacts" },
  { id: "notes", name: "Notes" },
  { id: "credits", name: "Credits" },
  { id: "tenant-health", name: "Tenant Health" },
  { id: "lease-docs", name: "Lease & Docs" },
  { id: "buildings", name: "Buildings" },
  { id: "app-configuration", name: "App Configuration" },
];

interface TenantDetailProps {
  tenantId?: string;
}

export function TenantDetail({ tenantId }: TenantDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>(["all"]);

  // Get tenant data by ID from the mock data
  const tenantData = tenantId ? getTenantById(tenantId) : null;

  // State for editable company information
  const [companyData, setCompanyData] = useState({
    name: tenantData?.name || "Unknown Tenant",
    logo: tenantData?.logo || "/placeholder.svg?height=64&width=64",
  });

  // State for floating note panel
  const [isNotePanelOpen, setIsNotePanelOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);

  // State for contact notes panel
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isContactNotesOpen, setIsContactNotesOpen] = useState(false);

  // Mock contacts data (in real app, this would come from API)
  const mockContacts = [
    { id: "sarah-martinez", name: "Sarah Martinez", role: "CEO" },
    { id: "michael-chen", name: "Michael Chen", role: "CFO" },
    {
      id: "jennifer-davis",
      name: "Jennifer Davis",
      role: "Operations Manager",
    },
  ];

  // Updated mapping to work with new tenant IDs
  const tenantLeaseMapping: { [key: string]: string } = {
    // New IDs
    "1001": "550e8400-e29b-41d4-a716-446655440101",
    "1002": "LSE-002",
    // Legacy IDs for backward compatibility
    "1": "550e8400-e29b-41d4-a716-446655440101",
    "2": "LSE-002",
    "3": "LSE-003",
    "4": "LSE-004",
    "5": "LSE-005",
    "6": "LSE-006",
    "7": "LSE-007",
    "8": "LSE-008",
    "9": "LSE-009",
    "10": "LSE-010",
    "11": "LSE-011",
  };

  const associatedLeaseId = tenantId ? tenantLeaseMapping[tenantId] : null;

  // If no tenant found, show error
  if (tenantId && !tenantData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Tenant not found
          </h2>
          <p className="text-gray-600">
            Tenant with ID "{tenantId}" does not exist.
          </p>
        </div>
      </div>
    );
  }

  const buildings = [
    { id: "all", name: "All Buildings" },
    { id: "cobblestone", name: "Cobblestone Collaborative" },
    { id: "metro-tower", name: "Metro Tower" },
    { id: "innovation-hub", name: "Innovation Hub" },
  ];

  const handleCompanyNameUpdate = (newName: string) => {
    setCompanyData((prev) => ({
      ...prev,
      name: newName,
    }));
    // In a real app, you would also make an API call here to save the data
    console.log("Updated company name:", newName);
  };

  // Update company data when tenant data changes
  useEffect(() => {
    if (tenantData) {
      setCompanyData({
        name: tenantData.name,
        logo: tenantData.logo || "/placeholder.svg?height=64&width=64",
      });
    }
  }, [tenantData]);

  const handleLogoUpload = (file: File) => {
    // In a real app, you would upload the file to your server and get back a URL
    const url = URL.createObjectURL(file);
    setCompanyData((prev) => ({
      ...prev,
      logo: url,
    }));
    console.log("Uploaded new logo:", file.name);
  };

  const handleSaveNote = (noteData: any) => {
    // In a real app, you would save to your API
    console.log("Saving note:", noteData);
    setEditingNote(null);
  };

  // Contact notes handlers
  const handleOpenContactNotes = (contact: any) => {
    // Add sample notes if they don't exist
    const contactWithNotes = {
      ...contact,
      notes: contact.notes || [
        {
          id: "1",
          content:
            "Jordan mentioned that their team really enjoyed the new event series",
          author: "Chris S.",
          authorInitials: "CS",
          createdAt: "2025-06-03T08:58:00Z",
          canDelete: true,
        },
        {
          id: "2",
          content: "Jordan is excited about the CAB",
          author: "Chris S.",
          authorInitials: "CS",
          createdAt: "2025-05-13T14:23:00Z",
          canDelete: true,
        },
        {
          id: "3",
          content:
            "We're going to host a happy hour on the roof for EcoVolt after talking to Jordan in the lobby today",
          author: "Chris S.",
          authorInitials: "CS",
          createdAt: "2025-06-03T09:40:00Z",
          canDelete: true,
        },
      ],
    };
    setSelectedContact(contactWithNotes);
    setIsContactNotesOpen(true);
  };

  const handleSaveContactNote = (contactId: string, content: string) => {
    // In a real app, this would save to the backend
    const newNote = {
      id: Date.now().toString(),
      content,
      author: "Current User",
      authorInitials: "CU",
      createdAt: new Date().toISOString(),
      canDelete: true,
    };

    if (selectedContact) {
      const updatedContact = {
        ...selectedContact,
        notes: [newNote, ...selectedContact.notes],
      };
      setSelectedContact(updatedContact);
    }
  };

  const handleDeleteContactNote = (noteId: string) => {
    if (selectedContact) {
      const updatedContact = {
        ...selectedContact,
        notes: selectedContact.notes.filter((note: any) => note.id !== noteId),
      };
      setSelectedContact(updatedContact);
    }
  };

  const renderTabContent = () => {
    const commonProps = { selectedBuildings };

    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            {...commonProps}
            onTabChange={setActiveTab}
            onOpenContactNotes={handleOpenContactNotes}
          />
        );
      case "lease-docs":
        return <LeaseDocsTab {...commonProps} />;
      case "contacts":
        return (
          <ContactsTab
            {...commonProps}
            onOpenContactNotes={handleOpenContactNotes}
          />
        );
      case "buildings":
        return <BuildingsTab {...commonProps} tenantId={tenantId} />;
      case "credits":
        return <CreditsTab {...commonProps} tenantId={tenantId} />;
      case "tenant-health":
        return <TenantHealthTab {...commonProps} />;
      case "notes":
        return <NotesTab {...commonProps} />;
      case "app-configuration":
        return <AppConfigTab {...commonProps} />;
      case "activity":
        return <ActivityTab {...commonProps} />;
      default:
        return <OverviewTab {...commonProps} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4">
          <nav
            className="flex items-center text-sm text-gray-500 mb-4"
            aria-label="Breadcrumb"
          >
            <Link href={createHqoCrmRoute("/tenants")} className="hover:underline text-gray-500">
              Tenants
            </Link>
          </nav>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-start space-x-0">
              <Link href={createHqoCrmRoute("/tenants")}></Link>

              <div className="flex items-center space-x-3">
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-gradient-to-br from-pink-500 to-purple-600">
                  <InlineImageEdit
                    src={companyData.logo}
                    alt={`${companyData.name} logo`}
                    onUpload={handleLogoUpload}
                    className="h-16 w-16 rounded-lg"
                    fallback={
                      <div className="h-16 w-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {companyData.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                    }
                  />
                </div>

                <div>
                  <div className="mb-1">
                    <InlineEdit
                      value={companyData.name}
                      onSave={handleCompanyNameUpdate}
                      placeholder="Enter company name..."
                      displayClassName="text-xl font-bold text-gray-900"
                    />
                  </div>

                  <div className="mt-2">
                    <Select
                      value={selectedBuildings[0]}
                      onValueChange={(value) => setSelectedBuildings([value])}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {buildings.map((building) => (
                          <SelectItem key={building.id} value={building.id}>
                            {building.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsNotePanelOpen(true)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Add note
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Contact tenant
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {mockContacts.map((contact) => (
                      <DropdownMenuItem
                        key={contact.id}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                {contact.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">
                                {contact.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {contact.role}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle email action
                              console.log(`Email ${contact.name}`);
                            }}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Detail Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">{renderTabContent()}</div>
      </div>

      {/* Floating Note Panel */}
      <FloatingNotePanel
        isOpen={isNotePanelOpen}
        onClose={() => {
          setIsNotePanelOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        editingNote={editingNote}
        contacts={mockContacts}
      />

      {/* Contact Notes Panel */}
      <ContactNotesPanel
        isOpen={isContactNotesOpen}
        onClose={() => {
          setIsContactNotesOpen(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
        onSaveNote={handleSaveContactNote}
        onDeleteNote={handleDeleteContactNote}
      />
    </div>
  );
}
