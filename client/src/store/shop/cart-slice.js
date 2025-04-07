import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    isLoading: false,
   cartList: [],
   
}

export const AddCart = createAsyncThunk("/cart/addItem",
    async ({  userId, productId, quantity  }) => {

        
        const result = await axios.post(`http://localhost:5000/api/shop/cart/add`,{userId, productId, quantity} 

        )

        return result?.data;
    })
    
    export const FetchCart = createAsyncThunk("/cart/fetchItem",
        async (userId)  => {
            
            const result = await axios.get(`http://localhost:5000/api/shop/cart/get/${userId}`, userId, {
                
            })
            
            return result?.data;
        })
        
        export const UpdateCart = createAsyncThunk("/cart/updateItem",
            async ({  userId, productId, quantity  }) => {
        
                ;
                const result = await axios.put(`http://localhost:5000/api/shop/cart/update`,{userId, productId, quantity},{
        
                })
        
                return result?.data;
            })


            export const DeleteCart = createAsyncThunk("/cart/delete", async({userId, productId })=>{
                const result =await axios.delete(`http://localhost:5000/api/shop/cart/delete/${userId}/${productId}`,
                  
                )
                return result?.data;
            })    
        const ShopCartSlice = createSlice({
        name: "shopCart",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
            .addCase(AddCart.pending, (state) => {
                state.isLoading = true;
    
            }).addCase(AddCart.fulfilled, (state, action) => {
    
                state.isLoading = false;
                state.cartList = action.payload.data;
    
            }).addCase(AddCart.rejected, (state, action) => {
                console.log(action.payload);
                state.isLoading = false;
                state.cartList = [];
            }).addCase(FetchCart.pending, (state) => {
                state.isLoading = true;
    
            }).addCase(FetchCart.fulfilled, (state, action) => {
    
                state.isLoading = false;
                state.cartList = action.payload.data;
    
            }).addCase(FetchCart.rejected, (state, action) => {
                console.log(action.payload);
                state.isLoading = false;
                state.cartList = [];
            }).addCase(UpdateCart.pending, (state) => {
                state.isLoading = true;
    
            }).addCase(UpdateCart.fulfilled, (state, action) => {
    
                state.isLoading = false;
                state.cartList = action.payload.data;
    
            }).addCase(UpdateCart.rejected, (state, action) => {
                console.log(action.payload);
                state.isLoading = false;
                state.cartList = [];
            }).addCase(DeleteCart.pending, (state) => {
                state.isLoading = true;
    
            }).addCase(DeleteCart.fulfilled, (state, action) => {
    
                state.isLoading = false;
                state.cartList = action.payload.data;
    
            }).addCase(DeleteCart.rejected, (state, action) => {
                console.log(action.payload);
                state.isLoading = false;
                state.cartList = [];
            })
        }
    })
    
    export default ShopCartSlice.reducer;