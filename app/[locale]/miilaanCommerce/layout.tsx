import SideNav from "@/components/commerce/sidenav";
import Screen from "@/components/Screen";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Screen>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-52">
          <SideNav />
        </div>

        <div className="grow  md:overflow-y-auto ">{children}</div>
      </div>
    </Screen>
  );
}
