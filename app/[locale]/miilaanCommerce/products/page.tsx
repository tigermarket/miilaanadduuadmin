import { Suspense } from "react";

import { Metadata } from "next";

import Search from "@/components/ui/search";
import { CreateInvoice } from "@/components/commerce/products/buttons";
import { InvoicesTableSkeleton } from "@/components/ui/skeletons";
import Table from "@/components/commerce/products/table";
import Pagination from "@/components/commerce/products/pagination";
import { DashboardPage } from "@/components";

export const metadata: Metadata = {
  title: "Invoices",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = 12;

  return (
    <DashboardPage>
      <div className="w-full">
        {/* <div className="flex w-full items-center justify-between">
          <h1 className={`${geistSans.variable} text-2xl`}>Invoices</h1>
        </div> */}
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search invoices..." />
          <CreateInvoice />
        </div>
        <Suspense
          key={query + currentPage}
          fallback={<InvoicesTableSkeleton />}
        >
          <Table query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </DashboardPage>
  );
}
