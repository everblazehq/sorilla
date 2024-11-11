import { Home, Users, Settings } from "lucide-react"
import SupabaseLogo from './SupabaseLogo'

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  }
]
 
export function AppSidebar() {
  return (
    <div className="w-[264px] p-4">
      <div className="pt-8 pl-4 mb-12">
        <SupabaseLogo />
      </div>
      <ul className="m-0 pl-8 list-none">
        {items.map((item) => (
          <li className="mb-6" key={item.title}>
            <a className="flex items-center gap-2" href={item.url}>
              <item.icon size={20} />
              <span>{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
