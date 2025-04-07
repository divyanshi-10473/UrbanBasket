import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice'
import AdminProductSlice from './admin/products-slice'
import ShopProductSlice from './shop/products-slice'
import ShopCartSlice from './shop/cart-slice'
import ShopAddressSlice from './shop/address-slice'
import ShopOrderSlice from './shop/order-slice'
import AdminOrderSlice from './admin/order-slice'
import ShopSearhcSlice from './shop/search-slice'
import shopReviewSlice from "./shop/review-slice";
import commonFeatureSlice from './common-slice'

const store=configureStore({
    reducer:{
           auth: authReducer,
           adminProduct: AdminProductSlice,
           shopProduct: ShopProductSlice,
           shopCart: ShopCartSlice,
           shopAddress: ShopAddressSlice,
           shopOrder: ShopOrderSlice ,
           adminOrder: AdminOrderSlice,
           shopSearch: ShopSearhcSlice,
           shopReview: shopReviewSlice,
           commonFeature : commonFeatureSlice

    }
})

export default store;