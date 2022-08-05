import store from '../../state';
import React, { useState, useEffect } from "react";

//import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { getProvider, getAccount, TokenContract, MarketContract } from "../../utils/Web3Util";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import {
    Box, Container, Grid, Typography, FormControl, FormLabel,
    Radio, RadioGroup, FormControlLabel, CardContent,
    Card, Chip, Divider, Stack, List, ListItem, ListItemText,
    Dialog, DialogContent, DialogContentText, TableContainer, TableCell,
    TableRow, TableBody, Table, Paper, MenuItem, Select, InputLabel
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
import { TokenStatus } from '../../pages/Item';
import CountdownTimer from '../CountTimer';
import NoiseAwareSharpIcon from '@mui/icons-material/NoiseAwareSharp';
import { blue } from '@mui/material/colors';
import { TOKEN_ADDRESS, MARKET_ADDRESS } from "../../constants/addressed";
import { ethers } from "ethers";
import Token from "../../../contract/artifacts/contracts/Token.sol/Token.json";
import Market from "../../../contract/artifacts/contracts/Market.sol/Market.json";

const AuctionDetail = (
    { tokenId, status, logIn }: 
    { tokenId: string, status: TokenStatus, logIn:() => void}) => {

    let currentAccount = getAccount();

    let isLogin = currentAccount != null;
    let isOwner = false;

    if (isLogin) {
        isOwner = true;
    }

    let endTime = 111111;

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const sellAllClick = () => {
        setOpen(true);
    }

    const [formData, setFormData] = useState({
        fixedPrice: "",
        endTime: "",
    });

    const [Detail, setDetail] = useState({
        isLoad: false,
        isOwner: false,
        fixedPrice: '',
        fixedEndTime: 0
    });

    useEffect(() => {
        const init = async () => {
            let result = await MarketContract().getFixed(TOKEN_ADDRESS, tokenId);
            console.log(result)
            if (status == TokenStatus.FIXED_PRICE) {
                setDetail({
                    isLoad: true,
                    isOwner: (await getAccount()) == result[0],
                    fixedPrice: ethers.utils.formatEther(result[1]),
                    fixedEndTime: result[2].toNumber()
                })
            }
        }
        init();
    }, [status]);

    const fixedCancel = async () => {
        if (await getAccount() == null) {
            logIn();
        }
    }

    const fixedBuy = () => {

    }

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

    const rows = [
        {
            tokenId: '112',
            tokenIdLink: <Link target="_blank" to={`/nft/${112}`} style={{ textDecoration: 'none', color: '#2081E2' }}><span>112</span></Link>,
            image: <img style={{ width: '20%' }} src={"https://ccc-f7-token.oss-cn-hangzhou.aliyuncs.com/tfk1/f2.jpeg"} />,
            action: <Button variant="contained" type="submit" color="error" sx={{ borderRadius: 2, width: 40 }}>
                <span style={{ fontSize: '0.6rem' }}>Withdraw</span>
            </Button>
        },

        { tokenIdLink: '113', tokenId: '113', image: "sdsad", action: "" },
        { tokenIdLink: '114', tokenId: '114', image: "sdsad", action: "" },
        { tokenIdLink: '115', tokenId: '115', image: "sdsad", action: "" },
        { tokenIdLink: '116', tokenId: '116', image: "sdsad", action: "" }
    ];


    const Mode = () => {
        if (status == TokenStatus.FIXED_PRICE) {
            console.log("mode111")
            return (
                <React.Fragment>
                    <Grid item lg={5} md={6} sx={{ alignItems: 'flex-start', display: 'flex' }}>
                        <Stack>
                            <Typography variant="subtitle1" noWrap>
                                CURRENT PRICE
                            </Typography>
                            <Typography variant="h4" noWrap>
                                <SvgIcon
                                    component={EthereumLogo}
                                    viewBox="0 0 400 426.6"
                                    titleAccess="ETH"
                                /><span>{Detail.fixedPrice}</span>
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <Stack alignItems="flex-start">
                            <Typography variant="subtitle1" noWrap>
                                AUCTION ENDS IN
                            </Typography>
                            <Typography variant="h4" color="secondary" noWrap>
                                <CountdownTimer targetDate={Detail.fixedEndTime} />
                            </Typography>
                        </Stack>
                    </Grid>

                    {
                        Detail.isLoad ?
                            (Detail.isOwner ?
                                (<Grid item lg={4} md={4}>
                                    <Button variant="contained" type="submit" color="primary" onClick={fixedCancel}
                                        startIcon={<SellIcon />} style={{ width: 180, height: 53 }} sx={{ borderRadius: 2 }}>
                                        Cancel
                                    </Button>
                                </Grid>) : 
                                (<Grid item lg={4} md={4}>
                                    <Button variant="contained" type="submit" color="primary" onClick={fixedBuy}
                                        startIcon={<SellIcon />} style={{ width: 180, height: 53 }} sx={{ borderRadius: 2 }}>
                                        Buy
                                    </Button>
                                </Grid>)) : <></>
                    }


                </React.Fragment>
            )
        } else if (status == TokenStatus.DUCTCH_AUCTION) {
            return (
                <React.Fragment>
                    <Grid item lg={5} md={6} sx={{ alignItems: 'flex-start', display: 'flex' }}>
                        <Stack>
                            <Typography variant="subtitle1" noWrap>
                                CURRENT PRICE
                            </Typography>
                            <Typography variant="h4" noWrap>
                                <SvgIcon
                                    component={EthereumLogo}
                                    viewBox="0 0 400 426.6"
                                    titleAccess="ETH"
                                /><span>12.45</span>
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center', display: 'flex' }}>
                        <Stack alignItems="flex-start">
                            <Typography variant="subtitle1" noWrap>
                                AUCTION ENDS IN
                            </Typography>
                            <Typography variant="h4" color="secondary" noWrap>
                                75%
                            </Typography>
                        </Stack>
                    </Grid>

                </React.Fragment>

            )
        } else if (status == TokenStatus.ENGLISH_AUCTION) {
            return (
                <React.Fragment>
                    <Grid item lg={5} md={6} sx={{ alignItems: 'flex-start' }}>
                        <Stack>
                            <Typography variant="subtitle1" noWrap>
                                CURRENT PRICE
                            </Typography>
                            <Typography variant="h4" noWrap>
                                <SvgIcon
                                    component={EthereumLogo}
                                    viewBox="0 0 400 426.6"
                                    titleAccess="ETH"
                                /><span>12.45</span>
                            </Typography>
                            <Typography variant="caption" noWrap>
                                Minimum bid: 12.55
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item lg={5} md={6} sx={{ alignItems: 'center' }}>
                        <Stack alignItems="flex-start">
                            <Typography variant="subtitle1" >
                                AUCTION ENDS IN
                            </Typography>
                            <Typography variant="h4" sx={{ mb: '20px' }}>
                                <CountdownTimer targetDate={endTime} />
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item lg={12} md={12} sx={{ alignItems: 'center', display: 'flex' }}>
                        <Typography variant="body2" sx={{ display: 'inline' }}>
                            LAST BID BY HGEj...mAhU on 2022.07.31 15:30:21
                        </Typography>

                        <Typography variant="body2" onClick={sellAllClick} color="blue" sx={{ ml: '5%' }}>
                            See more
                        </Typography>
                    </Grid>

                    <Dialog open={open} onClose={handleClose} maxWidth='lg'>
                        <DialogContent>
                            <List >
                                <ListItemText primary="0xc20e802d86e4bb52C0Ed6b665288D1778100ac18 bid for 100.00 ETH on 2022.07.31 15:30:21" />
                                <ListItemText primary="0xc20e802d86e4bb52C0Ed6b665288D1778100ac18 bid for 100.00 ETH on 2022.07.31 15:30:21" />
                                <ListItemText primary="0xc20e802d86e4bb52C0Ed6b665288D1778100ac18 bid for 100.00 ETH on 2022.07.31 15:30:21" />
                                <ListItemText primary="0xc20e802d86e4bb52C0Ed6b665288D1778100ac18 bid for 100.00 ETH on 2022.07.31 15:30:21" />
                                <ListItemText primary="0xc20e802d86e4bb52C0Ed6b665288D1778100ac18 bid for 100.00 ETH on 2022.07.31 15:30:21" />
                                <ListItemText primary="0xc20e802d86e4bb52C0Ed6b665288D1778100ac18 bid for 100.00 ETH on 2022.07.31 15:30:21" />
                            </List>
                        </DialogContent>
                    </Dialog>

                    <Grid item lg={4} md={4} >
                        <TextField
                            required
                            label="Price"
                            name="price"
                            type="number"
                            defaultValue={12.55}
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

                    <Grid item lg={4} md={4}>
                        <Button variant="contained" type="submit" color="primary"
                            startIcon={<SellIcon />} style={{ width: 180, height: 53 }} sx={{ borderRadius: 2 }}>
                            Place a bid
                        </Button>
                    </Grid>

                    <Grid item lg={3} md={3}>
                        <Stack>
                            <Typography variant="subtitle2" fontSize={12}>
                                Your Last Bid: 10.4560 ETH
                            </Typography>

                            <Button variant="contained" type="submit" color="error"
                                startIcon={<NoiseAwareSharpIcon />} style={{ width: 150, height: 32 }} sx={{ borderRadius: 2 }}>
                                Withdraw
                            </Button>

                        </Stack>
                    </Grid>
                </React.Fragment>)
        } else if (status == TokenStatus.EXCHANGE_AUCTION) {
            return (<React.Fragment>
                <Grid item lg={6} md={6} sx={{ alignItems: 'flex-start' }}>
                    <Stack>
                        <Typography variant="subtitle1" noWrap>
                            EXCHANGE LIST
                        </Typography>

                        <TableContainer component={Paper} sx={{ maxHeight: 120 }}>
                            <Table>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.tokenId}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">{row.tokenIdLink}</TableCell>
                                            <TableCell align="center" size="small">{row.image}</TableCell>
                                            <TableCell align="left">{row.action}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Grid>

                <Grid item lg={3} md={3} sx={{ alignItems: 'center' }}>
                    <Stack alignItems="flex-start">
                        <Typography variant="subtitle1" >
                            AUCTION ENDS IN
                        </Typography>
                        <Typography variant="h4" sx={{ mb: '20px' }}>
                            <CountdownTimer targetDate={endTime} />
                        </Typography>
                    </Stack>
                </Grid>

                <Grid item lg={6} md={6}>
                    <FormControl sx={{ width: '80%' }}>
                        <InputLabel id="demo-simple-select-autowidth-label">TokenId</InputLabel>
                        <Select label="TokenId" labelId="demo-simple-select-autowidth-label" >
                            <MenuItem value={114}>114</MenuItem>
                            <MenuItem value={2169}>2169</MenuItem>
                            <MenuItem value={8129}>8129</MenuItem>
                        </Select>
                    </FormControl>

                    <Link target="_blank" to={`/nft/${112}`}>
                        <img style={{ width: '17%', marginLeft: '2%' }} src={"https://ccc-f7-token.oss-cn-hangzhou.aliyuncs.com/tfk1/f2.jpeg"} />
                    </Link>

                </Grid>

                <Grid item lg={2} md={2}>
                    <Button variant="contained" type="submit" color="primary"
                        style={{ width: 120, height: 53 }} sx={{ borderRadius: 2 }}>
                        APPROVE
                    </Button>
                </Grid>

                <Grid item lg={2} md={2}>
                    <Button variant="contained" type="submit" color="primary"
                        style={{ width: 120, height: 53 }} sx={{ borderRadius: 2, ml: '25%' }}>
                        EXCHANGE
                    </Button>
                </Grid>

            </React.Fragment>)
        }

        return (<React.Fragment></React.Fragment>)
    }

    return (
        <React.Fragment>
            {(
                <React.Fragment>

                    <form onSubmit={sellClick}>

                        <Grid container spacing={2} sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}>
                            <Mode />

                            {/* <Grid item lg={12} md={12} >
                                <Button variant="contained" type="submit" color="primary"
                                    startIcon={<SellIcon />} size="large" sx={{ borderRadius: 2 }}>
                                    Sell now
                                </Button>
                            </Grid> */}
                        </Grid>
                    </form>

                </React.Fragment>)}

        </React.Fragment>

    );
};

export default AuctionDetail;