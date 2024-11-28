import { configureStore  } from "@reduxjs/toolkit";
import auth from './AuthSlice';
const store = configureStore({
    reducer:{auth}
}) ;


export default store;