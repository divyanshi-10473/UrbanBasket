import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import React, { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { StarIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { setProductDeatils } from '@/store/shop/products-slice';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from '@radix-ui/react-label';
import StarRatingComponent from '../common/star-rating';
import { addReview, getReviews } from '@/store/shop/review-slice';
import { toast } from '@/hooks/use-toast';



function ProductDialog({ open, setOpen, productDetails,handleAddToCart }) {
  const dispatch = useDispatch();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const {user}= useSelector((state)=> state.auth)
  const {reviews} = useSelector((state)=> state.shopReview)


  function handleRatingChange(getRating){
    setRating(getRating);
}
   function handleAddReview(){
    dispatch(addReview({
      productId: productDetails?._id,
      userId: user?.id,
      userName: user?.userName,
      reviewMessage: reviewMsg,
      reviewValue: rating,
    })).then((data)=>{
      if(data?.payload?.success){
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id))
        toast({
          title: "Review Added Successfully",
        })
      }
    })
   }

  function handleDialogClose(){
    setOpen(false);
    dispatch(setProductDeatils())
    setRating(0);
    setReviewMsg("");
  }

  useEffect(()=>{
    if(productDetails!==null){
      dispatch(getReviews(productDetails?._id))
    }
  },[productDetails])

  const averageReview = reviews && reviews.length> 0 ?
  reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
  reviews.length: 0


  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title || 'Product Image'}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div >
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title || 'No Title'}</h1>
            <p className="text-muted-foreground mt-4 mb-5">{productDetails?.description || 'No Description available.'}</p>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 mt-2'>
            <div className='flex items-center gap-0.5'>
                           <StarRatingComponent rating={averageReview}/>
                           
                        </div>
                        <span className='text-muted-foreground'>{averageReview.toFixed(1)}</span>
            </div>
            <p className={`text-3xl font-bold text-primary ${productDetails?.salePrice>0 ? 'line-through': ''}`}> ${productDetails?.price}</p>
            {
                productDetails?.salePrice>0 ? <p className="text-3xl font-bold text-primary">${productDetails?.salePrice}</p>: null
            }
          </div>
          <div className='mt-5 mb-5'>
          { productDetails?.totalStock === 0 ?( <Button className="w-full opacity-60 cursor-not-allowed" >Out of Stock</Button>): (
                            <Button className="w-full" onClick={()=>handleAddToCart(productDetails?._id, productDetails?.totalStock)}>Add to Cart</Button> )}
          </div>
          <Separator/>
          <div className='max-h-[300px] overflow-auto'>
            <h2 className='text-xl fontvold mb-4'>Reviews</h2>
            <div className='grid gap-6'>
              {
                reviews && reviews.length >0 ? 
                reviews.map(reviewItem=> <div className='flex gap-4'>
                  <Avatar className='w-10 h-10 border'>
                      <AvatarFallback>{reviewItem?.userName[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className='grid gap-1'>
                      <div className='flex items-center gap-2'>
                          <h3 className='font-bold'>{reviewItem?.userName}</h3>
                      </div>
                      <div className='flex items-center gap-0.5'>
                        <StarRatingComponent rating={reviewItem?.reviewValue}/>
                          
                      </div>
                      <p className='text-muted-foreground'> {reviewItem?.reviewMessage}</p>
                  </div>
              </div>): <h1>No reviews</h1>
              }
               
            </div>
            <div className='mt-10 flex-col flex gap-1'>
              <Label>Write a review</Label>
              <div className='flex gap-2'>
                    <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange}/>
              </div>
                <Input name="reviewMsg" value={reviewMsg} onChange={(event)=> setReviewMsg(event.target.value)} placeholder="Write a review...."></Input>
                <Button onClick={handleAddReview} disabled={reviewMsg.trim()===""}>Submit</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDialog;
