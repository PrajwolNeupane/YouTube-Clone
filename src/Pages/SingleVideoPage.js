import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Stack, Typography } from '@mui/material';
import { UilThumbsUp, UilCommentAlt, UilEye } from '@iconscout/react-unicons';
import Linkify from 'react-linkify';
import ReactPlayer from 'react-player/lazy';
import InfiniteScroll from 'react-infinite-scroll-component';
import { format } from 'timeago.js';
import axios from 'axios';
import '../index.css';

export default function SingleVideoPage() {

    const { id } = useParams();
    const theme = useTheme();
    const Navigate = useNavigate();

    const [autoPlaying, setAutoPlaying] = useState(true);
    const [videoData, setVideoData] = useState({});
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [numbers, setNumbers] = useState(10);
    const [channelID, setChannelID] = useState();
    const [channelData, setChannelData] = useState([{ snippet: {} }]);

    const NumberConverter = (num) => {
        var int_num = Number(num);
        if (int_num > 1000 && int_num < 1000000) {
            return `${(int_num / 1000).toFixed(2)} K`
        } else if (int_num > 1000000 && int_num < 1000000000) {
            return `${(int_num / 1000000).toFixed(2)} M`
        } else {
            return `${(int_num / 1000000000).toFixed(2)} B`
        }
    }

    const fetchMoreRelatedVideos = async () => {
        // setNumbers(numbers + 10);
        // try {
        //     const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${numbers}&relatedToVideoId=${id}&type=video&key=${process.env.REACT_APP_MAIN_KEY}`);
        //     setRelatedVideos(response.data.items);
        // } catch (e) {
        //     console.log(e);
        // }
        setTimeout(async function () {
            setNumbers(numbers + 10);
            try {
                const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${numbers}&relatedToVideoId=${id}&type=video&key=${process.env.REACT_APP_MAIN_KEY}`);
                setRelatedVideos(response.data.items);
            } catch (e) {
                console.log(e);
            }
        }, 2000)
    }


    useEffect(() => {
        const SingleVideoData = async () => {
            try {

                const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${process.env.REACT_APP_MAIN_KEY}`);
                setVideoData(response.data.items[0]);
                setChannelID(response.data.items[0].snippet?.channelId);

            } catch (e) {
                alert(e);
            }
        }
        if (id) {
            SingleVideoData()
        }
    }, [id]);

    useEffect(() => {
        const getChannelInformation = async () => {
            try {

                const result = await axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${channelID}&key=${process.env.REACT_APP_MAIN_KEY}`);
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
        if (Object.keys(videoData) !== 0) {
            document.title = videoData?.snippet?.title
        }
    }, [videoData]);

    useEffect(() => {
        const getRelatedVideos = async () => {
            try {
                const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&relatedToVideoId=${id}&type=video&key=${process.env.REACT_APP_MAIN_KEY}`);
                setRelatedVideos(response.data.items);
            } catch (e) {
                console.log(e);
            }
        }
        getRelatedVideos();
    }, []);

    const PlayListScroll = styled(InfiniteScroll)(({ theme }) => ({
        maxidth: "38%",
        minWidth: "38%",
        width: "30rem",
        display: "flex",
        flexDirection: "column",
        padding: "1% 0px",
        backgroundColor: theme.palette.text.light,
        gap: "10px",
        borderRadius: "20px",
        height: "100%"
    }))



    return (
        <Stack sx={{ flexDirection: "column", width: "100%" }}>
            <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`} width={"100%"} height={"520px"} playing={autoPlaying} controls />
            <Stack sx={{ flexDirection: "row", width: "96%", padding: "15px 2%", gap: "2%", justifyContent: "space-between" }}>
                <Stack sx={{ width: "60%", gap: "5px" }}>
                    <Typography variant='h2' sx={{ fontSize: "18px" }}>
                        {videoData?.snippet?.title}
                    </Typography>
                    <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => {
                            Navigate(`/channel/${channelData[0]?.id}`)
                        }}>
                            <Avatar src={channelData[0].snippet?.thumbnails?.default?.url} />
                            <Typography variant='h2' sx={{ fontSize: "15px" }}>{videoData?.snippet?.channelTitle} <br /> <Typography variant='h3' sx={{ fontSize: "14px", color: "text.main" }}>
                                {NumberConverter(channelData[0].statistics?.subscriberCount)} Subscriber </Typography></Typography>
                        </Stack>
                        <Stack sx={{ flexDirection: "row", gap: "10px" }}>
                            <Stack sx={{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "text.light", padding: "5px 10px", borderRadius: "20px", border: "1px gray solid", gap: "5px" }}>
                                <UilEye size="22px" />
                                <Typography variant='h3' sx={{ fontSize: "15px" }}>{NumberConverter(videoData?.statistics?.viewCount)}</Typography>
                            </Stack>
                            <Stack sx={{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "text.light", padding: "5px 10px", borderRadius: "20px", border: "1px gray solid", gap: "5px" }}>
                                <UilThumbsUp size="22px" />
                                <Typography variant='h3' sx={{ fontSize: "15px" }}>{NumberConverter(videoData?.statistics?.likeCount)}</Typography>
                            </Stack>
                            <Stack sx={{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "text.light", padding: "5px 10px", borderRadius: "20px", border: "1px gray solid", gap: "5px" }}>
                                <UilCommentAlt size="22px" />
                                <Typography variant='h3' sx={{ fontSize: "15px" }}>{NumberConverter(videoData?.statistics?.commentCount)}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack sx={{ width: "96%", gap: "10px", marginTop: "5px", borderRadius: "15px", backgroundColor: "text.light", padding: "15px 2%" }}>
                        <Typography variant='h2' sx={{ fontSize: "14px", color: "primary.light" }}>{NumberConverter(videoData?.statistics?.viewCount)} Views ·· {format(videoData?.snippet?.publishedAt)}</Typography>
                        <Typography variant='h4' sx={{ fontSize: "14px", color: "primary.light", lineHeight: "130%" }}><Linkify>{videoData?.snippet?.description}</Linkify></Typography>
                    </Stack>
                </Stack>
                <PlayListScroll dataLength={relatedVideos.length}
                    next={fetchMoreRelatedVideos}
                    refreshFunction={fetchMoreRelatedVideos}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                    hasMore={true}
                    loader={<Stack sx={{ flexDirection: "column", width: "100%", gap: "10px" }}>
                        <div className='video-loader image-loader playlist-video'></div>
                    </Stack>}
                >
                    <Typography variant='h3' sx={{ fontSize: "18px", margin: "0px 2%" }}>Related Videos</Typography>
                    {
                        relatedVideos.map((curr, indx) => (
                            <Stack sx={{
                                backgroundColor: "transparent",
                                flexDirection: "row", gap: "10px", padding: "5px 2%", cursor: "pointer", ":hover": {
                                    backgroundColor: "white"
                                }
                            }} key={indx} onClick={() => {
                                Navigate(`/video/${curr?.id?.videoId}`);
                            }}>
                                <img src={curr?.snippet?.thumbnails?.medium?.url} style={{ width: "150px", height: "90px", objectFit: "cover", borderRadius: "10px" }} />
                                <Typography variant='h3' sx={{ fontSize: "14px" }}>{curr?.snippet?.title}
                                    <Typography variant='h4' sx={{ fontSize: "14px" }}>{curr?.snippet?.channelTitle} </Typography>
                                    <Typography variant='h4' sx={{ fontSize: "13px" }}>{format(curr?.snippet?.publishedAt)}</Typography>
                                </Typography>
                            </Stack>
                        ))
                    }
                </PlayListScroll>
            </Stack>
        </Stack>
    )
}
