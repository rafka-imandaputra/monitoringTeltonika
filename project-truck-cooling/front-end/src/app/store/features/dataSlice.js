import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getAlat = createAsyncThunk(
    "posts/getAlat",
    async(arg, {erno}) => {
        try {
            const { data } = await axios.get('http://localhost:3001/alat')
            console.log(data)
            console.log("gfgfgfgfgg")
            return data
        } catch (err) {
            erno(err.response.data)
            // console.log("gfgfgfgfgg", err)
        }
    }
)

const dataSlice = createSlice({
    name: "posts",
    initialState:{
        data: [],
        isSuccess: false,
        message: "",
        loading: false,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getAlat.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAlat.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.isSuccess = true;
        })
        .addCase(getAlat.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload;
            state.isSuccess = false;
        });
    }
})

export default dataSlice