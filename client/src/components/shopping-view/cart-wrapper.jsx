import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import CartItem from './cart-items';
import { Navigate, useNavigate } from 'react-router-dom';

function CartWrapper({cartList,setOpenCartSheet}) {
    const totalAmount = cartList && cartList.length>0 ? cartList.reduce((sum, item) => sum +(item?.salePrice>0 ? item?.salePrice : item?.price)*item?.quantity,0) : 0;
    const navigate = useNavigate();
  return (
    <SheetContent className='sm: max-w-md'>
        <SheetHeader>
            <SheetTitle>
                YOur Cart
            </SheetTitle>
        </SheetHeader>
        <div className='mt-8 space-y-4'>
             {cartList && cartList.length > 0 ?
                cartList.map((item,index) => 
                    <CartItem key={index} item={item} />

             ):null
             }
             
        </div>
        <div className='mt-8 space-y-4'>
            <div className='flex justify-between'>
                <span className='font-bold'>Total</span>
                <span className='font-bold'>₹ {totalAmount}</span>
            </div>
        </div>

        <Button onClick={()=> 
        {
            navigate('/shop/checkout')
            setOpenCartSheet(false);
        }
        } 
            className='w-full mt-5'>CheckOut</Button>

    </SheetContent>
  )
}

export default CartWrapper;
