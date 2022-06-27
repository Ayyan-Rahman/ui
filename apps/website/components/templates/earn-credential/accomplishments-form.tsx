import { useFormContext } from 'react-hook-form';

import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar, Stack, TextField, Typography, Box } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { mockTypes } from './__mock__';
import { AccomplishmentsTypes } from './accomplishments-schema';

type Props = {
  accomplishmentId: number;
  onUpdate: (index: number, key: string, value: string) => void;
  onDelete: (index: number) => void;
};

export function AccomplishmentsForm({
  accomplishmentId,
  onUpdate,
  onDelete,
}: Props) {
  const {
    // register,
    formState: { errors },
  } = useFormContext<AccomplishmentsTypes>();

  return (
    <Stack
      direction="column"
      gap={2}
      sx={{
        position: 'relative',
        backgroundColor: '#1C1027',
        padding: '50px',
        borderRadius: '10px',
        marginBottom: '20px',
      }}
    >
      {/* Title */}
      <TextField
        required
        variant='standard'
        label="Accomplishment Title"
        id="accomplishment_title"
        onChange={(e) => onUpdate(accomplishmentId, 'title', e.target.value)}
        //{...register('accomplishment_title')}
        error={!!errors.accomplishment_title}
        helperText={errors.accomplishment_title?.message}
      />
      {/* Accomplishment Description */}
      <TextField
        required
        label="Accomplishment Description"
        id="accomplishment_description"
        multiline
        minRows={4}
        onChange={(e) =>
          onUpdate(
            accomplishmentId,
            'accomplishmentDescription',
            e.target.value
          )
        }
        //{...register('accomplishment_description')}
        error={!!errors.accomplishment_description}
        helperText={errors.accomplishment_description?.message}
      />
      {/* Proof of work text*/}
      <Typography variant="h6" fontWeight="bold" sx={{ marginTop: '10px' }}>
        Proof of Work
      </Typography>
      <Typography
        variant="caption"
        sx={{ marginTop: '-15px', display: 'block',color:"ffffffb5" }}
      >
        Showcase your work related to this accomplishment
      </Typography>
      {/* Proof of Work: Type */}
      <Box sx={{display:"grid",gridTemplateColumns:"1fr 3fr",columnGap:"15px"}}>
        <FormControl fullWidth>
          <InputLabel variant="outlined" htmlFor="pow_type">
            Type
          </InputLabel>
          <Select
            label="Type"
            id="pow_type"
            onChange={(e) =>
              onUpdate(accomplishmentId, 'type', e.target.value.toString())
            }
            //{...register('pow_type')}
            >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {mockTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Proof of Work: Link */}
        <TextField
          required
          label="Link"
          id="pow_link"
          onChange={(e) => onUpdate(accomplishmentId, 'link', e.target.value)}
          //{...register('pow_link')}
          error={!!errors.pow_link}
          helperText={errors.pow_link?.message}
        />
      </Box>
      {/* Proof of Work: Description */}
      <TextField
        required
        label="Description"
        id="pow_description"
        multiline
        minRows={4}
        onChange={(e) =>
          onUpdate(accomplishmentId, 'description', e.target.value)
        }
        //{...register('pow_description')}
        error={!!errors.pow_description}
        helperText={errors.pow_description?.message}
      />
      <Avatar
        sx={{
          position: 'absolute',
          top: 60,
          right: 8,
          color: '#9A53FF',
          cursor: 'pointer',
        }}
        onClick={() => onDelete(accomplishmentId)}
      >
        <DeleteIcon />
      </Avatar>
    </Stack>
  );
}
