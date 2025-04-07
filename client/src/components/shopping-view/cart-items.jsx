import { Minus, Plus, Trash } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { DeleteCart, UpdateCart } from '@/store/shop/cart-slice';
import { useToast } from '@/hooks/use-toast';

function CartItem({key,item}) {
    const {user} = useSelector(state=> state.auth)
    const dispatch = useDispatch();
    const {toast}= useToast();
    const {cartList} = useSelector(state=> state.shopCart)
     const {productList} = useSelector(state=> state.shopProduct)

  function handleCartDelete(cartItem){
    

    dispatch(DeleteCart({userId: user?.id, productId: cartItem?.productId})).then(data=>{
        if(data?.payload?.success){
            toast({
                title: 'Item Deleted from Cart',
            })
        }
    })
     
  }
  function handleUpdateQuantity(item, typeofAction){

    if(typeofAction === 'plus'){
        let getCartItems = cartList.items || [];

        if(getCartItems.length){
            const indexOfCurrentItem = getCartItems.findIndex(itm=>itm.productId === item?.productId);
            
            const getCurrentProductIndex = productList.findIndex((product )=> product._id === item?.productId)
            const totalStock = productList[getCurrentProductIndex].totalStock
            if(indexOfCurrentItem> -1){

                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if(getQuantity +1 > totalStock){
                    toast({
                        title: `Only ${getQuantity} can be added for this item`,
                        variant: "destructive"
                    })
                    return ;
                }
            }
            
        }

    }

    dispatch(UpdateCart({userId: user?.id, productId: item?.productId, quantity:
    typeofAction === 'plus' ? item?.quantity+1 : item?.quantity-1})).then(data=>{
        if(data?.payload?.success){
            toast({
                title: 'Quantity updated successfully!!',
            })
        }
    })
  }
  return (
    
    <div className='flex items-center space-x-4'>
        <img src={item?.image} alt={item?.title} className='w-20 h-20 rounded object-cover' />
        <div className='flex-1'>
            <h3 className='font-extrabold'>{item?.title}</h3>
            <div className='flex items-center mt-1 gap-2'>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl " onClick={()=> handleUpdateQuantity(item, "minus")} disabled={item?.quantity ===1}>
                    <Minus className='w-4 h-4'/>
                    <span className='sr-only'>Decrease</span>
                </Button>
                <span>{item?.quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl" onClick={()=> handleUpdateQuantity(item, "plus")}>
                    <Plus className='w-4 h-4'/>
                    <span className='sr-only'>increase</span>
                </Button>
            </div>
        </div>
        <div className='flex flex-col items-end'>
            <p className='font-semibold'>
            ₹ {((item?.salePrice >0 ? item?.salePrice: item?.price) * item?.quantity).toFixed(2)}
            </p>
            <Trash onClick={()=>
                handleCartDelete(item)
            } className='cursor-pointer mt-1 ' size={20}/>
        </div>
    </div>
  )
}

export default CartItem
