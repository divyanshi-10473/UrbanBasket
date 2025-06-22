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
import { Dialog } from '../ui/dialog'
import AdminOrderDetails from './orderDetails'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from '@/store/admin/order-slice'
import { Badge } from '../ui/badge'


function AdminOrderView  (){
    const [openDetailsDialog, setOpenDetailsDialog]= useState(false);
    const {orderList, orderDetails} = useSelector(state=> state.adminOrder)
    const dispatch = useDispatch();

     function handleFetchOrderDetails(getId){
        dispatch(getOrderDetailsForAdmin(getId))
      }

    useEffect(()=>{
      dispatch(getAllOrdersForAdmin());
    },[dispatch]);

    

      useEffect(()=> {
        if(orderDetails!=null){
          setOpenDetailsDialog(true);
        }
      },[orderDetails])
  return (
    <div>
      <Card className='bg-white/55 w-[90vw] md:w-full mx-auto'>
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
         dispatch(resetOrderDetails())}} 
         >
        <Button 
        onClick={()=> handleFetchOrderDetails(orderItem?._id)} 
          >View Details</Button>
        <AdminOrderDetails orderDetails={orderDetails} />
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

export default AdminOrderView 
