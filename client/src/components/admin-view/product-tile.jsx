import React from 'react'
import { Card , CardContent, CardFooter} from '../ui/card';
import { Button } from '../ui/button';




function AdminProductTile({product, setCurrentEditId, setFormData, setOpenCreateProd,handleDelete}) {
  
  
    
  return (
      <Card className="w-full max-w-sm mx-auto">
    <div>
        <div className='relative'>
        <img src={product.image} alt={product.title} className='w-full h-[280px] object-cover rounded-t-lg'/>
        </div>
        <CardContent>
            <h2 className="text-lg font-bold mb-2 mt-2">{product.title}</h2>
            <div className='flex justify-between items-center mb-2'>
                <span className={`${product?.salePrice >0 ? "line-through": ""} text-lg font-semibold text-primary`}> ₹ {product?.price} </span>
              {product?.salePrice>0 && <span className='text-lg font-bold'>₹ {product?.salePrice}</span>}
            </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button onClick={
            () => {
              setCurrentEditId(product._id);
              setFormData(product);
              setOpenCreateProd(true);
              }
          } > Edit</Button>
            <Button onClick={()=>handleDelete(product._id)}> Delete</Button>
        </CardFooter>
    </div>
      </Card>
  )
}

export default AdminProductTile;
