import { Typography, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { format } from 'timeago.js';

export default function SearchPage() {

    const { title } = useParams();
    const Navigate = useNavigate();
    const theme = useTheme();
    const [searchedVideo, setSearchedVideo] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [number, setNumber] = useState(20);

    const fetchMoreSearchVideo = () => {
        setTimeout(async function () {
            setNumber(number + 10);
            try {
                const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=NP&key=${process.env.REACT_APP_MAIN_KEY}`);
                setCategoriesList(response.data.items);
            } catch (e) {
                alert(e);
            }
        },2000);
    }

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

    useEffect(() => {

        const getSearchedVideo = async () => {
            try {
                const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelType=any&maxResults=20&q=${title}&safeSearch=none&type=video&key=${process.env.REACT_APP_GAME_KEY}`);
                setSearchedVideo(response.data.items);
            } catch (e) {

            }
        }

        if (title) {
            getSearchedVideo();
        }
    }, [title]);

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
                        <Typography variant='h3' sx={{ color: "primary.main", fontSize: "14px", padding: "10px 10%", cursor: "pointer", borderRadius: "8px", backgroundColor: "white", ":hover": { backgroundColor: "text.light", } }} key={indx} onClick={() => {
                            Navigate(`/channel/${curr?.snippet?.channelId}`);
                        }}>{curr?.snippet?.title}</Typography>
                    ))
                }
            </Stack>
            <Stack sx={{ width: "80%" }}>
                <GridBox
                    dataLength={searchedVideo?.length}
                    next={fetchMoreSearchVideo}
                    hasMore={true}
                    loader={<Stack sx={{ flexDirection: "column", width: "23%", gap: "10px" }}>
                        <div className='video-loader image-loader'></div>
                        <div className='video-loader detail-loader'></div>
                    </Stack>}
                    refreshFunction={fetchMoreSearchVideo}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                >
                    {
                        searchedVideo?.map((curr, indx) => (
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
