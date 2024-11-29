import { configureStore  } from "@reduxjs/toolkit";
import auth from './AuthSlice';
const store = configureStore({
    reducer
}) ;


export default store;