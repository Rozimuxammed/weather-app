import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "../redux/slices/weatherData-slice";
export const store = configureStore({
  reducer: { weatherReducer },
});
