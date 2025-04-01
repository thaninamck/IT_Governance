import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const MultiOptionSelect = ({
  placeholder,
  width,
  objects,
  height,
  defaultSelected = [], // Liste de tuples [id, status]
  onSelectionChange,
}) => {
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

  // Extraire uniquement les IDs des valeurs par défaut
  const defaultIds = defaultSelected.map(([id]) => id);
  const [selectedIds, setSelectedIds] = useState(defaultIds);

  // Mettre à jour si defaultSelected change
  useEffect(() => {
    setSelectedIds(defaultSelected.map(([id]) => id));
  }, [defaultSelected]);

  const handleChange = (event) => {
    const { value } = event.target;
  
    // Créer une liste de tuples [id, status]
    const updatedSelections = value.map((id) => {
      const obj = objects.find((item) => item.id === id);
      return obj ? [obj.id, obj.status] : null;
    }).filter(Boolean); // Supprime les valeurs nulles
  
    setSelectedIds(value);
  
    if (onSelectionChange) {
      onSelectionChange(updatedSelections); // Retourne [id, status]
    }
  };
  

  return (
    <div>
      <FormControl
        sx={{
          m: 1,
          width: `${width}px`,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            height: height ? `${height}px` : 'auto',
          },
        }}
      >
        <InputLabel>{placeholder}</InputLabel>
        <Select
          multiple
          value={selectedIds}
          onChange={handleChange}
          input={<OutlinedInput label={placeholder} />}
          renderValue={(selected) =>
            selected
              .map((id) => objects.find((obj) => obj.id === id)?.status)
              .join(', ')
          }
          MenuProps={MenuProps}
        >
          {objects.map(({ id, status }) => (
            <MenuItem key={id} value={id}>
              <Checkbox checked={selectedIds.includes(id)} />
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultiOptionSelect;
