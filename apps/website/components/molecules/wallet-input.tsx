import { useState } from 'react';

import { Chip, TextField, Autocomplete } from '@mui/material';

/* A React component that is exported as a named export. */
export const WalletInput = ({ set, ...props }) => {
  const [wallets, setWallets] = useState([]);
  const [input, setInput] = useState<string>('');

  return (
    <Autocomplete
      multiple
      id="tags-filled"
      options={[]}
      value={wallets}
      inputValue={input}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === 'reset') {
          setInput('');
          return;
        } else {
          setInput(newInputValue);
        }
      }}
      freeSolo
      renderTags={(value: string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            key={index}
            variant="filled"
            label={option}
            color={
              props.errors
                ?.map((error) => error.message || null)
                .includes(`${option} is not a valid wallet address`)
                ? 'error'
                : 'default'
            }
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Wallet Adressess"
          id="wallets"
          multiline
          {...props}
        />
      )}
      onKeyDown={(event) => {
        if (
          (event.key === 'Enter' || event.key === ' ' || event.key === ',') &&
          (event.target as HTMLInputElement).value.length &&
          !wallets.includes((event.target as HTMLInputElement).value)
        ) {
          event.preventDefault();
          setWallets((wallets) => [
            ...wallets,
            (event.target as HTMLInputElement).value,
          ]);
          set([...wallets, (event.target as HTMLInputElement).value]);
          setInput('');
        }
      }}
      onChange={(event, val: string[]) => {
        setWallets(val);
        set(val);
      }}
    />
  );
};

export default WalletInput;
