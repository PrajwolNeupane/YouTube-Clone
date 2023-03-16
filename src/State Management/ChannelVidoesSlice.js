import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    video_list:[],
    play_list:[]
}
const ChannelVideosSlice = createSlice({
    name:"ChannelVideos",
    initialState,
    reducers:{
        setChannelVideos:(state,action) => {
            state.video_list = action.payload;
        },
        setPlayList:(state,action) => {
            state.play_list = action.payload;
        }
    }
});

export default ChannelVideosSlice.reducer;
export const {setChannelVideos,setPlayList} = ChannelVideosSlice.actions; 