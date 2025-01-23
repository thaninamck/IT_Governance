import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton, Select, MenuItem as MuiMenuItem, FormControl, InputLabel } from '@mui/material';
import "./componentStyle.css";

function Table({ columnsConfig, rowsData, checkboxSelection = false }) {
    // Dynamically configure the columns based on the passed columnsConfig
    const columns = [
        ...(checkboxSelection
            ? [{
                field: 'checkbox', // Colonne pour la sélection de la case à cocher
                headerName: '',
                width: 60,
                // renderCell: (params) => (
                //     <input
                //         type="checkbox"
                //         checked={params.row.selected || false}
                //         onChange={() => {}}
                //     />
                // ),
            }]
            : []),
        ...columnsConfig.map((colConfig) => ({
            field: colConfig.field,
            headerName: colConfig.headerName,
            width: colConfig.width || 180, // default width if not provided
            renderCell: (params) => {
                if (colConfig.field === 'status') {
                    return (
                        <FormControl sx={{ width: "80%" }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={params.row.status}
                                onChange={(e) => handleStatusChange(e, params.row.id)}
                                label="Status"
                                sx={{
                                    fontSize: "14px", marginTop: "5px", padding: "0px", height: "40px"
                                }}
                            >
                                <MuiMenuItem value="Active">Active</MuiMenuItem>
                                <MuiMenuItem value="Inactive">Inactive</MuiMenuItem>
                                <MuiMenuItem value="Pending">Pending</MuiMenuItem>
                            </Select>
                        </FormControl>
                    );
                }
                if (colConfig.field === 'rapport') {
                    return (
                        <IconButton
                            aria-label="more"
                            onClick={(event) => handleClick(event, params.row.id)}
                            sx={{ fontSize: "14px", border: "1px solid #ddd", borderRadius: "3px", height: "40px", padding: "15px" }}
                        >
                            <span>view report</span>
                        </IconButton>
                    );
                }
                if (colConfig.field === 'actions') {
                    return (
                        <IconButton
                            aria-label="more"
                            onClick={(event) => handleClick(event, params.row.id)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    );
                }
                return params.value;
            }
        }))
    ];

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedRowId, setSelectedRowId] = React.useState(null);

    const handleClick = (event, rowId) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedRowId(rowId);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteRow = () => {
        // Logic for deleting the row
        setRows(rowsData.filter((row) => row.id !== selectedRowId));
        handleClose();
    };

    const handleHideRow = () => {
        // Logic for hiding row (could toggle visibility state)
        handleClose();
    };

    const handleEditRow = () => {
        // Logic for editing row
        handleClose();
    };

    const handleStatusChange = (event, rowId) => {
        const updatedRows = rowsData.map((row) =>
            row.id === rowId ? { ...row, status: event.target.value } : row
        );
        setRows(updatedRows);
    };

    return (
        <Paper sx={{ margin: "3%" }}>
            <DataGrid
                rows={rowsData}
                columns={columns}
                checkboxSelection={checkboxSelection}  // active/désactive les cases à cocher
                stickyHeader
                aria-label="sticky table"
                sx={{ border: 0 }}
            />
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleEditRow}>Edit Row</MenuItem>
                <MenuItem onClick={handleDeleteRow}>Delete Row</MenuItem>
                <MenuItem onClick={handleHideRow}>Hide Row</MenuItem>
            </Menu>
        </Paper>
    );
}

export default Table;
