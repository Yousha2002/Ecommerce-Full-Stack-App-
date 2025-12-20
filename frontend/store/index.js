import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";
import wishlistReducer from "./slices/wishlistSlice";
import reviewReducer from "./slices/reviewSlice";
import homeSectionReducer from "./slices/homeSectionSlice";
import flashDealReducer from "./slices/flashDealSlice";
import comingSoonReducer from './slices/comingSoonSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    categories: categoryReducer,
    users: userReducer,
    admin: adminReducer,
    wishlist: wishlistReducer,
    reviews: reviewReducer,
    homeSections: homeSectionReducer,
    flashDeals: flashDealReducer,
    comingSoon: comingSoonReducer,
  },
});

export default store;
