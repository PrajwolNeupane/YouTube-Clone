import { Avatar, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { format } from 'timeago.js';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setHomeVideo } from '../State Management/HomeVideoSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../index.css';
import axios from 'axios';

export default function HomePage() {

    const theme = useTheme();
    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const { home_video } = useSelector((State) => State.HomeVideo);

    const [numbers, setNumbers] = useState(20);
    const [categoriesList, setCategoriesList] = useState([]);

    const fetchHomeVideoData = () => {
        setTimeout(async function () {
            setNumbers(numbers + 10);
            try {
                const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${numbers}&type=video&key=${process.env.REACT_APP_GAME_KEY}`);
                localStorage.setItem("home_video", JSON.stringify(res.data?.items));
                dispatch(setHomeVideo(JSON.parse(localStorage.getItem("home_video"))));
            } catch (e) {
                alert(e);
                dispatch(setHomeVideo(JSON.parse(localStorage.getItem("home_video"))));
            }
        }, 20000)
    }


    // useEffect(() => {
    //     const fetchChannelImage =  () => {
    //         home_video.map( async (curr,indx) => {
    //             try{
    //                 const result = await axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${curr?.snippet?.channelId}&key=${process.env.REACT_APP_MAIN_KEY}`);
    //                 setChannelImage([...channelImage,result.data.items[0].snippet?.thumbnails?.default?.url]);
    //             }catch(e){
    //                 setChannelImage([...channelImage,"no"]);
    //             }
    //         })
    //     }
    //     fetchChannelImage();
    //     console.log(channelImage);
    // }, [ home_video]);

    useEffect(() => {
        document.title = "You Tube Clone"
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=NP&key=${process.env.REACT_APP_GAME_KEY}`);
                setCategoriesList(response.data.items);
            } catch (e) {
                console.log(e);
            }
        }
        fetchCategories();
    }, []);


    const GridBox = styled(InfiniteScroll)(({ theme }) => ({
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-center",
        justifyContent: "flex-center",
        paddingBottom: "20px"
    }))

    return (
        <Stack sx={{ flexDirection: "row" }}>
            <Stack sx={{ width: "20%", height: "100vh", backgroundColor: "white", padding: "20px 0px", gap: "5px", overflowY: "scroll" }}>
                <Typography variant='h3' sx={{ color: "primary.main", fontSize: "14px", padding: "10px 10%", cursor: "pointer", borderRadius: "8px", backgroundColor: "white", ":hover": { backgroundColor: "text.light", } }}>Categories</Typography>
                {
                    categoriesList?.map((curr, indx) => (
                        <Typography variant='h3' sx={{ color: "primary.main", fontSize: "14px", padding: "10px 10%", cursor: "pointer", borderRadius: "8px", backgroundColor: "white", ":hover": { backgroundColor: "text.light", } }} key={indx} onClick={()=>{
                            Navigate(`/channel/${curr?.snippet?.channelId}`);
                        }}>{curr?.snippet?.title}</Typography>
                    ))
                }
            </Stack>
            <Stack sx={{ width: "80%" }}>
                <GridBox
                    dataLength={home_video?.length}
                    next={fetchHomeVideoData}
                    hasMore={true}
                    loader={<Stack sx={{ flexDirection: "column", width: "23%", gap: "10px" }}>
                        <div className='video-loader image-loader'></div>
                        <div className='video-loader detail-loader'></div>
                    </Stack>}
                    refreshFunction={fetchHomeVideoData}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                >
                    {
                        home_video?.map((curr, indx) => (
                            <Stack key={indx} sx={{
                                width: "23%", transition: ".5s", cursor: "pointer", borderRadius: "15px", backgroundColor: "white", ":hover": {
                                    backgroundColor: "text.light"
                                }, padding: "10px 1%", gap: "10px"
                            }} onClick={() => { Navigate(`/video/${curr?.id?.videoId}`) }}>
                                <img src={curr?.snippet?.thumbnails?.medium?.url} style={{ borderRadius: "15px" }} />
                                <Stack sx={{ flexDirection: "row", gap: "10px" }}>
                                    <Typography variant='h3' sx={{ fontSize: "15px" }}>
                                        {curr?.snippet?.title}
                                        <Typography variant='h3' sx={{ fontSize: "14px", color: "text.main" }}>{curr?.snippet?.channelTitle}</Typography>
                                        <Typography variant='h3' sx={{ fontSize: "13px", color: "text.main" }}>{format((curr?.snippet?.publishedAt))}</Typography>
                                    </Typography>
                                </Stack>
                            </Stack>
                        ))
                    }
                </GridBox>
            </Stack>
        </Stack>
    )
}
