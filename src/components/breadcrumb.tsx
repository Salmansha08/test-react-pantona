"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/dashboard") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  const filteredSegments =
    segments[0] === "dashboard" ? segments.slice(1) : segments;

  const items = filteredSegments.map((segment, index) => {
    const segmentIndex = segments[0] === "dashboard" ? index + 1 : index;
    const path = `/${segments.slice(0, segmentIndex + 1).join("/")}`;

    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return { label, path };
  });

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {items.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === items.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.path}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
