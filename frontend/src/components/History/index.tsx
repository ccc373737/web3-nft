import {
    Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Typography
} from '@mui/material';
import React from "react";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const History = ({ tokenId }: { tokenId: string }) => {
    const rows = [
        {
            auction: "Dutch Auction", status: "Success", bider: "789728937183718923ab1", price: "1 ETH", date: "2022.07.31 17:23:33",
            detail: [{
                address: "789728937183718923ab1",
                price: "1 ETH",
                date: "2022.07.31 17:23:33"
            }, {
                address: "1239897898ad8",
                price: "0.63 ETH",
                date: "2022.07.01 17:23:33"
            }
            ]
        },
        { auction: "English Auction", status: "Success", bider: "1239897898ad8", price: "1.34 ETH" },
        { auction: "Exchange Auction", status: "Success", bider: "829317837", price: "2.56 ETH" },
        { auction: "Dutch Auction", status: "Success", bider: "78923781378198278919", price: "18.83 ETH" }
    ];

    const Row = (prop: any) => {
        const [open, setOpen] = React.useState(false);
        let data = prop.data;

        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {data.auction}
                    </TableCell>
                    <TableCell align="left">{data.status}</TableCell>
                    <TableCell align="left">{data.bider}</TableCell>
                    <TableCell align="left">{data.price}</TableCell>
                    <TableCell align="left">{data.date}</TableCell>
                </TableRow>

                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Detail
                                </Typography>
                                <Table size="small" aria-label="purchases">

                                    <TableBody>
                                        {data.detail && data.detail.map((item: any) => (
                                            <TableRow key={item.date}>
                                                <TableCell align="left">{item.address}</TableCell>
                                                <TableCell>{item.price}</TableCell>
                                                <TableCell component="th" scope="row">
                                                    {item.date}
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Auction</TableCell>
                        <TableCell align="left">Status</TableCell>
                        <TableCell align="left">Bider</TableCell>
                        <TableCell align="left">Price</TableCell>
                        <TableCell align="left">Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (                
                        <Row data={row}/>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default History;