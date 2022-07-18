import { useRouter } from 'next/router';

import { useFormContext } from 'react-hook-form';

import {
  Button,
  Chip,
  CircularProgress,
  Stack,
  TextField,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import WalletInput from '../../molecules/wallet-input';
import { mockCategories } from './__mock__';
import { NewCredentialSchema } from './schema';

/* TODO: Change hardcoded text to translate */
/* TODO: Where does the categories comes from */
/* FIXME: Select label background on focus */
type Props = {
  onSubmit: (data?: NewCredentialSchema) => void;
  validateWallets: (wallets: string[]) => Promise<boolean>;
  isLoading: boolean;
};

export function Form({ validateWallets, onSubmit, isLoading }: Props) {
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useFormContext<NewCredentialSchema>();

  return (
    <Stack
      component="form"
      direction="column"
      gap={2}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        required
        label="Title"
        id="name"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <FormControl fullWidth>
        <InputLabel variant="outlined" htmlFor="category">
          Category
        </InputLabel>
        <Select label="Category" id="category" {...register('category')}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {mockCategories.map((category) => (
            <MenuItem key={category.value} value={category.value}>
              {category.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        required
        label="Description"
        id="description"
        multiline
        minRows={4}
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <WalletInput
        label="Wallet Adressess"
        id="wallets"
        multiline
        name="wallets"
        error={!!errors.wallets}
        errors={errors.wallets}
        helperText={
          errors.wallets
            ? 'Invalid wallet(s) added'
            : 'Press <Enter> or <Space> to add the wallet'
        }
        sx={{
          width: '100%',
        }}
        set={(wallets: string[]) => {
          setValue('wallets', wallets);
          validateWallets(wallets);
        }}
      />
      <Stack
        direction="row-reverse"
        justifyContent="end"
        gap={1}
        sx={{ mt: 2 }}
      >
        <Button
          variant="contained"
          type="submit"
          disabled={isLoading || Object.keys(errors).length > 0}
        >
          {isLoading ? <CircularProgress color="inherit" size={24} /> : 'Save'}
        </Button>
        <Button
          variant="outlined"
          type="button"
          onClick={() => {
            router.back();
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}
