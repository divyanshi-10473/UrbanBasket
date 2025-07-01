import Address from "../../components/shopping-view/address";
import image from '../../assets/account-banner.webp';
import { useDispatch, useSelector } from "react-redux";
import CartItem from "@/components/shopping-view/cart-items";
import { Button } from '../../components/ui/button'
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

function ShoppingCheckout() {
  const { cartList } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

 
  const totalCartAmount =
    cartList && cartList.items && cartList.items.length > 0
      ? cartList.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

function handleInitiatePaypalPayment() {
  if (cartList.length === 0) {
    toast({
      title: "Your cart is empty. Please add items to proceed",
      variant: "destructive",
    });
    return;
  }
  if (currentSelectedAddress === null) {
    toast({
      title: "Please select one address to proceed.",
      variant: "destructive",
    });
    return;
  }

  const cartItems = cartList.items.map((singleCartItem) => ({
    productId: singleCartItem?.productId,
    title: singleCartItem?.title,
    image: singleCartItem?.image,
    price:
      singleCartItem?.salePrice > 0
        ? singleCartItem?.salePrice
        : singleCartItem?.price,
    quantity: singleCartItem?.quantity,
  }));

  // ✅ Save everything needed for order creation in sessionStorage
  sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  sessionStorage.setItem("userId", user?.id);
  sessionStorage.setItem(
    "addressInfo",
    JSON.stringify({
      addressId: currentSelectedAddress?._id,
      address: currentSelectedAddress?.address,
      city: currentSelectedAddress?.city,
      pincode: currentSelectedAddress?.pincode,
      phone: currentSelectedAddress?.phone,
      notes: currentSelectedAddress?.notes,
    })
  );
  sessionStorage.setItem("totalAmount", totalCartAmount);

  // ✅ Only send minimal data to backend to create PayPal payment
  dispatch(
    createNewOrder({
      cartItems,
      totalAmount: totalCartAmount,
    })
  ).then((data) => {
    if (data?.payload?.success) {
      setIsPaymemntStart(true);
    } else {
      setIsPaymemntStart(false);
    }
  });
}


  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col mt-20  ">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={image} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5 bg-white/55">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartList && cartList.items && cartList.items.length > 0
            ? cartList.items.map((item) => (
                <CartItem item={item}  />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
