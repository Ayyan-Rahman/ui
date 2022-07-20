import { TOKENS } from '@gateway/theme';
import { useState } from 'react';
import {
  Grid,
  Stack,
  Typography,
  Divider,
  Chip,
  TextField,
} from '@mui/material';

import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";


import SearchIcon from '@mui/icons-material/Search';

export function Skills() {
  const skills = [
    { title: 'UX Design' },
    { title: 'UI Design' },
    { title: 'Product Strategy' },
    { title: 'Product Design' },
    { title: 'Web3' },
    {title: 'Business Development'},
    { title: 'Blockchain' },
    { title: 'Cryptocurrency' },
  ];
  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      alignItems="flex-start"
      gap={6}
      p={TOKENS.CONTAINER_PX}
    >
      {/* TimeZone */}
      <Grid
        container
        direction={{ xs: 'column', md: 'row' }}
        sx={{ rowGap: '15px',marginTop:"24px", alignItems:"flex-start"}}
      >
        <Grid item xs={4}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: '#fff' }}
            ml={{ xs: '0px', md: '40px' }}
            mb={{xs: '27px', md: '0px'}}
          >
            Skills
          </Typography>
        </Grid>
        <Grid item xs={7.5}>
          <Stack >
            <Autocomplete
              multiple
              id="tags-standard"
              options={skills}
              disableClearable
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select your skills"
                  sx={{
                    '& label.Mui-focused': {
                      textTransform: 'uppercase',
                    },
                    '& label.MuiInputLabel-shrink ': {
                      textTransform: 'uppercase',
                    },
                    '& div fieldset legend span': {
                      marginRight: '30px',
                      paddingRight: '4px',
                    },
                  }}
                />
              )}
              popupIcon={<SearchIcon />}
              sx={{
                width: { xs: '94vw', md: '65%' },
                [`& .${autocompleteClasses.popupIndicator}`]: {
                  transform: "none",
                  color:"rgba(255, 255, 255, 0.56)"
                }
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
