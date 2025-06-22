import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from 'react'
import { Button } from '../ui/button';
import { brandMap, categoryMap } from '@/config';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ShoppingProductTile({product,handleGetProductDetails,handleAddToCart,homepage=false}) {
      const navigate = useNavigate();
  

  return (
    <div>
<Card className="w-full sm:max-w-xs md:max-w-sm mx-auto h-full flex flex-col">
  <div onClick={() => handleGetProductDetails(product?._id)} className="flex-grow cursor-pointer">
    <div className="relative">
      <img
        src={product?.image}
        alt={product?.title}
        className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover rounded-t-lg"
      />
      {product?.totalStock === 0 ? (
        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
          Out of Stock
        </Badge>
      ) : product?.totalStock < 10 ? (
        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
          Only {product?.totalStock} items left
        </Badge>
      ) : product?.salePrice > 0 ? (
        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">Sale</Badge>
      ) : null}
    </div>

    <CardContent className="p-4 pb-0 md:pb-4">
      <h2 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2 md:h-[3.5rem] h-[1.5rem]">
        {product?.title}
      </h2>

      <div className="flex justify-between items-center mb-2">
        <span className="text-[14px] sm:text-[16px] text-muted-foreground">{categoryMap[product?.category]}</span>
        <span className="text-[14px] sm:text-[16px] text-muted-foreground">{brandMap[product?.brand]}</span>
      </div>

      {!homepage && (
        <div className="flex justify-between items-center mb-2">
          <span
            className={`${
              product?.salePrice > 0 ? "line-through" : ""
            } text-lg font-semibold text-primary`}
          >
            ₹ {product?.price}
          </span>
          {product?.salePrice > 0 && (
            <span className="text-lg font-semibold text-primary">₹ {product?.salePrice}</span>
          )}
        </div>
      )}
    </CardContent>
  </div>

  <CardFooter>
    {!homepage ? (
      product?.totalStock === 0 ? (
        <Button className="w-full opacity-60 cursor-not-allowed">Out of Stock</Button>
      ) : (
        <Button className="w-full" onClick={() => handleAddToCart(product?._id, product?.totalStock)}>
          Add to Cart
        </Button>
      )
    ) : (
      <Button className="w-full" onClick={() => navigate("/shop/listing")}>
        Shop More
      </Button>
    )}
  </CardFooter>
</Card>


    </div>
  )
}

export default ShoppingProductTile;
