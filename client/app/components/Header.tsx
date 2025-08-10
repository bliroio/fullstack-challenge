import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Logo from "@/public/bliro logo.png"

interface HeaderProps {
    onSearch: (value: string) => void;
}

export default function Header({onSearch}: HeaderProps) {    
    

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="transparent" >
            <Toolbar sx={{justifyContent: "space-between"}}>
                {/* Left: Logo */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img src={Logo.src} alt="Bliro Logo"  />
                </Box>
                <Box sx={{ flex: 1, display: "flex", justifyContent: "center", mx: 15 }}>
                    {/* <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} /> */}
                    <TextField
                        id="outlined-basic"
                        // label="Search.."
                        placeholder='Search..'
                        variant="outlined"
                        size="small"
                        fullWidth={true}
                        onChange={e => onSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                {/* Right: Search and Button */}
                <Box sx={{ display: "flex", alignItems: "center"}}>
                    <Button variant="contained">Create Meeting</Button>
                </Box>
                
            </Toolbar>
        </AppBar>
        </Box>
    );
}