import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  weatherInfo: [],
  weatherLocalInfo: null,
};

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setWeatherInfo: (state, { payload }) => {
      state.weatherInfo = payload;
    },
    setWeatherLocalInfo: (state, { payload }) => {
      state.weatherLocalInfo = payload;
    },
  },
});

export const { setWeatherInfo, setWeatherLocalInfo } = weatherSlice.actions;
export default weatherSlice.reducer;
