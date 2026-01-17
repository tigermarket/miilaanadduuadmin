import Link from "next/link";
import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Text } from "./adduwebui";

interface ListItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface HeaderBarProps {
  headerTitle: string;
  lists: ListItem[];
  userImage?: string;
}

export default function DashBoardHeader({
  headerTitle,
  lists,
  userImage,
}: HeaderBarProps) {
  return (
    <div className="flex items-center justify-between p-4">
      {/* Left: Title */}
      <Text variant="titleLarge">{headerTitle}</Text>

      {/* Right: Links + User */}
      <div className="flex items-center gap-4">
        {lists.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex   items-center justify-center rounded-md hover:bg-sky-100 hover:text-blue-600"
              )}
            >
              <Icon className="w-6 h-6" />
            </Link>
          );
        })}

        {userImage ? (
          <Image
            src={userImage}
            alt="User avatar"
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <UserCircleIcon className="w-6 h-6 text-gray-600" />
        )}
      </div>
    </div>
  );
}
