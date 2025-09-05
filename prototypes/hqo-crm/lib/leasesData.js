// Legacy mock database - DEPRECATED
// This file now imports from the comprehensive schema-aligned mockData.js
// Maintaining backward compatibility for existing components

import {
  mockBuildings as newMockBuildings,
  mockTenants as newMockTenants,
  mockLeases as newMockLeases,
  mockSpaces as newMockSpaces,
  getBuildingById as newGetBuildingById,
  getTenantById as newGetTenantById,
  getLeaseById as newGetLeaseById,
} from "./mockData.js";

// Generate unique IDs (legacy function)
const generateId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

// Legacy Buildings Data (transformed from new schema for backward compatibility)
export const mockBuildings = newMockBuildings.map((building) => ({
  id: building.uuid,
  name: building.name,
  address: building.formatted_address,
  type: building.asset_type,
  floors: building.floors,
  totalSqFt: building.square_foot,
  // Add new fields while maintaining old structure
  ...building,
}));

// Legacy Tenants Data (transformed from new schema for backward compatibility)
export const mockTenants = newMockTenants.map((tenant) => ({
  id: tenant.tenant_id,
  name: tenant.tenant_name,
  industry: tenant.industry,
  logo:
    tenant.logo_url ||
    "/placeholder.svg?height=40&width=40&text=" + tenant.tenant_name.charAt(0),
  email: tenant.primary_contact_email,
  phone: tenant.primary_contact_phone,
  // Add all new fields while maintaining old structure
  ...tenant,
}));

// Legacy Spaces Data (transformed from new schema for backward compatibility)
export const mockSpaces = newMockSpaces.map((space) => ({
  id: space.space_id,
  buildingId: space.building_id,
  unitNumber: space.name,
  floor: space.floor,
  area: space.area,
  spaceType: space.space_type,
  status: space.status,
  // Add all new fields while maintaining old structure
  ...space,
}));

// Legacy Mock Spaces Data (keeping a few for compatibility)
const legacyMockSpaces = [
  // Cobblestone Collaborative (BLD-001)
  {
    id: "SPC-001",
    buildingId: "BLD-001",
    unitNumber: "Suite 901",
    floor: 9,
    area: 7500,
    spaceType: "Office",
    status: "Available",
  },
  {
    id: "SPC-002",
    buildingId: "BLD-001",
    unitNumber: "Suite 801",
    floor: 8,
    area: 5000,
    spaceType: "Office",
    status: "Occupied",
  },
  {
    id: "SPC-003",
    buildingId: "BLD-001",
    unitNumber: "Floors 15-16",
    floor: 15,
    area: 15000,
    spaceType: "Office",
    status: "Occupied",
  },
  {
    id: "SPC-004",
    buildingId: "BLD-001",
    unitNumber: "Suite 1201",
    floor: 12,
    area: 8000,
    spaceType: "Office",
    status: "Available",
  },
  // Metro Tower (BLD-002)
  {
    id: "SPC-005",
    buildingId: "BLD-002",
    unitNumber: "Floor 12",
    floor: 12,
    area: 12000,
    spaceType: "Office",
    status: "Occupied",
  },
  {
    id: "SPC-006",
    buildingId: "BLD-002",
    unitNumber: "Floors 8-9",
    floor: 8,
    area: 18000,
    spaceType: "Office",
    status: "Occupied",
  },
  {
    id: "SPC-007",
    buildingId: "BLD-002",
    unitNumber: "Suite 1505",
    floor: 15,
    area: 6000,
    spaceType: "Office",
    status: "Available",
  },
  // Innovation Hub (BLD-003)
  {
    id: "SPC-008",
    buildingId: "BLD-003",
    unitNumber: "Lab Suite 401-403",
    floor: 4,
    area: 8000,
    spaceType: "Laboratory",
    status: "Occupied",
  },
  {
    id: "SPC-009",
    buildingId: "BLD-003",
    unitNumber: "Suite 201-203",
    floor: 2,
    area: 5500,
    spaceType: "Office",
    status: "Occupied",
  },
  {
    id: "SPC-010",
    buildingId: "BLD-003",
    unitNumber: "Lab Suite 301",
    floor: 3,
    area: 4000,
    spaceType: "Laboratory",
    status: "Available",
  },
  // Bay Area Data Center (BLD-004)
  {
    id: "SPC-011",
    buildingId: "BLD-004",
    unitNumber: "Server Hall B",
    floor: 2,
    area: 10000,
    spaceType: "Data Center",
    status: "Occupied",
  },
  {
    id: "SPC-012",
    buildingId: "BLD-004",
    unitNumber: "Server Hall A",
    floor: 1,
    area: 8000,
    spaceType: "Data Center",
    status: "Available",
  },
  // Downtown Plaza (BLD-005)
  {
    id: "SPC-013",
    buildingId: "BLD-005",
    unitNumber: "Ground Floor Unit 12",
    floor: 1,
    area: 2500,
    spaceType: "Retail",
    status: "Occupied",
  },
  {
    id: "SPC-014",
    buildingId: "BLD-005",
    unitNumber: "Ground Floor Unit 8",
    floor: 1,
    area: 1800,
    spaceType: "Retail",
    status: "Available",
  },
];

// Mock Leases Data (initial 10 leases)
export let mockLeases = [
  {
    lease_id: "LSE-001",
    tenant_id: 1,
    tenant_name: "EcoVolt Energy Solutions",
    tenant_logo:
      "https://dmevq6vd3sz66.cloudfront.net/uploads/ee26908bf9629eeb4b37dac350f4754a_1710446739196.png",
    execution_date: "2022-01-01",
    commencement_date: "2022-01-15",
    expiration_date: "2027-01-14",
    base_rent_annual: 750000,
    lease_term_months: 60,
    property_type: "Office",
    lease_structure: "Triple Net (NNN)",
    security_deposit: 125000,
    renewal_option: true,
    escalation_clause: { type: "Percentage", rate: 3, frequency: "Annual" },
    escalation_rate: 3.0,
    lease_document_url: "https://docs.example.com/lease-001.pdf",
    lease_status: "active",
    building_name: "Cobblestone Collaborative",
    building_id: "BLD-001",
    space_info: "Suite 901, Suite 801",
    days_until_expiry: 1095,
    rent_roll: 62500,
    landlord_obligations: [
      "Structural maintenance and repairs",
      "Common area maintenance",
      "Property insurance",
      "Property tax payments",
      "Building security systems",
    ],
    tenant_obligations: [
      "Interior maintenance and repairs",
      "Utilities payments",
      "General liability insurance",
      "Compliance with building rules",
      "Monthly rent payments",
    ],
    sublease_policy: "Permitted with landlord's written consent",
    leased_spaces: [
      {
        space_id: "SPC-001",
        unit_number: "Suite 901",
        area: 7500,
        floor: 9,
        space_type: "Office",
      },
      {
        space_id: "SPC-002",
        unit_number: "Suite 801",
        area: 5000,
        floor: 8,
        space_type: "Office",
      },
    ],
    amendment_history: [
      {
        id: 1,
        type: "Amendment 1",
        date: "2023-01-15",
        description: "Rent escalation adjustment",
        document_url: "https://docs.example.com/amendment-001-1.pdf",
      },
    ],
    payment_history: [
      { date: "2024-01-01", amount: 62500, status: "Paid", type: "Base Rent" },
      { date: "2023-12-01", amount: 62500, status: "Paid", type: "Base Rent" },
      { date: "2023-11-01", amount: 62500, status: "Paid", type: "Base Rent" },
    ],
  },
  {
    lease_id: "LSE-002",
    tenant_id: 2,
    tenant_name: "NextGen Biotech",
    tenant_logo: "/placeholder.svg?height=40&width=40&text=NB",
    execution_date: "2021-06-15",
    commencement_date: "2021-07-01",
    expiration_date: "2024-06-30",
    base_rent_annual: 480000,
    lease_term_months: 36,
    property_type: "Lab",
    lease_structure: "Modified Gross (MG)",
    security_deposit: 80000,
    renewal_option: false,
    escalation_clause: { type: "Fixed", rate: 2500, frequency: "Monthly" },
    escalation_rate: 2.0,
    lease_document_url: "https://docs.example.com/lease-002.pdf",
    lease_status: "expiring-soon",
    building_name: "Innovation Hub",
    building_id: "BLD-003",
    space_info: "Lab Suite 401-403",
    days_until_expiry: 45,
    rent_roll: 40000,
    landlord_obligations: [
      "Building maintenance",
      "Common utilities",
      "Lab equipment servicing",
      "HVAC maintenance",
    ],
    tenant_obligations: [
      "Lab space maintenance",
      "Specialized equipment insurance",
      "Hazardous waste disposal",
      "Safety compliance",
    ],
    sublease_policy: "Not permitted",
    leased_spaces: [
      {
        space_id: "SPC-008",
        unit_number: "Lab Suite 401-403",
        area: 8000,
        floor: 4,
        space_type: "Laboratory",
      },
    ],
    amendment_history: [],
    payment_history: [
      { date: "2024-01-01", amount: 40000, status: "Paid", type: "Base Rent" },
      { date: "2023-12-01", amount: 40000, status: "Paid", type: "Base Rent" },
    ],
  },
  {
    lease_id: "LSE-003",
    tenant_id: 3,
    tenant_name: "Stellar Financial Advisors",
    tenant_logo: "/placeholder.svg?height=40&width=40&text=SF",
    execution_date: "2020-03-10",
    commencement_date: "2020-04-01",
    expiration_date: "2023-03-31",
    base_rent_annual: 320000,
    lease_term_months: 36,
    property_type: "Office",
    lease_structure: "Full-Service Gross (FSG)",
    security_deposit: 53333,
    renewal_option: true,
    escalation_clause: { type: "CPI", base_rate: 2, cap: 5 },
    escalation_rate: 2.5,
    lease_document_url: "https://docs.example.com/lease-003.pdf",
    lease_status: "expired",
    building_name: "Metro Tower",
    building_id: "BLD-002",
    space_info: "Floor 12",
    days_until_expiry: -180,
    rent_roll: 26667,
    landlord_obligations: [
      "Full building services",
      "All utilities",
      "Maintenance",
    ],
    tenant_obligations: ["Monthly rent payments", "Interior compliance"],
    sublease_policy: "Permitted with written consent",
    leased_spaces: [
      {
        space_id: "SPC-005",
        unit_number: "Floor 12",
        area: 12000,
        floor: 12,
        space_type: "Office",
      },
    ],
    amendment_history: [],
    payment_history: [],
  },
  {
    lease_id: "LSE-004",
    tenant_id: 4,
    tenant_name: "CloudSync Technologies",
    tenant_logo: "/placeholder.svg?height=40&width=40&text=CS",
    execution_date: "2023-09-01",
    commencement_date: "2023-10-01",
    expiration_date: "2028-09-30",
    base_rent_annual: 920000,
    lease_term_months: 60,
    property_type: "Office",
    lease_structure: "Triple Net (NNN)",
    security_deposit: 153333,
    renewal_option: true,
    escalation_clause: { type: "Percentage", rate: 3.5, frequency: "Annual" },
    escalation_rate: 3.5,
    lease_document_url: "https://docs.example.com/lease-004.pdf",
    lease_status: "active",
    building_name: "Cobblestone Collaborative",
    building_id: "BLD-001",
    space_info: "Floors 15-16",
    days_until_expiry: 1460,
    rent_roll: 76667,
    landlord_obligations: ["Structural maintenance", "Property insurance"],
    tenant_obligations: [
      "All utilities",
      "Interior maintenance",
      "Property taxes",
    ],
    sublease_policy: "Permitted with landlord approval",
    leased_spaces: [
      {
        space_id: "SPC-003",
        unit_number: "Floors 15-16",
        area: 15000,
        floor: 15,
        space_type: "Office",
      },
    ],
    amendment_history: [],
    payment_history: [
      { date: "2024-01-01", amount: 76667, status: "Paid", type: "Base Rent" },
      { date: "2023-12-01", amount: 76667, status: "Paid", type: "Base Rent" },
    ],
  },
  {
    lease_id: "LSE-005",
    tenant_id: 5,
    tenant_name: "GreenTech Manufacturing",
    tenant_logo: "/placeholder.svg?height=40&width=40&text=GT",
    execution_date: "2022-08-15",
    commencement_date: "2022-09-01",
    expiration_date: "2025-08-31",
    base_rent_annual: 540000,
    lease_term_months: 36,
    property_type: "Industrial",
    lease_structure: "Double Net (NN)",
    security_deposit: 90000,
    renewal_option: true,
    escalation_clause: { type: "Fixed", rate: 1500, frequency: "Monthly" },
    escalation_rate: 2.0,
    lease_document_url: "https://docs.example.com/lease-005.pdf",
    lease_status: "active",
    building_name: "Industrial Park West",
    building_id: "BLD-006",
    space_info: "Unit 5A-5C",
    days_until_expiry: 400,
    rent_roll: 45000,
    landlord_obligations: ["Structural maintenance", "Building insurance"],
    tenant_obligations: ["Interior maintenance", "Utilities", "Property taxes"],
    sublease_policy: "Not permitted",
    leased_spaces: [],
    amendment_history: [],
    payment_history: [],
  },
];

// Helper functions for managing the mock database
export const getLeases = () => mockLeases;
export const getTenants = () => mockTenants;
export const getBuildings = () => mockBuildings;
export const getSpaces = () => mockSpaces;

export const getSpacesByBuilding = (buildingId) => {
  return mockSpaces.filter((space) => space.buildingId === buildingId);
};

export const getAvailableSpacesByBuilding = (buildingId) => {
  return mockSpaces.filter(
    (space) => space.buildingId === buildingId && space.status === "Available"
  );
};

export const getTenantById = (tenantId) => {
  // Try both new and legacy ID formats
  return mockTenants.find(
    (tenant) =>
      tenant.tenant_id === tenantId || // New format
      tenant.tenant_id === String(tenantId) || // String conversion
      tenant.id === tenantId || // Legacy format
      tenant.id === parseInt(tenantId) // Legacy number format
  );
};

export const getBuildingById = (buildingId) => {
  return mockBuildings.find((building) => building.id === buildingId);
};

export const getSpaceById = (spaceId) => {
  return mockSpaces.find((space) => space.id === spaceId);
};

export const getLeaseById = (leaseId) => {
  return mockLeases.find((lease) => lease.lease_id === leaseId);
};

// Add a new lease to the mock database
export const addLease = (newLease) => {
  // Generate a unique lease ID
  const leaseId = `LSE-${String(mockLeases.length + 1).padStart(3, "0")}`;

  // Get tenant and building information
  const tenant = getTenantById(newLease.tenant_id);
  const building = getBuildingById(newLease.building_id);

  // Create complete lease object
  const completeLease = {
    lease_id: leaseId,
    tenant_name: tenant?.name || "Unknown Tenant",
    tenant_logo: tenant?.logo || "/placeholder.svg?height=40&width=40&text=T",
    building_name: building?.name || "Unknown Building",
    space_info: newLease.space_info || "TBD",
    days_until_expiry:
      newLease.lease_status === "draft"
        ? 0
        : calculateDaysUntilExpiry(newLease.expiration_date),
    leased_spaces: newLease.leased_spaces || [],
    amendment_history: newLease.amendment_history || [],
    payment_history: newLease.payment_history || [],
    ...newLease,
    lease_id: leaseId,
  };

  mockLeases.push(completeLease);
  return completeLease;
};

// Update an existing lease
export const updateLease = (leaseId, updatedData) => {
  const index = mockLeases.findIndex((lease) => lease.lease_id === leaseId);
  if (index !== -1) {
    // Get additional data
    const tenant = getTenantById(updatedData.tenant_id);
    const building = getBuildingById(updatedData.building_id);

    const updatedLease = {
      ...mockLeases[index],
      ...updatedData,
      tenant_name: tenant?.name || mockLeases[index].tenant_name,
      tenant_logo: tenant?.logo || mockLeases[index].tenant_logo,
      building_name: building?.name || mockLeases[index].building_name,
      days_until_expiry:
        updatedData.lease_status === "draft"
          ? 0
          : calculateDaysUntilExpiry(
              updatedData.expiration_date || mockLeases[index].expiration_date
            ),
    };

    mockLeases[index] = updatedLease;
    return updatedLease;
  }
  return null;
};

// Helper function to calculate days until expiry
const calculateDaysUntilExpiry = (expirationDate) => {
  if (!expirationDate) return 0;
  const today = new Date();
  const expiry = new Date(expirationDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Generate a random lease ID
export const generateLeaseId = () => {
  return `LSE-${generateId()}`;
};
