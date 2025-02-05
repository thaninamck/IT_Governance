import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton, Select, MenuItem as MuiMenuItem, FormControl } from '@mui/material';
import StatusMission from './StatusMission';
import { useNavigate } from 'react-router-dom';
import { useBreadcrumb } from '../Context/BreadcrumbContext';


function ExpandableCell({ value, maxInitialLength = 50, onExpand }) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const toggleExpand = () => {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        // Notifier le parent pour ajuster la mise en page
        onExpand(newExpandedState);
    };

    // Tronquer le contenu initial
    const displayValue = isExpanded 
        ? value 
        : value.length > maxInitialLength 
            ? value.substring(0, maxInitialLength) + '...' 
            : value;

    return (
        <div
            onClick={toggleExpand}
            style={{
                    width: '100%',
                    wordWrap: "break-word",
                    lineHeight: '1.4',
                    cursor: "pointer",
                   // backgroundColor: isExpanded ? '#f0f0f0' : 'transparent',
                    border: isExpanded ? '1px solid #ddd' : 'none',
                    transition: 'all 0.3s ease',
                    minHeight: isExpanded ? '100px' : 'auto', // Hauteur minimale quand étendu
                    maxHeight: isExpanded ? 'none' : '50px', // Limiter la hauteur initiale
                    overflow: 'visible',
                    paddingTop:'8px'
            }}
            title={!isExpanded ? "Cliquez pour développer" : "Cliquez pour réduire"}
        >
            {displayValue}
            {value.length > maxInitialLength && (
                <span style={{ 
                    color: 'blue', 
                    marginLeft: '2px',
                    fontSize: '0.5em'
                }}>
                    {isExpanded ? 'Réduire' : 'Développer'}
                </span>
            )}
        </div>
    );
}


function Table({ columnsConfig, rowsData, checkboxSelection = false,getRowLink ,headerBackground = "transparent",statusOptions = [], statusColors = { } ,rowActions = []}) {

    const { setBreadcrumbs } = useBreadcrumb();
    const navigate = useNavigate(); // Hook pour la navigation
    const [rows, setRows] = React.useState(rowsData);
    const [expandedCells, setExpandedCells] = React.useState({});
    const [selectionModel, setSelectionModel] = React.useState([]);


    const handleRowClick = (params) => {
        if (getRowLink) {
            const link = getRowLink(params.row); // Générer dynamiquement le lien
            setBreadcrumbs([
                { label: 'Mes Mission', path: '/tablemission' },
                { label: params.row.mission, path: `/tablemission/${params.row.mission}` },
    
            ]);
            navigate(link);
        }
    };

    const handleCellExpand = (rowId, field, isExpanded) => {
        setExpandedCells(prev => ({
            ...prev,
            [`${rowId}-${field}`]: isExpanded
        }));
    };
    const getRowHeight = (params) => {
        // Calculer la hauteur de la ligne en fonction des cellules expansées
        const isAnyCellExpanded = Object.keys(expandedCells).some((key) =>
            key.startsWith(`${params.id}-`) && expandedCells[key]
        );
        return isAnyCellExpanded ? 'auto' : 60; // Par défaut 50px, auto si une cellule est étendue
    };

    const columns = [
        ...(checkboxSelection ? [{
            field: 'checkbox',
            headerName: '',
            width: 60,
        }] : []),
        ...columnsConfig.map((colConfig) => ({
            field: colConfig.field,
            headerName: colConfig.headerName,
            width: colConfig.width || 180,
            flex: colConfig.flex || 0,
            cellClassName: 'dynamic-height-cell',
            editable: colConfig.editable || false,
            renderCell: (params) => {
                if (colConfig.field === 'status') {
                    return (
                        <FormControl sx={{ width: "100%" }}>
                            <Select
                                value={params.row.status}
                                onChange={(e) => handleStatusChange(e, params.row.id)}
                                displayEmpty
                                renderValue={(selected) => {
                                    const color = statusColors[selected] || 'gray'; // Détermine la couleur du statut sélectionné
                                    return (
                                        <span style={{ color: color }}>
                                            {selected || "Choisir un statut"}
                                        </span>
                                    );
                                }}
                                sx={{
                                    fontSize: "14px",
                                    height: "40px",
                                    backgroundColor: "#fff",
                                    borderRadius: "4px",
                                }}
                            >
                                {statusOptions.map((status,color) => (
                                    <MuiMenuItem key={status} value={status}  style={{ color: statusColors[status] || 'gray' }}>
                                        {status}
                                    </MuiMenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    );
                }
                if (colConfig.field === 'dateField') {
                    // Formater la date en "DEC 27, 2024"
                    const date = new Date(params.value);
                    const formattedDate = date.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
    
                    return <span>{formattedDate}</span>;
                }
                if (colConfig.field === 'dateField1') {
                    // Formater la date en "DEC 27, 2024"
                    const date = new Date(params.value);
                    const formattedDate = date.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
    
                    return <span>{formattedDate}</span>;
                }
                if (colConfig.field === 'rapport') {
                    return (
                        <IconButton
                            aria-label="view report"
                            onClick={(event) => handleClick(event, params.row.id)}
                            sx={{
                                fontSize: "14px",
                                border: "1px solid #ddd",
                                borderRadius: "3px",
                                height: "40px",
                                padding: "15px",
                            }}
                        >
                            <span>View Report</span>
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
                if (colConfig.field === 'statusMission') {
                    return (
                       <StatusMission  status={params.value} />
                    );
                }
                // Largeur fixe et hauteur dynamique
                if (colConfig.expandable) {
                    return   <ExpandableCell
                    value={params.value}
                    maxInitialLength={colConfig.maxInitialLength || 50}
                    onExpand={(isExpanded) =>
                        handleCellExpand(params.row.id, colConfig.field, isExpanded)
                    }
                />
                }
                
                // Rendu par défaut
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

    const handleRowAction = (action, rowId) => {
        action.onClick(rowId);  // Appeler la fonction `onClick` de l'action
        handleClose();
    };

    const handleStatusChange = (event, rowId) => {
        const updatedRows = rows.map((row) =>
            row.id === rowId ? { ...row, status: event.target.value } : row
        );
        setRows(updatedRows);
    };

    const handleCellEditCommit = (params) => {
        setRows(rows.map((row) =>
            row.id === params.id ? { ...row, [params.field]: params.value } : row
        ));
    };

    return (
        <Paper sx={{ margin: "0% 3%", width:"max-content" }}>
           <DataGrid
    rows={rows}
    columns={columns}
    checkboxSelection={checkboxSelection}
    disableRowSelectionOnClick // Empêche la sélection en cliquant sur une cellule
    autoHeight
    getRowHeight={getRowHeight}
    selectionModel={selectionModel}
    onSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
    onRowClick={handleRowClick} // Ajout du gestionnaire de clic sur la ligne
    sx={{
        border: "1px solid #ccc",
        
        '& .MuiDataGrid-cell': {
            borderRight: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflow: "visible",
            textOverflow: "clip",
            alignItems: "center", // Centrer le contenu verticalement
        display: "flex",
           
           
        },
        '& .MuiDataGrid-columnHeader': {
            backgroundColor: headerBackground,
            fontSize: "16px",
            fontWeight: "bold",
            borderBottom: "2px solid #ddd",
        },
        '& .MuiDataGrid-row:hover': {
            backgroundColor: "#f1f1f1",
        },
        '& .MuiDataGrid-cell:focus': {
            outline: "2px solid #1565c0",
        },
    }}
/>
<Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {rowActions.map((action, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => handleRowAction(action, selectedRowId)}
                        sx={{
                            '&.css-1rju2q6-MuiButtonBase-root-MuiMenuItem-root':{
                                display:'flex',
                                alignItems:'center',
                            }
                        }}
                    >
                        {action.icon}
                        {action.label}
                    </MenuItem>
                ))}
            </Menu>
        </Paper>
    );
}

export default Table;
