import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturn() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
const cartItems = JSON.parse(sessionStorage.getItem("cartItems"));
const userId = sessionStorage.getItem("userId");
const addressInfo = JSON.parse(sessionStorage.getItem("addressInfo"));
const totalAmount = sessionStorage.getItem("totalAmount");

dispatch(
  capturePayment({
    paymentId,
    payerId,
    userId,
    cartItems,
    addressInfo,
    totalAmount,
  })
)
.then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <Card className="mt-20">
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturn;
