import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    isLoading: false,
    productList: [],
    productDetails:null,
}

export const FetchFilteredProducts = createAsyncThunk("/products/fetchFilteredProducts",
    async ({ filterParams, sortParams }) => {

        const query = new URLSearchParams({
            ...filterParams,
            sortBy: sortParams,
        });
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`, {

        })

        return result?.data;
    })

export const FetchProductDetails = createAsyncThunk("/products/fetchProductDetails",
    async (id ) => {

        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`, id, {
                    
        })

        return result?.data;
    })

const ShopProductSlice = createSlice({
    name: "shopProduct",
    initialState,
    reducers: {
        setProductDeatils:(state)=>{
            state.productDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(FetchFilteredProducts.pending, (state) => {
            state.isLoading = true;

        }).addCase(FetchFilteredProducts.fulfilled, (state, action) => {

            state.isLoading = false;
            state.productList = action.payload.data;

        }).addCase(FetchFilteredProducts.rejected, (state, action) => {
            
            state.isLoading = false;
            state.productList = [];
        }).addCase(FetchProductDetails.pending, (state) => {
            state.isLoading = true;

        }).addCase(FetchProductDetails.fulfilled, (state, action) => {

            state.isLoading = false;
            state.productDetails = action.payload.data;

        }).addCase(FetchProductDetails.rejected, (state, action) => {
          
            state.isLoading = false;
            state.productDetails= null;
        })
    }
})


export const {setProductDeatils}= ShopProductSlice.actions;
export default ShopProductSlice.reducer;