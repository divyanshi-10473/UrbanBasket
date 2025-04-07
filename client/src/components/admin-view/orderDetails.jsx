import { DialogContent } from '../../components/ui/dialog'
import { Label } from '@radix-ui/react-dropdown-menu'
import React, { useState } from 'react'
import { Separator } from '../ui/separator'
import CommonForm from '../common/form'
import { Badge } from '../ui/badge'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from '@/store/admin/order-slice'
import { useToast } from '@/hooks/use-toast'

const initialFormData={
    status:''
}

function AdminOrderDetails({orderDetails}) {
     const [formData, setFormData]= useState(initialFormData)
     const { user } = useSelector((state) => state.auth);
     const dispatch = useDispatch();
     const {toast} = useToast();

     function handleUpdateStatus(event){
          event.preventDefault();
         const {status} = formData;

         dispatch(updateOrderStatus({id: orderDetails?._id , orderStatus: status})).then(data=>{
         
          if(data?.payload.success){
            dispatch(getOrderDetailsForAdmin(orderDetails?._id))
            dispatch(getAllOrdersForAdmin());
            setFormData(initialFormData);
            toast({
              title: data?.payload?.message
            })
          }
        }
          )
     }
    return (
        <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed" || orderDetails?.orderStatus==="delivered"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-yellow-600"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
          <div className="font-medium text-lg mb-2">Order Details</div>
<ul className="grid gap-3">
 
  <li className="grid grid-cols-3 font-semibold  pb-2">
    <span>Title</span>
    <span className="text-center">Quantity</span>
    <span className="text-right">Price</span>
  </li>

 
  {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
    ? orderDetails.cartItems.map((item, index) => (
        <li
          key={index}
          className="grid grid-cols-3 items-center "
        >
          <span>{item.title}</span>
          <span className="text-center">{item.quantity}</span>
          <span className="text-right">${item.price}</span>
        </li>
      ))
    : null}
</ul>

          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium border-t pt-3">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
                <div>
                    <CommonForm
                    formControls={[
                            {
                                label: "Order Status",
                                name: "status",
                                componentType: "select",
                                options: [
                                  { id: "pending", label: "Pending" },
                                  { id: "inShipping", label: "In Shipping" },
                                  { id: "inProcess", label: "In Process" },
                                  { id: "delivered", label: "Delivered " },
                                  { id: "rejected", label: "Rejected" },

                                ],
                            }
                        ]}
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleUpdateStatus}
                        buttonText={'Update Order Status'}

                   />
                </div>
      </div>
    </DialogContent>
    )
}

export default AdminOrderDetails