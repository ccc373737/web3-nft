import store from '../../state';
import React, { useState, useEffect } from "react";

//import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { getProvider, getAccount } from "../../utils/Web3Util";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import {
    Box, Container, Grid, Typography, FormControl, FormLabel,
    Radio, RadioGroup, FormControlLabel, CardContent,
    Card, Chip, Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Badge, { BadgeProps } from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as EthereumLogo } from "../../assets/ethereum_logo.svg";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import SellIcon from '@mui/icons-material/Sell';


const Auction = ({ tokenId }: { tokenId: string }) => {
    let currentAccount = getAccount();

    let isLogin = currentAccount != null;
    let isOwner = false;
    let isApprove = false;

    if (isLogin) {
        isOwner = true;
        isApprove = true;
    }


    const [formData, setFormData] = useState({
        sellMode: "",
        description: "",
        endTime: null
    });

    function handleModeChange(event: any) {
        let { name, value } = event.target;

        
        // if(name === 'image'){
        //   value = event.target.files[0];
        // }
        setFormData({ ...formData, [name]: value });
    }

    const sellClick = (event: any) => {
        event.preventDefault();
        console.log(event.target.price.value);
        console.log(event.target.endTime.value);
    }

    const Mode = () => {
        if (formData.sellMode == "fixed") {
            return (
                <React.Fragment>
                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="Price"
                            name="price"
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            component={EthereumLogo}
                                            viewBox="0 0 400 426.6"
                                            titleAccess="ETH"
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="End Time"
                            name="endTime"
                            type="datetime-local"
                            sx={{ width: 250 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </React.Fragment>
            )
        } else if (formData.sellMode == "dutch") {
            return (
                <React.Fragment>
                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="StartPrice"
                            name="startPrice"
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            component={EthereumLogo}
                                            viewBox="0 0 400 426.6"
                                            titleAccess="ETH"
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="FloorPrice"
                            name="floorPrice"
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            component={EthereumLogo}
                                            viewBox="0 0 400 426.6"
                                            titleAccess="ETH"
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="End Time"
                            name="endTime"
                            type="datetime-local"
                            sx={{ width: 250 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </React.Fragment>

            )
        } else if (formData.sellMode == "english") {
            return (
                <React.Fragment>
                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="ReservePrice"
                            name="reservePrice"
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            component={EthereumLogo}
                                            viewBox="0 0 400 426.6"
                                            titleAccess="ETH"
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="MinimumAddPrice"
                            name="minimumAddPrice"
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            component={EthereumLogo}
                                            viewBox="0 0 400 426.6"
                                            titleAccess="ETH"
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="End Time"
                            name="endTime"
                            type="datetime-local"
                            sx={{ width: 250 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </React.Fragment>)
        } else if (formData.sellMode == "exchange") {
            return (<React.Fragment>
                <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <TextField
                            required
                            label="End Time"
                            name="endTime"
                            type="datetime-local"
                            sx={{ width: 250 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
            </React.Fragment>)
        }

        return (<React.Fragment></React.Fragment>)
    }

    return (
        <React.Fragment>
            {isOwner && isLogin && (
                <React.Fragment>
                    <CardContent>
                        <FormControl>
                            <RadioGroup value={formData.sellMode} onChange={handleModeChange} name="sellMode" row >
                                <FormControlLabel value="fixed" disabled={!isApprove} control={<Radio color="primary" />} label="Fixed" />
                                <FormControlLabel value="dutch" disabled={!isApprove} control={<Radio color="secondary" />} label="DutchAuction" />
                                <FormControlLabel value="english" disabled={!isApprove} control={<Radio color="error" />} label="EnglishAuction" />
                                <FormControlLabel value="exchange" disabled={!isApprove} control={<Radio color="warning" />} label="ExchangeAuction" />
                            </RadioGroup>
                        </FormControl>
                    </CardContent>

                    <form onSubmit={sellClick}>

                        <Grid container spacing={2} sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}>
                            <Mode />

                            <Grid item lg={12} md={12} >
                                <Button variant="contained" type="submit" color="primary" disabled={!isApprove}
                                startIcon={<SellIcon />} size="large" sx={{ borderRadius: 2 }}>
                                    Sell now
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                </React.Fragment>)}

        </React.Fragment>

    );
};

export default Auction;