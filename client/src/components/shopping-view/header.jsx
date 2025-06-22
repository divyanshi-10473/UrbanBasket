import { House, LogOut, Menu, Search, ShoppingCart, UserRoundPen } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingMenuItems } from "@/config";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser, resetTokenAndCredentials } from "@/store/auth-slice";
import CartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { FetchCart } from "@/store/shop/cart-slice";
import { Label } from "@radix-ui/react-dropdown-menu";
import image from '../../assets/logo1.png'

function MenuItem() {

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    function handleNavigate(getItem) {
        sessionStorage.removeItem('filters')
        const currentFilter = getItem.id !== 'home' && getItem.id !== 'products' && getItem.id !== 'search' ?
            {
                category: [getItem.id]
            } : null
        sessionStorage.setItem('filters', JSON.stringify(currentFilter))

        location.pathname.includes('listing') && currentFilter !== null ? 
        setSearchParams(new URLSearchParams(`?category=${getItem.id}`)):
        navigate(getItem.path)
    }

    return <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row cursor-pointer">
        {
            shoppingMenuItems.map(menuItem => <Label onClick={() => handleNavigate(menuItem)} key={menuItem.id} to={menuItem.path} className="text-sm font-medium">{menuItem.label ==='Search' ?<Search/> :menuItem.label} </Label>)
        }
    </nav>
}



function HeaderRight() {
    const { user } = useSelector(state => state.auth)
    const [openCartSheet, setOpenCartSheet] = useState(false);
    const { cartList } = useSelector(state => state.shopCart)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleLogout() {
        // dispatch(logoutUser());
                dispatch(resetTokenAndCredentials());
                sessionStorage.clear();
                navigate("/auth/login");
    }

    useEffect(() => {
        dispatch(FetchCart(user?.id));
    }, [dispatch])



    return <div className="flex lg:items-center lg:flex-row  gap-4 ">
        <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
            <Button variant="outline" size="icon" className="relative" onClick={() => {
                setOpenCartSheet(true); 
                
            }}>
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-[-7px] right-[-7px] text-sm font-bold text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
  {cartList?.items?.length || 0}
</span>
                <span className="sr-only"> User Cart</span>
            </Button>
            <CartWrapper 
            setOpenCartSheet={setOpenCartSheet}
            cartList={cartList && cartList.items && cartList.items.length > 0 ? cartList.items : []} />
        </Sheet>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="bg-black cursor-pointer" >

                    <AvatarFallback className="bg-black text-white font-extrabold ">{user?.userName[0].toUpperCase()}</AvatarFallback>
                </Avatar>

            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" className="w-56 " >
                <DropdownMenuLabel>Welcome {user?.userName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/shop/account")}> <UserRoundPen className="mr-2 h-4 w-4 " /> Account</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}> <LogOut className="mr-2 h-4 w-4 cursor-pointer" /> Logout</DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    </div>
}

function ShoppingHeader() {
    const { isAuthenticated } = useSelector(state => state.auth)
    return (
        <header className="fixed top-0 z-40 w-full border-b bg-orange-50">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <Link to='/shop/home' className="flex items-center gap-2">
                    <img src={image} alt="logo"  className="w-40"/>
                </Link>

                <section className="flex gap-4">

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="lg:hidden">
                                <Menu />
                                <span className="sr-only"> Toggle header menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-full max-w-xs">

                            <MenuItem />
                        </SheetContent>
                    </Sheet>

                    <div className="block lg:hidden ">

                        <HeaderRight />
                    </div>
                </section>
                <div className="hidden lg:block">
                    <MenuItem />

                </div>
                {
                    isAuthenticated ? <div className="hidden lg:block">  <HeaderRight /> </div> : null
                }

            </div>
        </header>
    )
}

export default ShoppingHeader;