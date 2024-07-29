import { configureStore } from "@reduxjs/toolkit";
import {productsApi} from './reducers/api';


export const store = configureStore({
   reducer : {
      [productsApi.reducerPath] : productsApi.reducer,

   },
   middleware : (defaultMiddleWare) => [...defaultMiddleWare(),productsApi.middleware]
   
})