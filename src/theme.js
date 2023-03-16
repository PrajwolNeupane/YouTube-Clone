import { createTheme } from "@mui/material";

const font = "'Noto Sans', sans-serif";
const theme = createTheme({
    palette:{
        primary:{
        main: "#232323",
        light: "#252626"
        },
        secondary:{
        main:"#e1684d",
        light:"#eaeded",
        },
        text:{
          main:"#808080",
          light:"#F2F2F2",
        },
        otherColor:{
        main:"#999"
        }
    },
    overrides: {
        MuiAppBar: {
          colorPrimary: {
            backgroundColor: "#232323",
          },
        },
      },
      typography:{
        fontFamily:font,
        h1:{fontWeight:700},
        h2:{fontWeight:600},
        h3:{fontWeight:500},
        h4:{fontWeight:400},
        h5:{fontWeight:300},
        h6:{fontWeight:200},
        p:{fontWeight:100}
      },
      components:{
        MuiAvatar:{
          defaultProps:{
            zIndex:2
          }
        }
      }
        
});
export default theme;