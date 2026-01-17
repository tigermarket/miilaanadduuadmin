import { DashBoardHeader, SecondaryScreen } from "@/components";
import CardWrapper from "@/components/commerce/commerceCard";
import LatestInvoices from "@/components/commerce/latest-invoices";
import RevenueChart from "@/components/commerce/revenue-chart";

import {
  CardsSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from "@/components/ui/skeletons";

import {
  BellAlertIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/outline";

import { Suspense } from "react";
const lists = [
  {
    name: "Commerce.Links.Dashboard",
    href: "/en/miilaanCommerce",
    icon: MagnifyingGlassCircleIcon,
  },
  {
    name: "Commerce.Links.Products",
    href: "/en/miilaanCommerce/products",
    icon: BellAlertIcon,
  },
];
export default async function Page() {
  return (
    <main>
      <DashBoardHeader headerTitle="Miilaan Commerce Dashboard" lists={lists} />
      <SecondaryScreen>
        <div className="p-6 ">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<CardsSkeleton />}>
              <CardWrapper />
            </Suspense>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8 ">
            <Suspense fallback={<RevenueChartSkeleton />}>
              <RevenueChart />
            </Suspense>
            <Suspense fallback={<LatestInvoicesSkeleton />}>
              <LatestInvoices />
            </Suspense>
          </div>
        </div>
      </SecondaryScreen>
    </main>
  );
}
