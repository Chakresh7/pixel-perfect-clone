import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, FileText, BarChart2, Key, Settings,
  BookOpen, HelpCircle, Search, Bell, ChevronDown, Building, Folder,
  ChevronsLeft, ChevronsRight, Menu, X, MoreHorizontal, Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumb?: string | string[];
}

const mainNav = [
  { icon: LayoutDashboard, label: 'Overview', route: '/dashboard' },
  { icon: FolderOpen, label: 'Projects', route: '/dashboard/projects' },
  { icon: FileText, label: 'Documents', route: '/dashboard/documents' },
  { icon: BarChart2, label: 'Analytics', route: '/dashboard/analytics' },
  { icon: Key, label: 'API Keys', route: '/dashboard/api-keys' },
  { icon: Settings, label: 'Settings', route: '/dashboard/settings' },
];

const secondaryNav = [
  { icon: BookOpen, label: 'Documentation', route: '#', external: true },
  { icon: HelpCircle, label: 'Help & Support', route: '#' },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, breadcrumb }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (route: string) =>
    route === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(route);

  const sidebarWidth = collapsed ? 'w-16' : 'w-[240px]';
  const contentMargin = collapsed ? 'lg:ml-16' : 'lg:ml-[240px]';

  const breadcrumbItems = breadcrumb
    ? Array.isArray(breadcrumb) ? breadcrumb : [breadcrumb]
    : ['Dashboard'];

  const renderSidebarContent = (isMobile: boolean) => (
    <div className="flex flex-col h-full">
      {/* Org switcher */}
      <div className="px-4 py-3 border-b border-dark-border hover:bg-dark-surface transition-colors cursor-pointer">
        <div className="flex items-center gap-2">
          <Building className="w-3.5 h-3.5 text-[#475569] flex-shrink-0" />
          {(!collapsed || isMobile) && (
            <>
              <span className="text-xs font-medium text-[#94A3B8] truncate">Chakresh kumar's Org</span>
              <ChevronDown className="w-3 h-3 text-[#475569] ml-auto flex-shrink-0" />
            </>
          )}
        </div>
      </div>

      {/* Project switcher */}
      <div className="px-4 py-2 pb-3 border-b border-dark-border hover:bg-dark-surface transition-colors cursor-pointer">
        <div className="flex items-center gap-2">
          <Folder className="w-3.5 h-3.5 text-[#475569] flex-shrink-0" />
          {(!collapsed || isMobile) && (
            <>
              <span className="text-xs text-[#64748B] truncate">Default</span>
              <ChevronDown className="w-3 h-3 text-[#475569] ml-auto flex-shrink-0" />
            </>
          )}
        </div>
      </div>

      {/* Main nav */}
      <div className="flex-1 pt-2 overflow-y-auto">
        {(!collapsed || isMobile) && (
          <div className="px-4 py-2">
            <span className="font-mono text-[9px] uppercase text-gray-700 tracking-widest">MAIN</span>
          </div>
        )}

        <nav className="px-2 space-y-0.5">
          {mainNav.map((item) => {
            const active = isActive(item.route);
            return (
              <Link
                key={item.route}
                to={item.route}
                onClick={() => isMobile && setMobileOpen(false)}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-100',
                  collapsed && !isMobile ? 'justify-center px-0' : '',
                  active
                    ? 'bg-dark-surface-raised text-[#F8FAFC] font-medium'
                    : 'text-[#64748B] hover:bg-dark-surface hover:text-[#94A3B8]'
                )}
                title={collapsed && !isMobile ? item.label : undefined}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-brand-blue rounded-r" />
                )}
                <item.icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-brand-blue' : 'text-[#64748B] opacity-80')} />
                {(!collapsed || isMobile) && <span className="text-[13px]">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 my-2 h-px bg-dark-border" />

        {/* Secondary nav */}
        <nav className="px-2 space-y-0.5">
          {secondaryNav.map((item) => (
            <a
              key={item.label}
              href={item.route}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-[#64748B] hover:bg-dark-surface hover:text-[#94A3B8] transition-all duration-100',
                collapsed && !isMobile ? 'justify-center px-0' : ''
              )}
              title={collapsed && !isMobile ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0 opacity-80" />
              {(!collapsed || isMobile) && (
                <span className="text-[13px]">
                  {item.label}
                  {item.external && ' ↗'}
                </span>
              )}
            </a>
          ))}
        </nav>
      </div>

      {/* Bottom: Usage */}
      {(!collapsed || isMobile) && (
        <div className="border-t border-dark-border px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase text-gray-700 tracking-widest">STARTER USAGE</span>
            <Info className="w-3 h-3 text-[#475569]" />
          </div>

          {/* Storage */}
          <div className="mt-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-[#64748B]">Storage</span>
              <span className="text-[10px] font-mono text-[#475569]">0.00022GB / 2GB</span>
            </div>
            <div className="mt-1 h-[3px] bg-dark-border rounded-full overflow-hidden">
              <div className="h-full bg-brand-blue rounded-full transition-all duration-300" style={{ width: '0.01%' }} />
            </div>
          </div>

          {/* Queries */}
          <div className="mt-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-[#64748B]">Queries</span>
              <span className="text-[10px] font-mono text-[#475569]">0 / 1M</span>
            </div>
            <div className="mt-1 h-[3px] bg-dark-border rounded-full overflow-hidden">
              <div className="h-full bg-brand-blue rounded-full transition-all duration-300" style={{ width: '0%' }} />
            </div>
          </div>

          <button className="w-full mt-3 font-mono text-[10px] text-[#64748B] border border-dark-border-subtle px-3 py-1.5 rounded-[5px] hover:border-gray-600 hover:text-[#94A3B8] transition-colors">
            Upgrade now
          </button>
        </div>
      )}

      {/* Bottom: User */}
      <div className="border-t border-dark-border px-4 py-3 flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dark-surface-raised border border-dark-border-subtle flex items-center justify-center">
          <span className="font-mono text-[11px] text-white font-semibold">CK</span>
        </div>
        {(!collapsed || isMobile) && (
          <>
            <span className="text-xs text-[#94A3B8] truncate">Chakresh Kumar</span>
            <span className="ml-auto font-mono text-[9px] text-[#475569] bg-dark-border px-1.5 py-0.5 rounded-[3px]">Starter</span>
          </>
        )}
      </div>

      {/* Collapse toggle — desktop only */}
      {!isMobile && (
        <div className="border-t border-dark-border px-2 py-2 flex justify-end">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-[#475569] hover:text-[#94A3B8] hover:bg-dark-surface transition-colors"
          >
            {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-dark-bg border-b border-dark-border flex items-center justify-between px-4 lg:px-8">
        {/* Left: mobile menu + breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 rounded-md text-[#64748B] hover:text-[#94A3B8] hover:bg-dark-surface"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-sm font-medium">
            {breadcrumbItems.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-[#475569] mx-1">/</span>}
                <span className={i === breadcrumbItems.length - 1 ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'}>
                  {item}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button className="p-[7px] rounded-md text-[#64748B] hover:bg-dark-surface hover:text-[#94A3B8] transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-[7px] rounded-md text-[#64748B] hover:bg-dark-surface hover:text-[#94A3B8] transition-colors">
            <Bell className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-dark-border mx-1" />

          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-dark-surface-raised border border-dark-border-subtle flex items-center justify-center">
              <span className="font-mono text-xs font-semibold text-[#94A3B8]">CK</span>
            </div>
            <span className="hidden sm:inline text-[13px] text-[#94A3B8]">Chakresh Kumar</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#475569]" />
          </div>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col fixed left-0 top-16 bottom-0 bg-[#0D0D14] border-r border-dark-border transition-all duration-200 z-40',
        sidebarWidth
      )}>
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[240px] bg-[#0D0D14] border-r border-dark-border flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b border-dark-border">
              <span className="text-sm font-semibold text-white">RagFloe</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-[#64748B] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderSidebarContent(true)}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className={cn(
        'mt-16 min-h-[calc(100vh-64px)] transition-all duration-200',
        contentMargin
      )}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
