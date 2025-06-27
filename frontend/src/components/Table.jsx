// import * as React from "react";
// import { useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import Paper from "@mui/material/Paper";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import VisibilityIcon from '@mui/icons-material/Visibility';

// import {
//   IconButton,
//   Select,
//   MenuItem as MuiMenuItem,
//   FormControl,
//   Typography,
// } from "@mui/material";
// import StatusMission from "./StatusMission";
// import { useNavigate } from "react-router-dom";
// import { useBreadcrumb } from "../Context/BreadcrumbContext";

// function ExpandableCell({ value, maxInitialLength = 50, onExpand }) {
//   const [isExpanded, setIsExpanded] = React.useState(false);

//   const toggleExpand = () => {
//     const newExpandedState = !isExpanded;
//     setIsExpanded(newExpandedState);
//     // Notifier le parent pour ajuster la mise en page
//     onExpand(newExpandedState);
//   };

//   // Tronquer le contenu initial
//   const displayValue = isExpanded
//   ? value
//   : typeof value === 'string' && value.length > maxInitialLength
//   ? value.substring(0, maxInitialLength) + "..."
//   : value;

//   return (
//     <div
//       onClick={toggleExpand}
//       style={{
//         width: "100%",
//         wordWrap: "break-word",
//         lineHeight: "1.4",
//         cursor: "pointer",
//         // backgroundColor: isExpanded ? '#f0f0f0' : 'transparent',
//         border: isExpanded ? "1px solid #ddd" : "none",
//         transition: "all 0.3s ease",
//         minHeight: isExpanded ? "120px" : "auto", // Hauteur minimale quand étendu
//         maxHeight: isExpanded ? "none" : "60px", // Limiter la hauteur initiale
//         overflow: "visible",
//         paddingTop: "8px",
//       }}
//       title={!isExpanded ? "Cliquez pour développer" : "Cliquez pour réduire"}
//     >
//       {displayValue}
//       {value?.length > maxInitialLength && (
//                 <span
//           style={{
//             color: "blue",
//             marginLeft: "2px",
//             fontSize: "0.5em",
//           }}
//         >
//           {isExpanded ? "Réduire" : "Développer"}
//         </span>
//       )}
//     </div>
//   );
// }

// function Table({
//   columnsConfig,
//   rowsData,
//   checkboxSelection = false,
//   allterRowcolors,
//   getRowLink,
//   headerTextBackground,
//   onRowSelectionChange,
//   headerBackground = "transparent",
//   statusOptions = [],
//   statusColors = {},
//   rowActions = [],
//   onCellEditCommit,
//   onRowClick,
//   onSelectionChange
// }) {
//   const isZebraStriping = allterRowcolors; // Mets à false pour désactiver
//   const oddRowColor = "#E9EFF8";
//   const evenRowColor = "white";

//   const handleRowSelectionChange = (newRowSelectionModel) => {
//     setRowSelectionModel(newRowSelectionModel);

//     // Si des lignes sont sélectionnées
//     if (newRowSelectionModel.length > 0) {
//       const selectedRowId = newRowSelectionModel[0]; // ID de la ligne sélectionnée
//       const selectedRow = rows.find((row) => row.id === selectedRowId); // Trouve la ligne correspondante
//       if (onRowSelectionChange) {
//         onRowSelectionChange(selectedRow); // Passer la nouvelle sélection au parent
//       }
//       console.log("Ligne sélectionnée:", selectedRow); // Afficher les informations de la ligne
//     } else {
//       console.log("Aucune ligne sélectionnée");
//     }
//   };
//   const handleSelectionChange = (newSelection) => {
//     setSelectionModel(newSelection);
    
//     // Récupérer les objets sélectionnés
//     const selectedRows = rows.filter(row => newSelection.includes(row.id));
  
//     // Envoyer au parent
//     if (onSelectionChange) {
//       onSelectionChange(selectedRows);
//     }
//   };
//   const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

//   const { setBreadcrumbs } = useBreadcrumb();
//   const navigate = useNavigate(); // Hook pour la navigation
//   const [rows, setRows] = React.useState(rowsData);
//   const [expandedCells, setExpandedCells] = React.useState({});
//   const [selectionModel, setSelectionModel] = React.useState([]);


//   const handleRowClick = (params) => {
//     if (onRowClick) {
//       onRowClick(params.row);
//     }
//   };

//   // const handleRowClick = (params) => {
//   //   if (getRowLink) {
//   //     const link = getRowLink(params.row); // Générer dynamiquement le lien
//   //     setBreadcrumbs([
//   //       { label: "Mes Mission", path: "/gestionmission" },
//   //       {
//   //         label: params.row.mission,
//   //         path: `/gestionmission/${params.row.mission}`,
//   //       },
//   //     ]);
//   //      // Stocker les informations de la ligne dans le state local ou via navigation state
//   //   navigate(link, { state: { missionData: params.row } });
//   //   console.log(params.row)
      
//   //   }
//   // };

//   const handleCellExpand = (rowId, field, isExpanded) => {
//     setExpandedCells((prev) => ({
//       ...prev,
//       [`${rowId}-${field}`]: isExpanded,
//     }));
//   };
//   const getRowHeight = (params) => {
//     // Calculer la hauteur de la ligne en fonction des cellules expansées
//     const isAnyCellExpanded = Object.keys(expandedCells).some(
//       (key) => key.startsWith(`${params.id}-`) && expandedCells[key]
//     );
//     return isAnyCellExpanded ? "auto" : 70; // Par défaut 50px, auto si une cellule est étendue
//   };

//   const columns = [
//     ...(checkboxSelection
//       ? [
//           {
//             field: "checkbox",
//             headerName: "",
//             width: 60,
//           },
//         ]
//       : []),
//     ...columnsConfig.map((colConfig) => ({
//       field: colConfig.field,
//       headerName: colConfig.headerName,
//       width: colConfig.width || 180,
//       flex: colConfig.flex || 0,
//       cellClassName: "dynamic-height-cell",
//       editable: colConfig.editable || false,
//       renderCell: (params) => {
//         // Vérifie si une fonction personnalisée est fournie
//         if (colConfig.customRenderCell) {
//           return colConfig.customRenderCell(params);
//         }
//         // Ajoute une condition spécifique en fonction du champ
//         if (colConfig.field === "status") {
//           return (
//             // <FormControl sx={{ width: "100%" }}>
//             //   <Select
//             //     value={params.row.status}
//             //     onChange={(e) => handleStatusChange(e, params.row.id)}
//             //     disabled // Désactive le Select
//             //     displayEmpty
//             //     renderValue={(selected) => {
//             //       const color = statusColors[selected] || "gray"; // Détermine la couleur du statut sélectionné
//             //       return (
//             //         <span style={{ color: color }}>
//             //           {selected || "Choisir un statut"}
//             //         </span>
//             //       );
//             //     }}
//             //     sx={{
//             //       fontSize: "14px",
//             //       height: "40px",
//             //       backgroundColor: "#fff",
//             //       borderRadius: "4px",
//             //     }}
//             //   >
//             //     {statusOptions.map((status, color) => (
//             //       <MuiMenuItem
//             //         key={status}
//             //         value={status}
//             //         style={{ color: statusColors[status] || "gray" }}
//             //       >
//             //         {status}
//             //       </MuiMenuItem>
//             //     ))}
//             //   </Select>
//             // </FormControl>

//             <Typography sx={{ color: statusColors[params.row.status] || "gray" }}>
//   {params.row.status || "Aucun statut"}
// </Typography>
//           );

//         }
//         if (colConfig.field === "dateField") {
//           // Formater la date en "DEC 27, 2024"
//           const date = new Date(params.value);
//           const formattedDate = date
//             .toLocaleString("en-US", {
//               month: "short",
//               day: "2-digit",
//               year: "numeric",
//             })
//             .toUpperCase();

//           return <span>{formattedDate}</span>;
//         }
//         if (colConfig.field === "dateField1") {
//           // Formater la date en "DEC 27, 2024"
//           const date = new Date(params.value);
//           const formattedDate = date
//             .toLocaleString("en-US", {
//               month: "short",
//               day: "2-digit",
//               year: "numeric",
//             })
//             .toUpperCase();

//           return <span>{formattedDate}</span>;
//         }
//         if (colConfig.field === "rapport") {
//           return (
//             <IconButton
//               aria-label="view report"
//               onClick={(event) => handleClick(event, params.row.id)}
//               sx={{
//                 fontSize: "14px",
//                 border: "1px solid #ddd",
//                 borderRadius: "3px",
//                 height: "40px",
//                 padding: "15px",
//               }}
//             >
//               <span>View Report</span>
//             </IconButton>
//           );
//         }
//         if (colConfig.field === "actions") {
//           return (
//             <IconButton
//               aria-label="more"
//               onClick={(event) => handleClick(event, params.row.id)}
//             >
//               <MoreVertIcon />
//             </IconButton>
//           );
//         }
//         if (colConfig.field === "statusMission") {
//           return <StatusMission status={params.value} />;
//         }
//         // Largeur fixe et hauteur dynamique
//         if (colConfig.expandable) {
//           return (
//             <ExpandableCell
//               value={params.value}
//               maxInitialLength={colConfig.maxInitialLength || 50}
//               onExpand={(isExpanded) =>
//                 handleCellExpand(params.row.id, colConfig.field, isExpanded)
//               }
//             />
//           );
//         }

//         // Rendu par défaut
//         return params.value;
//       },
//     })),
//   ];

//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [selectedRowId, setSelectedRowId] = React.useState(null);

//   const handleClick = (event, rowId) => {
//     event.stopPropagation();
//     setAnchorEl(event.currentTarget);
//     setSelectedRowId(rowId);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleRowAction = (action, rowId) => {
//     // Récupérer l'objet de la ligne en utilisant l'ID de la ligne
//     const selectedRow = rows.find((row) => row.id === rowId);
//      // Vérifier si l'action est désactivée pour cette ligne
//      if (action.disabled && action.disabled(selectedRow)) {
//       return; // Ne pas exécuter l'action si elle est désactivée
//     }

//     action.onClick(selectedRow); // Passez l'objet de la ligne à l'action
//     handleClose();
//   };

//   const handleStatusChange = (event, rowId) => {
//     const updatedRows = rows.map((row) =>
//       row.id === rowId ? { ...row, status: event.target.value } : row
//     );
//     setRows(updatedRows);
//   };

//   const handleCellEditCommit = (params) => {
//     setRows((prevRows) =>
//       prevRows.map((row) =>
//         row.id === params.id ? { ...row, [params.field]: params.value } : row
//       )
//     );
//     console.log("Mise à jour de l'utilisateur :", params);
//   };

//   return (
//     <Paper sx={{ margin: "0% 1%", width: "max-content" }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         disableRowSelectionOnClick
//         checkboxSelection={checkboxSelection}
//         autoHeight
//         initialState={{
//           pagination: {
//             paginationModel: { pageSize: 25 }, // Définit 25 lignes par page par défaut
//           },
//         }}
//         onRowClick={handleRowClick} // Ajout du gestionnaire de clic sur la ligne
//         getRowHeight={getRowHeight}
//         selectionModel={checkboxSelection ? selectionModel : []} // Applique seulement si activé
//         onRowSelectionModelChange={
//           checkboxSelection
//             ? (newSelection) => {
//                 setSelectionModel(newSelection); // Met à jour l’état local
                
//                 // Récupérer les objets sélectionnés
//                 const selectedRows = rows.filter(row => newSelection.includes(row.id));
  
//                 // Envoyer la sélection au parent
//                 if (onSelectionChange) {
//                   onSelectionChange(selectedRows);
//                 }
//               }
//             : undefined
//         }
        
//         sx={{
//           border: "1px solid #ccc",

//           "& .MuiDataGrid-cell": {
//             borderRight: "1px solid #ddd",
//             borderBottom: "1px solid #ddd",
//             whiteSpace: "normal",
//             wordWrap: "break-word",
//           //  overflow: "auto",
//             textOverflow: "clip",
//             alignItems: "center", // Centrer le contenu verticalement
//             display: "flex",
//           },
//           "& .MuiDataGrid-columnHeader": {
//             backgroundColor: headerBackground,
//             color: headerTextBackground, // Texte blanc
//             fontSize: "16px",
//             fontWeight: "bold",
//             borderBottom: "2px solid #ddd",
//           },
//           "& .MuiDataGrid-row:hover": {
//             backgroundColor: "#f1f1f1",
//           },
//           "& .MuiDataGrid-cell:focus": {
//             outline: "2px solid #1565c0",
//           },

//           ...(isZebraStriping && {
//             // Applique le style au tableau des elements uniquement si activé
//             "& .MuiDataGrid-row:nth-of-type(odd)": {
//               backgroundColor: oddRowColor,
//             },
//             "& .MuiDataGrid-row:nth-of-type(even)": {
//               backgroundColor: evenRowColor,
//             },
//           }),
//         }}

//         // sx={{
//         //   border: "none",
//         //   fontSize: "14px",
        
//         //   "& .MuiDataGrid-root": {
//         //     borderRadius: "12px",
//         //   },
//         //   "& .MuiDataGrid-columnHeaders": {
//         //     backgroundColor: headerBackground,
//         // color: headerTextBackground,
//         //     fontWeight: 600,
//         //     fontSize: "15px",
//         //     borderBottom: "1px solid #cbd5e1",
//         //   },
        
//         //   "& .MuiDataGrid-columnSeparator": {
//         //     display: "none",
//         //   },
        
//         //   "& .MuiDataGrid-cell": {
//         //     borderBottom: "1px solid #e2e8f0",
//         //     padding: "10px",
//         //     whiteSpace: "normal",
//         //     wordWrap: "break-word",
//         //     alignItems: "center",
//         //     display: "flex",
//         //     color: "#0f172a", // Slate 900
//         //     backgroundColor: "#ffffff",
//         //     transition: "background 0.3s ease",
//         //   },
        
//         //   "& .MuiDataGrid-row:hover .MuiDataGrid-cell": {
//         //     backgroundColor: "#f1f5f9", // Slate 100
//         //   },
        
//         //   "& .MuiDataGrid-row.Mui-selected, .MuiDataGrid-row.Mui-selected:hover": {
//         //     backgroundColor: "#dbeafe !important", // Blue-100
//         //   },
        
//         //   "& .MuiDataGrid-cell:focus": {
//         //     outline: "none",
//         //   },
        
//         //   // Zebra striping
//         //   ...(isZebraStriping && {
//         //     "& .MuiDataGrid-row:nth-of-type(odd) .MuiDataGrid-cell": {
//         //       backgroundColor: "#f8fafc", // Slate-50
//         //     },
//         //     "& .MuiDataGrid-row:nth-of-type(even) .MuiDataGrid-cell": {
//         //       backgroundColor: "#ffffff",
//         //     },
//         //   }),
//         // }}
        
//       />
//        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
//   {(rowActions || []).map((action, index) => {
//     // Utilisez une valeur par défaut pour `rows` si elle est undefined
//     const rowsSafe = rows || [];
//     // const selectedRow = rowsSafe.find((row) => row.id === selectedRowId) || {};
//     const selectedRow = Array.isArray(rowsSafe) ? rowsSafe.find((row) => row.id === selectedRowId) || {} : {};

//     const isDisabled = action.disabled && action.disabled(selectedRow);

//     return (
//       <MenuItem
//         key={index}
//         onClick={() => handleRowAction(action, selectedRowId)}
//         disabled={isDisabled} // Désactiver l'élément du menu si nécessaire
//         sx={{
//           "&.css-1rju2q6-MuiButtonBase-root-MuiMenuItem-root": {
//             display: "flex",
//             alignItems: "center",
//             opacity: isDisabled ? 0.5 : 1, // Réduire l'opacité si désactivé
//             cursor: isDisabled ? "not-allowed" : "pointer", // Changer le curseur si désactivé
//           },
//         }}
//       >
//         {/* Afficher l'icône */}
//         {action.icon && (
//           typeof action.icon === "function"
//             ? action.icon(selectedRow) // Appeler la fonction icon avec selectedRow
//             : action.icon
//         )}

//         {/* Afficher le label */}
//         {action.label && (
//           typeof action.label === "function"
//             ? action.label(selectedRow) // Appeler la fonction label avec selectedRow
//             : action.label
//         )}
//       </MenuItem>
//     );
//   })}
// </Menu>
//     </Paper>
//   );
// }

// export default Table;

import * as React from "react";
import { useState, useMemo } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  IconButton,
  Select,
  MenuItem as MuiMenuItem,
  FormControl,
  Typography,
  Box,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import StatusMission from "./StatusMission";
import { useNavigate } from "react-router-dom";
import { useBreadcrumb } from "../Context/BreadcrumbContext";

// Composant pour les cellules expansibles
function ExpandableCell({ value, maxInitialLength = 50, onExpand }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onExpand(newExpandedState);
  };

  const displayValue = isExpanded
    ? value
    : typeof value === "string" && value.length > maxInitialLength
    ? `${value.substring(0, maxInitialLength)}...`
    : value;

  return (
    <Tooltip title={!isExpanded ? "Cliquez pour développer" : ""}>
      <Box
        onClick={toggleExpand}
        sx={{
          width: "100%",
          wordWrap: "break-word",
          lineHeight: 1.4,
          cursor: "pointer",
          minHeight: isExpanded ? "120px" : "auto",
          maxHeight: isExpanded ? "none" : "80px",
          overflow: "visible",
          paddingTop: "8px",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: isExpanded ? "transparent" : "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        {displayValue}
        {value?.length > maxInitialLength && (
          <Typography
            component="span"
            sx={{
              color: "primary.main",
              marginLeft: "4px",
              fontSize: "0.8em",
              fontWeight: 500,
            }}
          >
          
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}

function Table({
  columnsConfig,
  rowsData,
  checkboxSelection = false,
  allterRowcolors,
  getRowLink,
  headerTextBackground = "#fff",
  onRowSelectionChange,
  headerBackground = "#1e3a8a",
  statusOptions = [],
  statusColors = {},
  rowActions = [],
  onCellEditCommit,
  onRowClick,
  onSelectionChange,
  loading = false,
  pageSizeOptions = [10, 25, 50],
  defaultPageSize = 10,
  //height = "70vh",
  autoHeight=true,
  density = "standard",
}) {
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumb();
  const [rows, setRows] = useState(rowsData);
  const [expandedCells, setExpandedCells] = useState({});
  const [selectionModel, setSelectionModel] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Gestion des couleurs des lignes alternées
  const isZebraStriping = allterRowcolors;
  const oddRowColor = "#f8f9fa";
  const evenRowColor = "#ffffff";

  // Mémoïsation des colonnes pour optimiser les performances
  const columns = useMemo(() => {
    const baseColumns = [
      ...(checkboxSelection
        ? [
            {
              field: "checkbox",
              headerName: "",
              width: 60,
              sortable: false,
              filterable: false,
            },
          ]
        : []),
      ...columnsConfig.map((colConfig) => ({
        ...colConfig,
        width: colConfig.width || 180,
        flex: colConfig.flex || 0,
        headerAlign: "center",
        align: colConfig.align || "left",
        cellClassName: "dynamic-height-cell",
        editable: colConfig.editable || false,
        renderCell: (params) => {
          if (colConfig.customRenderCell) {
            return colConfig.customRenderCell(params);
          }

          if (colConfig.field === "status") {
            return (
              <Typography
                sx={{
                  color: statusColors[params.row.status] || "text.secondary",
                  fontWeight: 500,
                }}
              >
                {params.row.status || "—"}
              </Typography>
            );
          }

          if (colConfig.field === "actions") {
            return (
              <IconButton
                aria-label="actions"
                onClick={(event) => handleClick(event, params.row.id)}
                size="small"
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            );
          }

          if (colConfig.field === "statusMission") {
            return <StatusMission status={params.value} />;
          }

          if (colConfig.expandable) {
            return (
              <ExpandableCell
                value={params.value}
                maxInitialLength={colConfig.maxInitialLength || 50}
                onExpand={(isExpanded) =>
                  handleCellExpand(params.row.id, colConfig.field, isExpanded)
                }
              />
            );
          }

          return (
            <Typography variant="body2" noWrap={!colConfig.expandable}>
              {params.value || "—"}
            </Typography>
          );
        },
      })),
    ];

    return baseColumns;
  }, [columnsConfig, checkboxSelection, statusColors]);

  // Gestion des événements
  const handleClick = (event, rowId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleClose = () => setAnchorEl(null);

  const handleRowAction = (action, rowId) => {
    const selectedRow = rows.find((row) => row.id === rowId);
    if (action.disabled && action.disabled(selectedRow)) return;
    action.onClick(selectedRow);
    handleClose();
  };

  const handleCellExpand = (rowId, field, isExpanded) => {
    setExpandedCells((prev) => ({
      ...prev,
      [`${rowId}-${field}`]: isExpanded,
    }));
  };

  const getRowHeight = (params) => {
    const isAnyCellExpanded = Object.keys(expandedCells).some(
      (key) => key.startsWith(`${params.id}-`) && expandedCells[key]
    );
    return isAnyCellExpanded ? "auto" : 68;
  };

  const handleRowClick = (params) => {
    if (onRowClick) {
      onRowClick(params.row);
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectionModel(newSelection);
    const selectedRows = rows.filter((row) => newSelection.includes(row.id));
    if (onSelectionChange) onSelectionChange(selectedRows);
  };

  return (
    <Paper
      sx={{
        margin: "16px",
      //  width: "calc(100% - 32px)",
      width:"max-content",
        overflow: "hidden",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
        borderRadius: "8px",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        checkboxSelection={checkboxSelection}
        
        autoHeight={autoHeight}
        sx={{
         // height,
          "& .MuiDataGrid-virtualScroller": {
           // minHeight: "200px",
          },
          "& .MuiDataGrid-cell": {
            borderRight: "1px solid rgba(224, 224, 224, 0.5)",
            borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
            whiteSpace: "normal",
            wordWrap: "break-word",
            alignItems: "center",
            display: "flex",
            padding: "0 8px",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: headerBackground,
            color: headerTextBackground,
            fontSize: "14px",
            fontWeight: 600,
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
          },
          "& .MuiDataGrid-row": {
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.02)",
            },
            "&.Mui-selected": {
              backgroundColor: "rgba(25, 118, 210, 0.08)",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.12)",
              },
            },
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "2px solid #1976d2",
            outlineOffset: "-2px",
          },
          ...(isZebraStriping && {
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: oddRowColor,
            },
            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: evenRowColor,
            },
          }),
        }}
        components={{
          LoadingOverlay: LinearProgress,
          Toolbar: GridToolbar,
        }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            printOptions: { disableToolbarButton: true },
          },
        }}
        pageSize={defaultPageSize}
        rowsPerPageOptions={pageSizeOptions}
        pagination
        density={density}
        onRowClick={handleRowClick}
        getRowHeight={getRowHeight}
        selectionModel={checkboxSelection ? selectionModel : []}
        onRowSelectionModelChange={
          checkboxSelection ? handleSelectionChange : undefined
        }
        disableColumnMenu={false}
        disableColumnFilter={false}
        disableColumnSelector={false}
        disableDensitySelector={false}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
            minWidth: "180px",
          },
        }}
      >
        {rowActions.map((action, index) => {
          const selectedRow = rows.find((row) => row.id === selectedRowId) || {};
          const isDisabled = action.disabled && action.disabled(selectedRow);

          return (
            <MenuItem
              key={index}
              onClick={() => handleRowAction(action, selectedRowId)}
              disabled={isDisabled}
              sx={{
                padding: "8px 16px",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: !isDisabled
                    ? "rgba(0, 0, 0, 0.04)"
                    : "inherit",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: isDisabled ? 0.5 : 1,
                }}
              >
                {action.icon &&
                  (typeof action.icon === "function"
                    ? action.icon(selectedRow)
                    : action.icon)}
                {action.label &&
                  (typeof action.label === "function"
                    ? action.label(selectedRow)
                    : action.label)}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </Paper>
  );
}

// Composant de chargement personnalisé
function LinearProgress() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "4px",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <CircularProgress
        size={24}
        sx={{
          position: "absolute",
          top: "10px",
          left: "calc(50% - 12px)",
        }}
      />
    </Box>
  );
}

export default Table;