export interface Project {
  id: string
  title: string
  description: string
  products: string[]
  link: string
}

export const productCategories = [
  "Visitor Management",
  "Access Management",
  "Digital Key",
  "Emergency Communications",
  "Parking",
  "Content Management System (CMS)",
  "Email & Newsletters",
  "Surveys",
  "Services & Events",
  "Audiences",
  "Integrations",
  "Resource Booking",
  "Work Orders",
  "BMS Digital Gateway",
  "Building Transportation",
  "Marketplace",
  "Loyalty",
  "Food & Beverage",
  "Retail",
  "AI",
  "Analytics",
  "Mobile",
  "Admin Experience",
  "Tenant Experience",
  "Quantum City",
  "End User",
  "Admin",
  "Newsfeed",
  "Tenant Management",
  "Tenant Onboarding",
  "Comms",
  "User Management",
  "Access",
]

export const projects: Project[] = [
  {
    id: "work-order-image-recognition",
    title: "Work Order Image Recognition",
    description:
      "AI scans uploaded photos and intelligently pre-populates work order forms—dramatically reducing manual data entry and speeding up issue resolution.",
    products: ["End User", "Work Orders", "AI"],
    link: "https://pr-559.d17k81vmp8ikos.amplifyapp.com/service-requests?authToken=Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJzdWIiOjkzNDA4LCJ1c2VyX3V1aWQiOiIwZmU0YWFmOC1kZDRkLTQ2ZGUtODlmYi00NjM5ZDE2NGQyMjQiLCJpYXQiOjE3NDY4MDI0NTksImV4cCI6MTgzMzIwMjQ1OX0.1vh1rgTkttCMdeaLRzHtxhj9vcI4k_u6y22rhG7AsyY&apiUrl=https%3A%2F%2Fwww.hqoapp.com&locale=en&buildingUuid=ac4d394a-b1a2-4234-85a9-3377873d2bbc",
  },
  {
    id: "insights-bar",
    title: "Insights Bar",
    description:
      "Embedded AI-powered guidance throughout the platform—surfacing smart tasks, contextual automations, and personalized insights to keep your team one step ahead.",
    products: ["Admin", "Work Orders", "AI"],
    link: "https://gohqo.co/work-orders",
  },
  {
    id: "hqo-assistant",
    title: "HqO Assistant",
    description:
      "Your conversational AI partner—interact naturally to analyze data, get answers, and solve operational problems directly within the platform.",
    products: ["Admin", "AI"],
    link: "https://hqo.s3.us-east-1.amazonaws.com/cab2025/index.html",
  },
  {
    id: "ai-powered-analytics",
    title: "AI-Powered Analytics",
    description:
      "A complete redesign of our analytics platform—cleaner UI, richer data, and AI-generated recommendations for smarter decision-making.",
    products: ["Admin", "AI", "Analytics", "Newsfeed"],
    link: "https://hqo-insights.vercel.app",
  },
  {
    id: "connected-workflows",
    title: "Connected Workflows",
    description:
      "AI agents coordinate cross-product actions—linking work orders, bookings, visitors, and vendor services into seamless automated flows.",
    products: ["Admin", "Work Orders", "Resource Booking", "Visitor Management", "Services & Events", "AI"],
    link: "https://event-setup.vercel.app/",
  },
  {
    id: "lease-to-tenant-onboarding",
    title: "Lease-to-Tenant Onboarding",
    description:
      "Upload a lease and let AI do the rest—automatically set up tenants, assign users, configure discounts, and more, all in minutes.",
    products: ["Admin", "AI", "Tenant Management"],
    link: "https://v0-tailwind-ui-design-black.vercel.app/",
  },
  {
    id: "reimagined-admin-ui",
    title: "Tenant Two-way Chat",
    description:
      "Two-way messaging between landlords and tenants—real-time, personalized, and fully managed in one place.",
    products: ["Comms", "Admin"],
    link: "https://admin-ai-eight.vercel.app/",
  },
  {
    id: "robust-tenant-admin",
    title: "Tenant Admin Console",
    description:
      "A brand-new interface for tenants—onboard with ease, invite users, manage credentials and credits, register visitors, and connect directly with property teams.",
    products: ["Admin", "User Management", "Access", "Tenant Onboarding"],
    link: "https://tenant-admin-phi.vercel.app/my-hqo",
  },
  {
    id: "tenant-lifecycle-tracker",
    title: "Tenant Lifecycle Tracker",
    description:
      "Track tenants from pre-lease to offboarding with a visual, stage-based lifecycle view. Stay aligned across leasing, operations, and property management teams with centralized, AI-enhanced tracking.",
    products: ["Admin", "Tenant Management", "Tenant Onboarding"],
    link: "https://v0-tenant-lifecycle-card.vercel.app/",
  },
  {
    id: "quantum-city",
    title: "Quantum City",
    description:
      "Benchmark and showcase city performance with AI-powered scoring across liberty, efficiency, compute, and citizen experience—down to individual buildings.",
    products: ["Analytics", "AI", "Quantum City"],
    link: "https://quantum-city.vercel.app/",
  },
  {
    id: "enhanced-work-orders",
    title: "Enhanced Work Orders",
    description:
      "Streamlined work order management with advanced filtering, status tracking, SLAs, two-way comms, multi-building support and more.",
    products: ["Admin", "Work Orders"],
    link: "https://v0-work-orders.vercel.app/",
  },
  {
    id: "hqo-ops-mobile",
    title: "HqO Ops · Mobile app",
    description: "It's an on-the-go app for building teams to communicate, perform tasks, and ask questions.",
    products: ["Admin", "Mobile", "Comms", "Work Orders"],
    link: "https://v0-hq-o-ops.vercel.app/",
  },
]
