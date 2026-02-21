import {
  BarChart2,
  FileText,
  LayoutDashboard,
  Mail,
  Sparkles,
  Plus,
  Users,
} from "lucide-react";

export const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Invoice Creation",
    description:
      "Paste any text, email, or receipt and let our AI instantly generate a complete, professional invoice for you. ",
  },

  {
    icon: BarChart2,
    title: "AI-Powered Dashboard Insights",
    description:
      "get smart , actionable insights about your business finances, generated automatically by AI.",
  },
  {
    icon: Mail,
    title: "Smart Payment Reminders",
    description:
      "Automatically generate polite and effective payment reminder emails using AI, helping you get paid faster with less effort.",
  },
  {
    icon: FileText,
    title: "Easy Invoice Management",
    description:
      "Organize, track, and manage all your invoices in one place with our user-friendly interface designed for efficiency.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "AI Invoice Generator has transformed the way I handle invoicing. The AI-powered invoice creation is incredibly accurate and saves me hours of work each week.",
    author: "Jane Doe",
    title: "Freelance Designer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "The smart payment reminders have significantly improved my cash flow. Clients respond better to the AI-generated emails, and I get paid faster",
    author: "John Smith",
    title: "Small Business Owner",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "The AI-powered dashboard insights provide valuable information about my business finances. It's like having a personal financial advisor at my fingertips.",
    author: "Alex Johnson",
    title: "Small Business Owner",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    quote:
      "Managing invoices has never been easier. The intuitive interface and AI features make it simple to stay organized and on top of my billing.",
    author: "Sarah Williams",
    title: "Freelance Writer",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export const FAQS = [
  {
    question: "How does the AI-powered invoice creation work?",
    answer:
      "Our AI analyzes the text, email, or receipt you provide and generates a professional invoice by extracting relevant details such as items, prices, and client information.",
  },
  {
    question: "Is there free trial available?",
    answer:
      "Yes, we offer a 14-day free trial for new users to explore all the features of our AI Invoice Generator without any limitations.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "You can cancel your subscription at any time from your account settings. There are no cancellation fees, and you will retain access to the service until the end of your billing cycle.",
  },
  {
    question: "Is my data secure with AI Invoice Generator?",
    answer:
      "Absolutely. We prioritize your data security and privacy. All data is encrypted in transit and at rest, and we comply with industry-standard security practices to protect your information.",
  },
  {
    question: "Can I change my subscription plan later?",
    answer:
      "Yes, you can upgrade or downgrade your subscription plan at any time from your account settings. The changes will take effect immediately, and you will be billed accordingly.",
  },
  {
    question: "Can other info be added to an invoice?",
    answer:
      "Yes, our AI Invoice Generator allows you to customize invoices by adding additional information such as logos, payment terms, and notes to suit your business needs.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, including Visa, MasterCard, American Express, as well as PayPal for your convenience.",
  },
];

// Navigation items configuration

export const NAVIGATION_MENU = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "invoices", name: "Invoices", icon: FileText },
  { id: "invoices/new", name: "Create Invoice", icon: Plus },
  { id: "profile", name: "Profile", icon: Users },
];
