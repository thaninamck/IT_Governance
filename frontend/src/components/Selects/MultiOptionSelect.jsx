import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const MultiOptionSelect = ({ placeholder, width, objects }) => {
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

  const [selectedStatuses, setSelectedStatuses] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    // On conserve les tuples complets dans `selectedStatuses`
    setSelectedStatuses(
      typeof value === 'string' ? value.split(',') : value
    );
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
        <InputLabel id="demo-multiple-checkbox-label">{placeholder}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedStatuses}
          onChange={handleChange}
          input={<OutlinedInput label={placeholder} />}
          renderValue={(selected) =>
            selected.map((item) => item[1]).join(', ') // Affiche uniquement les noms des statuts sélectionnés
          }
          MenuProps={MenuProps}
        >
          {objects.map(({ id, status }) => (
            <MenuItem key={id} value={[id, status]}>
              <Checkbox
                checked={
                  selectedStatuses.findIndex((item) => item[0] === id) > -1
                }
              />
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultiOptionSelect;
