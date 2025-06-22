import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { Button } from '../ui/button'
import ShopOrderDetails from './orderDetails'
import { Dialog } from '../ui/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from '@/store/shop/order-slice'
import { Badge } from '@/components/ui/badge';

function ShoppingOrders  (){
  const [openDetailsDialog, setOpenDetailsDialog]= useState(false);
  const dispatch = useDispatch();
  const {user} = useSelector(state=> state.auth);
  const {orderList, orderDetails} = useSelector(state=> state.shopOrder);
  
  function handleFetchOrderDetails(getId){
    dispatch(getOrderDetails(getId))
  }

  useEffect(()=>{
    dispatch(getAllOrdersByUserId(user?.id))
  },[dispatch])

  useEffect(()=> {
    if(orderDetails!=null){
      setOpenDetailsDialog(true);
    }
  },[orderDetails])

  
  return (
    <div>
      <Card  className='bg-white/55'>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
        <Table>
 
  <TableHeader>
    <TableRow>
      <TableHead>Order Id</TableHead>
      <TableHead>Order Date</TableHead>
      <TableHead>Order Status</TableHead>
      <TableHead >Order Price</TableHead>
      <TableHead className="sr-only" >Details</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {orderList && orderList.length>0 ? 
    orderList.map(orderItem =>
    <TableRow>
      <TableCell>{orderItem?._id}</TableCell>
      <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
      <TableCell><Badge className={`${ orderItem?.orderStatus === "confirmed" || orderItem?.orderStatus==="delivered"
                    ? "bg-green-500"
                    : orderItem?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-yellow-600"}`}>{orderItem?.orderStatus}</Badge></TableCell>
      <TableCell >₹{orderItem?.totalAmount}</TableCell>
      <TableCell >
      <Dialog open={openDetailsDialog} 
      onOpenChange={()=>{setOpenDetailsDialog(false)
         dispatch(resetOrderDetails())}} >
        <Button onClick={()=> handleFetchOrderDetails(orderItem?._id)} >View Details</Button>
        <ShopOrderDetails orderDetails={orderDetails} />
        </Dialog>
      </TableCell>

    </TableRow>
    ) : null}
  </TableBody>
</Table>

        </CardContent>
      </Card>
    </div>
  )
}

export default ShoppingOrders 
