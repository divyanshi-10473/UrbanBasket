import { ChartNoAxesCombined} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

const adminSidebarMenuItems=[
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard />
    },
    {
      id: "product",
      label: "Products",
      path: "/admin/product",
      icon: <LayoutDashboard />
    },
    {
      id: "order",
      label: "Order",
      path: "/admin/order",
      icon: <LayoutDashboard />
    },
  ]
function MenuItem({setOpen}){
    const navigate =useNavigate();
        return <nav className=" flex-col flex gap-2 mt-8 ">
            {
                adminSidebarMenuItems.map(menuItem=> <div key={menuItem.id} onClick={()=>{
                    navigate(menuItem.path)
                    setOpen ? setOpen(false) : null;
                    }} className="flex text-xl cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground " > 
                {menuItem.icon}
                <span>{menuItem.label}</span>
                </div>)
            }
        </nav>
}

function AdminSideBar({open, setOpen}){
    const navigate = useNavigate();
    return(
        <Fragment >
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="w-64 ">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="border-b">
                            <SheetTitle className="flex gap-2 mt-5 mb-5">
                            <ChartNoAxesCombined />
                            <span>Admin Panel</span>
                            </SheetTitle>
                        </SheetHeader>
                       <MenuItem setOpen={setOpen}/>
                    </div>
                </SheetContent>
            </Sheet>
            <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex gap-5">
                <div onClick={()=>{
                    navigate("/admin/dashboard");
                }} className="flex items-center gap-2 cursor-pointer ">
                <ChartNoAxesCombined />
                    <h1 className="text-2xl font-extrabold">Admin Panel</h1>
                </div>
                <MenuItem/>
            </aside>
        </Fragment>
    )
}
export default AdminSideBar;