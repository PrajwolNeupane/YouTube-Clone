import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    home_video:[]
}
const HomeVideoSlice = createSlice({
    name:"HomeVideo",
    initialState,
    reducers:{
        setHomeVideo:(state,action) => {
            state.home_video = action.payload;
        }
    }
});

export default HomeVideoSlice.reducer;
export const {setHomeVideo} = HomeVideoSlice.actions; 