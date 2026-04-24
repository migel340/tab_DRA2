import * as React from "react";
import { Link } from "react-router";

interface BreadcrumbItem {
  label: string;
  to?: string; 
}

interface PageLayoutWrapperProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode; 
  children: React.ReactNode;
}

export default function PageLayoutWrapper({
  title,
  breadcrumbs,
  actions,
  children,
}: PageLayoutWrapperProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
        <div className="flex flex-col">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="text-sm text-muted-foreground mb-1">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={item.label}>
                  {item.to ? <Link to={item.to} className="hover:underline">{item.label}</Link> : <span>{item.label}</span>}
                  {index < breadcrumbs.length - 1 && <span className="mx-1">/</span>}
                </React.Fragment>
              ))}
            </nav>
          )}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="flex-1">{children}</div> {/* Tutaj renderowana jest właściwa treść strony */}
    </div>
  );
}