import React, { Suspense } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";


const layout = async ({ params }) => {
    const { FileNumber } = await params;
    const breadcrumb = [
        { href: "#", name: "Licensing Authority" },
        { href: "/dashboard", name: "Dashboard" },
    ];

    return (
        <SidebarLayout breadcrumb={breadcrumb}>
            <Suspense fallback={<Loading />}>
                <Page FileNumber={FileNumber} />
            </Suspense>
        </SidebarLayout>
    )
}

export default layout
