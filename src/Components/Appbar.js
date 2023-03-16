import React, { useState } from 'react';
import '../index.css';
import { Avatar, Stack } from '@mui/material';
import Youtube_Logo from '../assets/image/YouTube-Logo.svg';
import { UilVideo } from '@iconscout/react-unicons';
import { UilSearch } from '@iconscout/react-unicons'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useNavigate } from 'react-router-dom';


export default function Appbar() {

    const [open, setOpen] = useState(false);
    const [type, setType] = useState("");
    const Navigate = useNavigate();


    const onSearchChange = (text) => {
        setType(text);
    }

    return (
        <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "8px 3%", position: "sticky", top: "0px", backgroundColor: "white", zIndex: 4 }}>
            <img src={Youtube_Logo} style={{ width: "130px", height: "50px", objectFit: "cover", cursor: "pointer" }} onClick={() => {
                Navigate("/")
            }} />
            <Stack sx={{ flexDirection: "row", width: "50%" }}>
                <input placeholder='Search' onClick={() => { setOpen(!open) }} onChange={(e) => {
                    onSearchChange(e.target.value)
                }} />
                <Stack sx={{ padding: "0px 3%", alignItems: 'center', justifyContent: "center", borderTopRightRadius: "21px", borderBottomRightRadius: "21px", backgroundColor: "text.light", border: "1px solid rgb(204, 204, 204)" }} onClick={() => {  Navigate(`search/${type}`) }}>
                    <UilSearch size="20px" />
                </Stack>
            </Stack>
            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "20px" }}>
                <UilVideo size="27px" />
                <NotificationsOutlinedIcon sx={{ fontSize: "27px" }} />
                <Avatar src={"https://yt3.ggpht.com/G8cVyLO3GFSi-3tUJavkZ8shb5qLtUG25rhhW5DwxqMZ18VGX9bHakaVOr2xWrUFfNaBf7Jauw=s88-c-k-c0x00ffffff-no-rj-mo"}
                    sx={{ width: "35px", height: "35px" }} />

            </Stack>
        </Stack>
    )
}
