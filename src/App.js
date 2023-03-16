import Appbar from './Components/Appbar';
import HomePage from './Pages/HomePage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHomeVideo } from './State Management/HomeVideoSlice';
import { Routes, Route,useLocation } from 'react-router-dom';
import SingleVideoPage from './Pages/SingleVideoPage';
import ChannelPage from './Pages/ChannelPage';
import PlayListPage from './Pages/PlayListPage';
import './index.css';
import SearchPage from './Pages/SearchPage';

function App() {

  const dispatch = useDispatch();
  const {pathname} = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])


  useEffect(() => {
    const getVideoList = async () => {
      dispatch(setHomeVideo(JSON.parse(localStorage.getItem("home_video"))));
      // try {
      //   const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&key=${process.env.REACT_APP_GAME_KEY}`);
      //   localStorage.setItem("home_video", JSON.stringify(res.data?.items));
      //   dispatch(setHomeVideo(JSON.parse(localStorage.getItem("home_video"))));
      // } catch (e) {
      //   dispatch(setHomeVideo(JSON.parse(localStorage.getItem("home_video"))));
      // }
    }

    getVideoList();
  }, []);

  return (
    <>
      <Appbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/search/:title' element={<SearchPage />} />
        <Route path='/video/:id' element={<SingleVideoPage />} />
        <Route path='/playlist/:list_id' element={< PlayListPage />} />
        <Route path='channel/:channelID' element={<ChannelPage />} />
      </Routes>
    </>
  );
}

export default App;
