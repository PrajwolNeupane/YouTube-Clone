import { Typography, Stack, Avatar, Tabs, Tab } from '@mui/material';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled, useTheme } from '@mui/material/styles';
import { format } from 'timeago.js';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setChannelVideos, setPlayList } from '../State Management/ChannelVidoesSlice';

export default function ChannelPage() {

    const { channelID } = useParams();
    const [channelData, setChannelData] = useState([{ snippet: "" }]);
    const [value, setValue] = useState(0);
    const { video_list, play_list } = useSelector((state) => state.ChannelVideos);

    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const NumberConverter = (num) => {
        var int_num = Number(num);
        if (int_num <= 1000) {
            return int_num
        }
        else if (int_num > 1000 && int_num < 1000000) {
            return `${(int_num / 1000).toFixed(2)} K`
        } else if (int_num > 1000000 && int_num < 1000000000) {
            return `${(int_num / 1000000).toFixed(2)} M`
        } else {
            return `${(int_num / 1000000000).toFixed(2)} B`
        }
    }

    const onChangeTab = (event, newValue) => {
        setValue(newValue);
    }

    useEffect(() => {
        const getChannelInformation = async () => {
            try {

                const result = await axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings,contentDetails,statistics&id=${channelID}&key=${process.env.REACT_APP_COLL_KEY}`);
                setChannelData(result.data?.items);

            } catch (e) {
                alert(e);
            }
        }
        if (channelID) {
            getChannelInformation();
        }
    }, [channelID]);

    useEffect(() => {
        const fectChannelVideo = async () => {
            localStorage.setItem("channel_video", JSON.stringify(""));
            //dispatch(setChannelVideos(JSON.parse(localStorage.getItem("channel_video"))))
            try {
                const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?channelId=${channelID}&part=snippet&maxResults=10&type=video&key=${process.env.REACT_APP_COLL_KEY}`);
                localStorage.setItem("channel_video", JSON.stringify(response.data?.items));
                dispatch(setChannelVideos(JSON.parse(localStorage.getItem("channel_video"))))
            } catch (e) {
                alert(e);
            }
        }
        fectChannelVideo();
    }, [channelID]);

    useEffect(() => {
        const fectChannelPlaylist = async () => {
            localStorage.setItem("channel_playlist", JSON.stringify(""));
            //dispatch(setPlayList(JSON.parse(localStorage.getItem("channel_playlist"))))
            try {
                const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cid&channelId=${channelID}&maxResults=10&key=${process.env.REACT_APP_COLL_KEY}`);
                localStorage.setItem("channel_playlist", JSON.stringify(response.data?.items));
                dispatch(setPlayList(JSON.parse(localStorage.getItem("channel_playlist"))))
            } catch (e) {
                alert(e);
            }
        }
        fectChannelPlaylist();
    }, [channelID]);

    const GridBox = styled('div')(({ theme }) => ({
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center"

    }))



    return (
        <>
            <img src={`${channelData[0].brandingSettings?.image?.bannerExternalUrl}=w1707`} style={{ width: "100%", height: "300px", objectFit: "cover" }} />
            <Stack sx={{ backgroundColor: "text.light", padding: "20px 5%", gap: "10px" }}>
                <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "40px" }}>
                    <Avatar src={channelData[0].snippet?.thumbnails?.medium?.url} sx={{ width: "120px", height: "120px" }} />
                    <Typography variant='h3' sx={{ fontSize: "24px" }}>{channelData[0].snippet?.title}
                        <Typography variant='h3' sx={{ fontSize: "18px", color: "text.main", lineHeight: "120%" }}>{channelData[0].snippet?.customUrl}</Typography>
                        <Typography variant='h4' sx={{ fontSize: "16px", color: "text.main" }}>{NumberConverter(channelData[0].statistics?.subscriberCount) + " subscribers - " + NumberConverter(channelData[0].statistics?.videoCount) + " videos"}</Typography>
                    </Typography>
                </Stack>

                <Tabs value={value} fullWidth onChange={onChangeTab} sx={{
                    "& .MuiTabs-indicator": {
                        backgroundColor: "red",
                    }
                }} >
                    <Tab label='VIDEOS' disableFocusRipple={true} sx={{
                        fontSize: "15px", fontWeight: "700", marginRight: "20px",
                        color: "text.main",
                        "&.Mui-selected": {
                            color: "red",
                        },
                        "&:hover": {
                            color: "primary.main",
                        },
                    }} />
                    <Tab label='PLAYLISTS' disableFocusRipple={true} sx={{
                        fontSize: "15px", fontWeight: "700", marginRight: "20px",
                        color: "text.main",
                        "&.Mui-selected": {
                            color: "red",
                        },
                        "&:hover": {
                            color: "primary.main",
                        },
                    }} />
                    <Tab label='ABOUT' disableFocusRipple={true} sx={{
                        fontSize: "15px", fontWeight: "700",
                        color: "text.main",
                        "&.Mui-selected": {
                            color: "red",
                        },
                        "&:hover": {
                            color: "primary.main",
                        },
                    }} />
                </Tabs>
                {
                    value == 2 ? <><Typography variant='h3' sx={{ fontSize: "20px", marginTop: "10px", color: "primary.main" }}>Description</Typography>
                        <Typography variant='h4' sx={{ fontSize: "16px", color: "primary.light" }}>{channelData[0].snippet?.description}</Typography></> : <></>
                }{
                    value == 0 ? <GridBox>
                        {
                            video_list?.map((curr, indx) => (
                                <Stack key={indx} sx={{
                                    width: "23%", transition: ".5s", cursor: "pointer", borderRadius: "15px", backgroundColor: "text.light", ":hover": {
                                        backgroundColor: "white",
                                    }, padding: "10px 1%", gap: "10px"
                                }} onClick={() => { Navigate(`/video/${curr?.id?.videoId}`) }}>
                                    <img src={curr?.snippet?.thumbnails?.medium?.url} style={{ borderRadius: "15px" }} />
                                    <Stack sx={{ flexDirection: "row", gap: "10px" }}>
                                        <Avatar src={curr?.snippet?.thumbnails?.default?.url} />
                                        <Typography variant='h3' sx={{ fontSize: "15px" }}>
                                            {curr?.snippet?.title}
                                            <Typography variant='h3' sx={{ fontSize: "14px", color: "text.main" }}>{curr?.snippet?.channelTitle}</Typography>
                                            <Typography variant='h3' sx={{ fontSize: "13px", color: "text.main" }}>{format((curr?.snippet?.publishedAt))}</Typography>
                                        </Typography>
                                    </Stack>
                                </Stack>
                            ))
                        }
                    </GridBox> : <></>
                }
                {
                    value == 1 ? <GridBox>
                        {
                            play_list?.map((curr, indx) => (
                                <Stack key={indx} sx={{
                                    width: "279px", transition: ".5s", cursor: "pointer", borderRadius: "15px", backgroundColor: "text.light", ":hover": {
                                        backgroundColor: "white",
                                    }, padding: "10px 1%", gap: "10px"
                                }} onClick={() => { Navigate(`/playlist/${curr?.id}`) }}>
                                    <Stack sx={{ background: `linear-gradient(to Right,rgb(25, 26, 25,0),rgb(25, 26, 25,.3),rgb(25, 26, 25,.95),rgb(25, 26, 25,1)),url(${curr?.snippet?.thumbnails?.medium?.url})`, width: "100%", height: "170px", backgroundPosition: "center", backgroundRepeat: "no-repeat", alignItems: "flex-end", justifyContent: "center" }}>
                                        <Typography variant='h3' sx={{ color: "white", fontSize: "20px", marginRight: "5%" }}>Playlist</Typography>
                                        <Typography variant='h4' sx={{ color: "white", fontSize: "16px", marginRight: "5%" }}>{curr?.contentDetails?.itemCount}</Typography>
                                    </Stack>
                                    <Stack sx={{ flexDirection: "row", gap: "10px" }}>
                                        <Avatar src={curr?.snippet?.thumbnails?.default?.url} />
                                        <Typography variant='h3' sx={{ fontSize: "15px" }}>
                                            {curr?.snippet?.title}
                                            <Typography variant='h3' sx={{ fontSize: "14px", color: "text.main" }}>{curr?.snippet?.channelTitle}</Typography>
                                            <Typography variant='h3' sx={{ fontSize: "13px", color: "text.main" }}>{format((curr?.snippet?.publishedAt))}</Typography>
                                        </Typography>
                                    </Stack>
                                </Stack>
                            ))
                        }
                    </GridBox> : <></>
                }
            </Stack>
        </>
    )
}
