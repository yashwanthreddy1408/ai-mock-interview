
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import React from "react";
  

interface CustomBreadCrumbProps {
    breadCrumbPage: string;
    breadCrumbItems?: { link: string; label: string }[]; 
}

const CustomBreadCrumb = ({ breadCrumbPage, breadCrumbItems }: CustomBreadCrumbProps) => {
  return (
    <Breadcrumb>
        <BreadcrumbList>
            
            <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center justify-center hover:text-emerald-500">
                    Home
                </BreadcrumbLink>
            </BreadcrumbItem>
            
            {breadCrumbItems &&
                breadCrumbItems.map((item, i) => (
                    <React.Fragment key={i}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={item.link} className="hover:text-emerald-500">
                                {item.label}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </React.Fragment>
                ))
            }

            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage>
                    {breadCrumbPage}
                </BreadcrumbPage>
            </BreadcrumbItem>
        
        </BreadcrumbList>
    </Breadcrumb>

  )
}

export default CustomBreadCrumb