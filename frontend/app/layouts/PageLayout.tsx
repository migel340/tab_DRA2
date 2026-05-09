import { Link, useMatches } from "react-router";
import { Fragment } from "react/jsx-runtime";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

interface PageLayoutWrapperProps {
  title: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function PageLayout({
  title,
  actions,
  children,
}: PageLayoutWrapperProps) {
  const matches = useMatches();
  const breadcrumbs = matches
    .filter((m: any) => m.handle?.breadcrumb)
    .map((m: any, index, array) => {
      const isLast = index === array.length - 1;
      const label =
        typeof m.handle.breadcrumb === "function"
          ? m.handle.breadcrumb(m)
          : m.handle.breadcrumb;

      return { label, path: m.pathname, isLast };
    });

  return (
    <div className="flex flex-col h-full bg-background p-8 rounded-2xl gap-5 ">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map(({ label, isLast, path }) => (
              <Fragment key={path}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={path}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold">{title}</h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
