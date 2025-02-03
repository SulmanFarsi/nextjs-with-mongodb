"use client";
import { usePathname } from "next/navigation";
import {
  Breadcrumb as _,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import Link from "next/link";

const Breadcrumb: React.FC = () => {
  const pathName = usePathname().split("/").filter(Boolean);
  return (
    <_>
      <BreadcrumbList>
        {pathName.map((data, i) => {
          const isLast = i + 1 === pathName.length;
          const link = `/${pathName.slice(0, i + 1).join("/")}`;
          const text =
            data.slice(0, 1).toUpperCase() + data.slice(1, data.length);
          return (
            <React.Fragment key={i}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{text}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={link}>{text}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </_>
  );
};

export default Breadcrumb;
