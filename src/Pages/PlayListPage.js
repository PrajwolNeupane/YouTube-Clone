import { Stack, Typography, Avatar } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import { format } from 'timeago.js';
import ReactPlayer from 'react-player/lazy';
import InfiniteScroll from 'react-infinite-scroll-component';


export default function PlayListPage() {

    const { list_id } = useParams();
    const theme = useTheme();
    const Navigate = useNavigate();


    const [playListVideos, setPlayListVideos] = useState([]);
    const [videoIndex, setVideoIndex] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const [numbers, setNumbers] = useState(10);
    const [channelID, setChannelID] = useState();
    const [channelData, setChannelData] = useState([{ snippet:{} }]);
    const [listMaxLength, setListMaxLength] = useState();

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


    const onVideoEnd = () => {
        if (Number(playListVideos.length) - 1 > videoIndex) {
            setVideoIndex(videoIndex + 1);
        }
    }

    const fetchMorePlayListVideo = async () => {
        setTimeout(async function () {
            setNumbers(numbers + 10);
            try {
                const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=${numbers}&playlistId=${list_id}&key=${process.env.REACT_APP_GAME_KEY}`);
                setPlayListVideos(response.data?.items);
            } catch (e) {
                alert(e);
            }
        }, 20000)
        //setNumbers(numbers + 10);
        // try {
        //     const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=${numbers}&playlistId=${list_id}&key=${process.env.REACT_APP_GAME_KEY}`);
        //     setPlayListVideos(response.data?.items);
        // } catch (e) {
        //     alert(e);
        // }

    }
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
            console.log(playListVideos[videoIndex]?.snippet?.channelId);
        }
    }, [channelID]);

    useEffect(() => {
        if (playListVideos.length !== 0) {
            document.title = playListVideos[videoIndex]?.snippet?.title
        }
    }, [videoIndex, playListVideos]);

    useEffect(() => {

        const getPlayListVideos = async () => {
            try {

                const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=10&playlistId=${list_id}&key=${process.env.REACT_APP_GAME_KEY}`);
                setPlayListVideos(response.data?.items);
                setListMaxLength(response.data?.pageInfo?.totalResults)
                setChannelID(response.data?.items[0]?.snippet?.channelId);


            } catch (e) {
                alert(e);
            }
        }
        getPlayListVideos();
    }, [list_id]);


    const PlayListScroll = styled(InfiniteScroll)(({ theme }) => ({
        minWidth: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "1% 0px",
        backgroundColor: theme.palette.text.light,
        gap: "10px",
        overflowY: "auto",
        alignItems: "flex-start",
    }))

    return (
        <Stack sx={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
            <Stack sx={{ maxWidth: "65%", minWidth: "65%",alignItems:"flex-start" }}>
                <ReactPlayer url={`https://www.youtube.com/watch?v=${playListVideos[videoIndex]?.snippet?.resourceId?.videoId}`} playing={autoPlay} controls width={"100%"} height={"520px"} onEnded={() => { onVideoEnd() }} />
                <Typography variant='h2' sx={{ fontSize: "18px", padding: "10px 2%" }}>{playListVideos[videoIndex]?.snippet?.title}</Typography>
                <Stack sx={{ flexDirection: "row", padding: "0px 2%",justifyContent:"flex-start",cursor:"pointer" }} onClick={() => {
                    Navigate(`/channel/${playListVideos[videoIndex]?.snippet?.channelId}`);
                }}>
                    <Avatar src={channelData[0].snippet?.thumbnails?.default?.url} />
                    <Typography variant='h2' sx={{ fontSize: "15px" }}>{playListVideos[videoIndex]?.snippet?.channelTitle} <br /> <Typography variant='h3' sx={{ fontSize: "14px", color: "text.main" }}>
                        {NumberConverter(channelData[0].statistics?.subscriberCount)} Subscriber </Typography></Typography>
                </Stack>
            </Stack>
            <PlayListScroll className='playlist-scroll' height={"89vh"} dataLength={playListVideos?.length} next={fetchMorePlayListVideo} hasMore={playListVideos.length < listMaxLength}
                loader={<Stack sx={{ flexDirection: "column", width: "100%", gap: "10px" }}>
                    <div className='video-loader image-loader playlist-video'></div>
                </Stack>}
                refreshFunction={fetchMorePlayListVideo}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
            >
                <Typography variant='h3' sx={{ fontSize: "18px", margin: "0px 2%" }}>Videos</Typography>
                {
                    playListVideos.map((curr, indx) => (
                        <Stack sx={{
                            backgroundColor: `${videoIndex === indx ? "white" : "transparent"}`,
                            flexDirection: "row", gap: "10px", padding: "5px 2%", cursor: "pointer", ":hover": {
                                backgroundColor: "white"
                            }
                        }} key={indx} onClick={() => { setVideoIndex(indx) }}>
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
    )
}
