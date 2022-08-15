import LoginIcon from '@mui/icons-material/Login';
import { AppBar, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from '@mui/material/IconButton';
import Toolbar from "@mui/material/Toolbar";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/Logo.svg';
import '../../style/Global.css';
import { getAccount, getProvider } from "../../utils/Web3Util";


const Header = () => {
  const [acc, setAcc] = useState('');

  useEffect(() => {
    const init = async () => {
      let a = await getAccount();

      if (a != null) {
        setAcc(a);
      }
    }

    init();
  }, []);

  const onlog = async () => {
    const provider = await getProvider();

    let a = await getAccount();

    if (a != null) {
      setAcc(a);
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />

      <AppBar className="header" position="relative">
        <Toolbar variant="dense">
          <Link to="/">
            <img src={logo} alt="Galerie" className="logo" />
          </Link>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
            <IconButton onClick={onlog}>
              <LoginIcon></LoginIcon>
            </IconButton>

            <Typography variant="subtitle1">{acc && acc.slice(0,7) + '...' + acc.slice(-4)}</Typography>
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>

  );
};

export default Header;
