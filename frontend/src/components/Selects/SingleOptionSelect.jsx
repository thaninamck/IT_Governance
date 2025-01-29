import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const SingleOptionSelect = ({ placeholder, width, statuses, onChange,checkedStatus }) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 196,
      },
    },
  };

  // État pour une seule option sélectionnée
  const [selectedStatus, setSelectedStatus] = React.useState(checkedStatus);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    // On conserve le tuple sélectionné (id, status)
    setSelectedStatus(value);

    // Appel de la fonction de rappel avec l'ID et le statut sélectionnés
    if (onChange) {
      onChange(value[0], value[1]);
    }
  };

  return (
    <div>
      <FormControl
        sx={{
          m: 1,
          width: `${width}px`,
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        }}
      >
        <InputLabel id="demo-single-select-label">{placeholder}</InputLabel>
        <Select
          labelId="demo-single-select-label"
          id="demo-single-select"
          value={selectedStatus}
          onChange={handleChange}
          input={<OutlinedInput label={placeholder} />}
          renderValue={(selected) =>
            selected ? selected[1] : '' // Affiche le nom du statut ou rien s'il n'y a pas de sélection
          }
          MenuProps={MenuProps}
        >
          {statuses.map(([id, status]) => (
            <MenuItem key={id} value={[id, status]}>
              <Checkbox
                checked={selectedStatus && selectedStatus[0] === id}
              />
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SingleOptionSelect;