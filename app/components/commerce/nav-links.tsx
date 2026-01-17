// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import clsx from "clsx";

// import { useEffect } from "react";

// import { useTranslations } from "next-intl";

// // Map of links to display in the side navigation.
// // Depending on the size of the application, this would be stored in a database.

// import {
//   HomeIcon,
//   Squares2X2Icon,
//   BoltIcon,
//   UserGroupIcon,
//   ShoppingCartIcon,
//   ChartBarIcon,
//   Cog6ToothIcon,
// } from "@heroicons/react/24/outline";
// import { useTheme } from "../adduwebui";

// const links = [
//   {
//     name: "Commerce.Links.Dashboard",
//     href: "/miilaanCommerce",
//     icon: HomeIcon, // dashboard = home
//   },
//   {
//     name: "Commerce.Links.Products",
//     href: "/miilaanCommerce/products",
//     icon: Squares2X2Icon, // grid/catalog for products
//   },
//   {
//     name: "Commerce.Links.Flash sales",
//     href: "/miilaanCommerce/flashSales",
//     icon: BoltIcon, // lightning bolt = flash/urgent
//   },
//   {
//     name: "Commerce.Links.Customers",
//     href: "/miilaanCommerce/customers",
//     icon: UserGroupIcon, // group of people = customers
//   },
//   {
//     name: "Commerce.Links.Orders",
//     href: "/en/miilaanCommerce/orders",
//     icon: ShoppingCartIcon, // cart = orders
//   },
//   {
//     name: "Commerce.Links.Reports",
//     href: "/miilaanCommerce/reports",
//     icon: ChartBarIcon, // bar chart = reports/analytics
//   },
//   {
//     name: "Commerce.Links.Settings",
//     href: "/miilaanCommerce/settings",
//     icon: Cog6ToothIcon, // gear = settings
//   },
// ];

// export default function NavLinks() {
//   const pathname = usePathname();
//   const t = useTranslations();
//   const theme = useTheme();

//   return (
//     <>
//       {links.map((link) => {
//         const LinkIcon = link.icon;
//         return (
//           <Link
//             key={link.name}
//             href={link.href}
//             className={clsx(
//               "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
//               {
//                 "bg-sky-100 text-blue-600": pathname === link.href,
//               }
//             )}
//           >
//             <LinkIcon
//               style={{
//                 color:
//                   pathname === link.href
//                     ? theme.colors.onPrimary
//                     : theme.colors.onBackground,
//               }}
//               className="w-6"
//             />

//             {/* <Text>{link.name}</Text> */}
//             <p className="hidden md:block">{t(link.name)}</p>
//           </Link>
//         );
//       })}
//     </>
//   );
// }
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import clsx from "clsx";
// import { useTranslations, useLocale } from "next-intl";

// import {
//   HomeIcon,
//   Squares2X2Icon,
//   BoltIcon,
//   UserGroupIcon,
//   ShoppingCartIcon,
//   ChartBarIcon,
//   Cog6ToothIcon,
// } from "@heroicons/react/24/outline";
// import { useTheme } from "../adduwebui";

// // Helper to normalize paths (removes locale prefix like /en/, /am/, etc.)
// function normalizePath(path: string) {
//   return path.replace(/^\/[a-z]{2}\//, "/");
// }

// export default function NavLinks() {
//   const pathname = usePathname();
//   const locale = useLocale();
//   const t = useTranslations();
//   const theme = useTheme();

//   // Build links dynamically with current locale
//   const links = [
//     {
//       name: "Commerce.Links.Dashboard",
//       href: `/${locale}/miilaanCommerce`,
//       icon: HomeIcon,
//     },
//     {
//       name: "Commerce.Links.Products",
//       href: `/${locale}/miilaanCommerce/products`,
//       icon: Squares2X2Icon,
//     },
//     {
//       name: "Commerce.Links.Flash sales",
//       href: `/${locale}/miilaanCommerce/flashSales`,
//       icon: BoltIcon,
//     },
//     {
//       name: "Commerce.Links.Customers",
//       href: `/${locale}/miilaanCommerce/customers`,
//       icon: UserGroupIcon,
//     },
//     {
//       name: "Commerce.Links.Orders",
//       href: `/${locale}/miilaanCommerce/orders`,
//       icon: ShoppingCartIcon,
//     },
//     {
//       name: "Commerce.Links.Reports",
//       href: `/${locale}/miilaanCommerce/reports`,
//       icon: ChartBarIcon,
//     },
//     {
//       name: "Commerce.Links.Settings",
//       href: `/${locale}/miilaanCommerce/settings`,
//       icon: Cog6ToothIcon,
//     },
//   ];

//   return (
//     <>
//       {links.map((link) => {
//         const LinkIcon = link.icon;
//         const isActive = normalizePath(pathname).startsWith(
//           normalizePath(link.href)
//         );

//         return (
//           <Link
//             key={link.name}
//             href={link.href}
//             className={clsx(
//               "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
//               {
//                 "bg-sky-100 text-blue-600": isActive,
//               }
//             )}
//           >
//             <LinkIcon
//               className={clsx("w-6", {
//                 "text-blue-600": isActive,
//                 "text-gray-600": !isActive,
//               })}
//               style={{
//                 color: isActive
//                   ? theme.colors.onPrimary
//                   : theme.colors.onBackground,
//               }}
//             />
//             <p className="hidden md:block">{t(link.name)}</p>
//           </Link>
//         );
//       })}
//     </>
//   );
// }
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useTranslations, useLocale } from "next-intl";

import {
  HomeIcon,
  Squares2X2Icon,
  BoltIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Text, useTheme } from "../adduwebui";

// Helper to normalize paths (removes locale prefix like /en/, /am/, etc.)
function normalizePath(path: string) {
  return path.replace(/^\/[a-z]{2}\//, "/");
}

export default function NavLinks() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const theme = useTheme();

  const links = [
    {
      name: "Commerce.Links.Products",
      href: `/${locale}/miilaanCommerce/products`,
      icon: Squares2X2Icon,
    },
    {
      name: "Commerce.Links.Flash sales",
      href: `/${locale}/miilaanCommerce/flashSales`,
      icon: BoltIcon,
    },
    {
      name: "Commerce.Links.Customers",
      href: `/${locale}/miilaanCommerce/customers`,
      icon: UserGroupIcon,
    },
    {
      name: "Commerce.Links.Orders",
      href: `/${locale}/miilaanCommerce/orders`,
      icon: ShoppingCartIcon,
    },
    {
      name: "Commerce.Links.Reports",
      href: `/${locale}/miilaanCommerce/reports`,
      icon: ChartBarIcon,
    },
    {
      name: "Commerce.Links.Settings",
      href: `/${locale}/miilaanCommerce/settings`,
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = normalizePath(pathname).startsWith(
          normalizePath(link.href)
        );

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[40px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-gray-50 hover:bg-gray-100": !isActive,
              }
            )}
            style={{
              backgroundColor: isActive
                ? theme.colors.inverseOnSurface
                : theme.colors.background,
              color: isActive
                ? theme.colors.primary
                : theme.colors.onBackground,
            }}
          >
            <LinkIcon className="w-6" />

            <p className="hidden md:block">{t(link.name)}</p>
          </Link>
        );
      })}
    </>
  );
}
