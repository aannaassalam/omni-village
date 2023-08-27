// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// import axiosInstance from "../Helper/Helper"
// import { endpoints } from "../Endpoints/endpoints"

// const initialState = {
//     status: 'idle',
//     updateUser:{}
// }

// export const LandAllocation = createAsyncThunk(
//     'landallocation',
//     async(data)=>{
//         try{
//             let res = await axiosInstance?.post(endpoints?.auth?.land_allocation,data)
//             return {data:res?.data,status:res?.status}
//         }
//        catch(err){
//         return err
//        }

//     }
// )

// export const LandAllocationSlice = createSlice({
//     name:'land_allocation',
//     initialState,
//     reducers:{},
//     extraReducers:(builder)=>{
//         builder.addCase(LandAllocation.pending,(action,state)=>{
//             state.status = 'pending'
//         })
//         .addCase(LandAllocation.fulfilled,(state,{payload})=>{
//             if(payload?.status === 200){
              
//             }
//         })
//         .addCase(LandAllocation.pending,(action,state)=>{
//             state.status = 'pending'
//         })
//     }
// })