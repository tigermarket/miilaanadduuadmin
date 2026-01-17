import { DashBoardHeader, SecondaryScreen } from "@/components";
import { Text } from "@/components/adduwebui";

import {
  BellAlertIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/outline";

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
interface ScreenProps {
  children: React.ReactNode;
}
export default async function Page({ children }: ScreenProps) {
  return (
    <main>
      <DashBoardHeader headerTitle="Customers" lists={lists} />
      <SecondaryScreen>
        <div className="p-6 w-full h-full ">{children}</div>
      </SecondaryScreen>
    </main>
  );
}
