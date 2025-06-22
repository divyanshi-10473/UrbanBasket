import { Outlet } from "react-router-dom";
import AdminSideBar from './sidebar';
import AdminHeader from './header';
import { useState } from "react";
function AdminLayout(){
    const[openSidebar, setOpenSidebar]=useState(false);
    return(
        <div className="flex min-h-screen w-full">
            <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
            <div className="flex flex-1 flex-col bg-gradient-to-br from-orange-200 via-orange-50 to-orange-200">
            <AdminHeader setOpen={setOpenSidebar}/>
                <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6 overflow-x-auto">
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout;