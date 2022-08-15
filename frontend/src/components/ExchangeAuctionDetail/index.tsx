import SellIcon from '@mui/icons-material/Sell';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import LoadingButton from "@mui/lab/LoadingButton";
import {
    FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography
} from '@mui/material';
import Button from "@mui/material/Button";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { change, getMylist } from '../../api/tokenApi';
import { MARKET_ADDRESS, TOKEN_ADDRESS } from "../../constants/addressed";
import Market from "../../contracts/Market.sol/Market.json";
import Token from "../../contracts/Token.sol/Token.json";
import { ExDetailData, TokenStatus } from "../../pages/Item";
import { getAccount, getProvider, TokenContract, ZERO_ADDRESS } from "../../utils/Web3Util";
import CountdownTimer from '../CountTimer';

interface BidToken {
    tokenId: string,
    tokenIdLink?: string,
    image: string,
    action?: string
}

const ExchangeAuctionDetail = (
    { tokenId, detail, isOwner, setLogin, changeStatus }:
        { tokenId: string, detail: ExDetailData, isOwner: boolean, setLogin: () => void, changeStatus: (status: TokenStatus) => void }) => {

    const [approveLoading, setApproveLoading] = useState(false);
    const [exchangeLoading, setExchangeLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [chooseLoading, setChooseLoading] = useState(false);
    const [bidTokenList, setBidTokenList] = useState<BidToken[]>([]);
    const [myTokenList, setMyTokenList] = useState<BidToken[]>([]);

    const [myTokenApproved, setMyTokenApproved] = useState(false);
    const [myTokenChoose, setMyTokenChoose] = useState(undefined);
    const [myTokenChooseImg, setMyTokenChooseImg] = useState('');

    useEffect(() => {
        const init = async () => {
            let set = new Set();
            let list: any[] = [];
            let acc = await getAccount();

            for (let i = 0; i < detail.bidTokenList.length; i++) {
                let id = detail.bidTokenList[i].toString();
                if (set.has(id)) {
                    continue;
                }

                if (detail.bidList[i] == ZERO_ADDRESS) {
                    continue;
                }

                set.add(id);
                list.push({
                    tokenId: id,
                    tokenIdLink: <Link target="_blank" to={`/nft/${id}`} style={{ textDecoration: 'none', color: '#2081E2' }}><span>{id}</span></Link>,
                    image: <img style={{ width: '20%' }} src={"https://ccc-f7-token.oss-cn-hangzhou.aliyuncs.com/tfk1/f2.jpeg"} />,
                    action:
                        (() => {
                            if (isOwner) {
                                return (<LoadingButton variant="contained" color="error" sx={{ borderRadius: 2, width: 40 }} loading={chooseLoading} onClick={() => choose(id)}>
                                    <span style={{ fontSize: '0.6rem' }}>Choose</span>
                                </LoadingButton>)
                            } else if (detail.bidList[i] == acc) {
                                return <Button variant="contained" color="error" sx={{ borderRadius: 2, width: 40 }} onClick={() => withdraw(id)}>
                                    <span style={{ fontSize: '0.6rem' }}>Withdraw</span>
                                </Button>
                            } else {
                                return <></>
                            }
                        })()
                })
            }

            setBidTokenList(list);
        }

        init();
    }, []);

    const auctionCancel = async () => {
        const provider = await getProvider();
        await setLogin();

        const signer = provider.getSigner();
        const contract = new ethers.Contract(MARKET_ADDRESS, Market.abi, signer);

        contract.exchangeRevoke(TOKEN_ADDRESS, tokenId).then((resolve: any) => {
            setCancelLoading(true)
        }).catch((err: any) => {
            alert(err.reason.split(":")[1])
        })

        contract.on("ExchangeAuctionRevoke", (nftAddr, seller, tokenId, event) => {
            console.log(event);
            change(tokenId.toNumber());
            for (let temp of bidTokenList) {
                change(temp.tokenId);
            }
            changeStatus(TokenStatus.NORMAL);
        });
    }

    const choose = async (exchangeId: string) => {
        const provider = await getProvider();
        await setLogin();

        const signer = provider.getSigner();
        const contract = new ethers.Contract(MARKET_ADDRESS, Market.abi, signer);

        contract.exchangeEnd(TOKEN_ADDRESS, tokenId, exchangeId).then((resolve: any) => {
            setChooseLoading(true)
        }).catch((err: any) => {
            console.log(err)
            alert(err.reason.split(":")[1])
        })

        contract.on("ExchangeAuctionEnd", (nftAddr, tokenId, exchangeTokenId, event) => {
            console.log(event);
            change(tokenId.toNumber());
            for (let temp of bidTokenList) {
                change(temp.tokenId);
            }
            changeStatus(TokenStatus.NORMAL);
        });
    }

    const withdraw = async (exchangeId: string) => {
        const provider = await getProvider();
        await setLogin();

        const signer = provider.getSigner();
        const contract = new ethers.Contract(MARKET_ADDRESS, Market.abi, signer);

        contract.exchangeWithdraw(TOKEN_ADDRESS, tokenId, exchangeId).then((resolve: any) => {
            //setLoad(true)
        }).catch((err: any) => {
            console.log(err)
            alert(err.reason.split(":")[1])
        })

        contract.on("ExchangeAuctionWithdraw", (nftAddr, buyer, tokenId, exchangeTokenId, event) => {
            console.log(event);
            change(exchangeTokenId.toNumber());
            changeStatus(TokenStatus.TRANSITION);
        });
    }

    const exchangeClick = async () => {
        const provider = await getProvider();
        await setLogin();

        const signer = provider.getSigner();
        const contract = new ethers.Contract(MARKET_ADDRESS, Market.abi, signer);

        contract.exchangeBid(TOKEN_ADDRESS, tokenId, myTokenChoose).then((resolve: any) => {
            setExchangeLoading(true)
        }).catch((err: any) => {
            alert(err.reason.split(":")[1])
        })

        contract.on("ExchangeAuctionBid", (nftAddr, bider, tokenId, exchangeTokenId, event) => {
            console.log(event);
            change(exchangeTokenId.toNumber());
            changeStatus(TokenStatus.TRANSITION);
        });
    }

    const myListOpen = async () => {
        const provider = await getProvider();
        await setLogin();
        let acc = await getAccount()

        if (myTokenList.length == 0) {
            getMylist({ owner: acc, status: TokenStatus.NORMAL }).then((result: any) => {
                let list = [];
                for (let token of result) {
                    list.push({
                        tokenId: token.tokenId,
                        image: token.url,
                    })
                }

                setMyTokenList(list)
            });
        }
    }

    const myListChange = async (event: any) => {
        const provider = await getProvider();
        await setLogin();

        let token = event.target.value;
        for (let temp of myTokenList) {
            if (temp.tokenId == token) {
                setMyTokenChooseImg(temp.image);
                break
            }
        }

        let app = await TokenContract().getApproved(token) == MARKET_ADDRESS;

        setMyTokenChoose(token);
        setMyTokenApproved(app);
    }

    const approveClick = async () => {
        const provider = await getProvider();
        await setLogin();

        let token = myTokenChoose;

        if (token == null) {
            return;
        }

        let app = await TokenContract().getApproved(token) == MARKET_ADDRESS;
        if (app) {
            return;
        }

        const signer = provider.getSigner();
        const contract = new ethers.Contract(TOKEN_ADDRESS, Token.abi, signer);

        contract.approve(MARKET_ADDRESS, token).then((resolve: any) => {
            setApproveLoading(true);
        }).catch((err: any) => {
            alert(err.reason.split(":")[1])
        })

        contract.on("Approval", (owner, approved, tokenId, event) => {
            console.log(event);
            setApproveLoading(false);
            setMyTokenApproved(true);
        });
    }

    return (
        <React.Fragment>
            <Grid container spacing={2} sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}>
                <Grid item lg={6} md={6} sx={{ alignItems: 'flex-start' }}>
                    <Stack>
                        <Typography variant="subtitle1" noWrap>
                            EXCHANGE LIST
                        </Typography>

                        <TableContainer component={Paper} sx={{ maxHeight: 120 }}>
                            <Table>
                                <TableBody>
                                    {bidTokenList.map((row) => (
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
                            <CountdownTimer targetDate={detail.endTime} />
                        </Typography>
                    </Stack>
                </Grid>

                {isOwner ?
                    (<React.Fragment>
                        <Grid item lg={4} md={4}>
                            <LoadingButton variant="contained" color="primary" onClick={auctionCancel}
                                startIcon={<SellIcon />} style={{ width: 180, height: 53 }} sx={{ borderRadius: 2 }}
                                loading={cancelLoading}
                                loadingPosition="start">
                                Cancel
                            </LoadingButton>
                        </Grid>
                    </React.Fragment>) :

                    (<React.Fragment>
                        <Grid item lg={6} md={6}>
                            <FormControl sx={{ width: '80%' }}>
                                <InputLabel id="demo-simple-select-autowidth-label">TokenId</InputLabel>
                                <Select label="TokenId" id="demo-customized-select" labelId="demo-simple-select-autowidth-label" onOpen={myListOpen} onChange={myListChange}>
                                    {myTokenList.map((row) => (
                                        <MenuItem value={row.tokenId}>{row.tokenId}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Link target="_blank" to={`/nft/${112}`}>
                                <img style={{ width: '17%', marginLeft: '2%' }} src={myTokenChooseImg} />
                            </Link>
                        </Grid>

                        <Grid item lg={2} md={2}>
                            <LoadingButton variant="contained" type="submit" color="primary"
                                style={{ width: 120, height: 53 }} sx={{ borderRadius: 2 }}
                                startIcon={<SwapHorizontalCircleIcon />}
                                loading={approveLoading}
                                loadingPosition="start"
                                disabled={myTokenApproved}
                                onClick={approveClick}>
                                APPROVE
                            </LoadingButton>
                        </Grid>

                        <Grid item lg={2} md={2}>
                            <LoadingButton variant="contained" type="submit" color="primary"
                                style={{ width: 125, height: 53 }} sx={{ borderRadius: 2, ml: '25%' }}
                                startIcon={<SellIcon />}
                                loading={exchangeLoading}
                                loadingPosition="start"
                                disabled={!myTokenApproved}
                                onClick={exchangeClick}>
                                EXCHANGE
                            </LoadingButton>
                        </Grid>
                    </React.Fragment>)
                }
            </Grid>
        </React.Fragment>
    );
};

export default ExchangeAuctionDetail;