import type { Metadata } from 'next';

// Base metadata for all pages
export const metadata: Metadata = {
  title: 'Marble May - AI App Builder',
  description: 'Build custom AI-powered web apps for your business using natural language descriptions.',
  keywords: ['AI', 'app builder', 'web app generator', 'AI-powered', 'business apps'],
  authors: [{ name: 'Marble May Team' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://marble-may.vercel.app/',
    title: 'Marble May - AI App Builder',
    description: 'Build custom AI-powered web apps for your business using natural language descriptions.',
    siteName: 'Marble May',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marble May - AI App Builder',
    description: 'Build custom AI-powered web apps for your business using natural language descriptions.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

// Dynamic page metadata generators
export function generateDashboardMetadata(): Metadata {
  return {
    title: 'Dashboard - Marble May',
    description: 'Manage your AI-powered web applications created with Marble May.',
  };
}

export function generateBuilderMetadata(): Metadata {
  return {
    title: 'App Builder - Marble May',
    description: 'Create custom web applications using AI for your business needs.',
  };
}

export function generateProjectMetadata(projectName: string): Metadata {
  return {
    title: `${projectName} - Marble May`,
    description: `Manage your ${projectName} project in the Marble May app builder.`,
  };
} 