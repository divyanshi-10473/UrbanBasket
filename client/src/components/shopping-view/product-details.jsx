import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import React, { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { setProductDeatils } from '@/store/shop/products-slice';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from '@radix-ui/react-label';
import StarRatingComponent from '../common/star-rating';
import { addReview, getReviews } from '@/store/shop/review-slice';
import { toast } from '@/hooks/use-toast';

function ProductDialog({ open, setOpen, productDetails, handleAddToCart }) {
  const dispatch = useDispatch();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.shopReview);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddReview() {
    dispatch(addReview({
      productId: productDetails?._id,
      userId: user?.id,
      userName: user?.userName,
      reviewMessage: reviewMsg,
      reviewValue: rating,
    })).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review Added Successfully",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDeatils());
    setRating(0);
    setReviewMsg("");
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
    }
  }, [productDetails]);

  const averageReview = reviews && reviews.length > 0
    ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
    : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent
        className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 sm:p-6 md:p-8 max-w-[95vw] md:max-w-[85vw] lg:max-w-[70vw] max-h-[95vh] overflow-y-auto"
      >
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title || 'Product Image'}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{productDetails?.title || 'No Title'}</h1>
            <p className="text-muted-foreground mt-4 mb-5 text-sm sm:text-base">
              {productDetails?.description || 'No Description available.'}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                <StarRatingComponent rating={averageReview} />
              </div>
              <span className="text-muted-foreground">{averageReview.toFixed(1)}</span>
            </div>
            <p className={`text-2xl font-bold text-primary ${productDetails?.salePrice > 0 ? 'line-through' : ''}`}>
              ₹{productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 && (
              <p className="text-2xl font-bold text-primary">₹{productDetails?.salePrice}</p>
            )}
          </div>

          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">Out of Stock</Button>
            ) : (
              <Button className="w-full" onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}>
                Add to Cart
              </Button>
            )}
          </div>

          <Separator />

          <div className="max-h-[300px] overflow-auto mt-4">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, idx) => (
                  <div className="flex gap-4" key={idx}>
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>{reviewItem?.userName[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">{reviewItem?.reviewMessage}</p>
                    </div>
                  </div>
                ))
              ) : (
                <h1 className="text-muted-foreground">No reviews</h1>
              )}
            </div>

            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-2">
                <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ""}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDialog;
