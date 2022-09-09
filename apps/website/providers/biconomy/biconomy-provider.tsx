import { PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { Biconomy } from '@biconomy/mexa';
import { ethers } from 'ethers';
import debounce from 'lodash/debounce';
import { useMutation, useQueryClient } from 'react-query';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork, useSigner } from 'wagmi';

import { Alert, Snackbar } from '@mui/material';

import { CREDENTIAL_ABI } from '../../constants/web3';
import { useSnackbar } from '../../hooks/use-snackbar';
import { Credentials, Users } from '../../services/graphql/types.generated';
import { useAuth } from '../auth';
import { BiconomyContext, MintResponse } from './context';

type Props = {
  apiKey: string;
  contractAddress: string;
};

export let biconomy: Biconomy;

export type MintStatus = {
  [key: string]: {
    askingSignature: boolean;
    isMinted: boolean;
    error: any;
  };
};

// Reference: https://github.com/bcnmy/gasless-playground/blob/master/src/components/Ethers_Custom_PersonalSign.tsx

export function BiconomyProvider({
  apiKey,
  contractAddress,
  children,
}: PropsWithChildren<Props>) {
  const RPC = {
    polygon: process.env.NEXT_PUBLIC_WEB3_POLYGON_RPC,
    rinkeby: process.env.NEXT_PUBLIC_WEB3_RINKEBY_RPC,
  };

  // State
  const [mintStatus, setMintStatus] = useState<MintStatus>(() => ({}));

  // From Wagmi
  const { data: address } = useAccount();
  const { data: signer } = useSigner();
  const { activeChain } = useNetwork();

  // From auth
  const { me, gqlAuthMethods } = useAuth();

  const snackbar = useSnackbar();

  // Credential update
  const queryClient = useQueryClient();

  const { mutateAsync: updateCredential } = useMutation(
    async (data: { id: string; tx_url: string }) => {
      return await gqlAuthMethods.update_credential_status({
        id: data.id,
        status: 'minted',
        transaction_url: data.tx_url,
      });
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('credentials');
        queryClient.invalidateQueries([
          'credential',
          data.update_credentials_by_pk.id,
        ]);

        queryClient.setQueryData('me', (old: PartialDeep<Users>) => {
          const experiences = old.experiences.map((experience) => ({
            ...experience,
            credentials: experience.credentials.map((credential) =>
              credential.id === data.update_credentials_by_pk.id
                ? {
                    ...credential,
                    ...data.update_credentials_by_pk,
                  }
                : credential
            ),
          }));

          return {
            ...old,
            experiences,
          };
        });
      },
    }
  );

  useEffect(() => {
    async function init() {
      // We're creating biconomy provider linked to your network of choice where your contract is deployed
      // const jsonRpcProvider = new ethers.providers.JsonRpcProvider(
      //   RPC[process.env.NEXT_PUBLIC_MINT_CHAIN]
      // );

      biconomy = new Biconomy(window.ethereum, {
        apiKey: process.env.NEXT_PUBLIC_WEB3_BICONOMY_API_KEY,
        debug: true,
        contractAddresses: [contractAddress],
      });

      await biconomy.init();

      // biconomy
      //   .onEvent(biconomy.READY, async () => {
      //     // Initialize your dapp here like getting user accounts etc
      //     contract = new ethers.Contract(
      //       contractAddress,
      //       CREDENTIAL_ABI,
      //       biconomy.getSignerByAddress(address.address)
      //     );

      //     contractInterface = new ethers.utils.Interface(CREDENTIAL_ABI);
      //   })
      //   .onEvent(biconomy.ERROR, (error, message) => {
      //     // Handle error while initializing mexa
      //     console.log(message);
      //     console.log(error);
      //   });
    }

    if (address && activeChain && signer?.provider) {
      init();
    }
  }, [address, activeChain, signer?.provider]);

  const getSignatureParametersEthers = (signature: any) => {
    if (!ethers.utils.isHexString(signature)) {
      throw new Error(
        'Given value "'.concat(signature, '" is not a valid hex string.')
      );
    }
    const r = signature.slice(0, 66);
    const s = '0x'.concat(signature.slice(66, 130));
    let v = '0x'.concat(signature.slice(130, 132));
    v = ethers.BigNumber.from(v).toString();
    if (![27, 28].includes(Number(v))) v += 27;
    return {
      r: r,
      s: s,
      v: Number(v),
    };
  };

  /**
   * It mints a new NFT token.
   * @param [token_uri] - This is the metadata that you want to attach to the token.
   * @returns A boolean value.
   */
  const mint = async (token_uri = ''): Promise<MintResponse> => {
    try {
      // let tx: string;

      // const provider = await biconomy.provider;
      // const contractInstance = new ethers.Contract(
      //   contractAddress,
      //   CREDENTIAL_ABI,
      //   biconomy.ethersProvider
      // );

      // const { data: contractData } =
      //   await contractInstance.populateTransaction.mint(
      //     address.address,
      //     token_uri
      //   );

      // const gasLimit = await provider.estimateGas({
      //   to: contractAddress,
      //   from: address.address,
      //   data: contractData,
      // });

      // const txParams = {
      //   data: contractData,
      //   to: contractAddress,
      //   from: address.address,
      //   gasLimit: gasLimit.toNumber() * 3,
      //   signatureType: 'EIP712_SIGN',
      // };
      let tx: string;

      const userAddress = address;
      const ethersProvider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const walletProvider = ethersProvider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        CREDENTIAL_ABI,
        biconomy.ethersProvider
      );
      const nonce = await contractInstance.getNonce(userAddress);
      const contractInterface = new ethers.utils.Interface(CREDENTIAL_ABI);
      const functionSignature = contractInterface.encodeFunctionData('mint', [
        address.address,
        token_uri,
      ]);

      const messageToSign = ethers.utils.solidityKeccak256(
        ['uint256', 'address', 'uint256', 'bytes'],
        [
          nonce.toNumber(),
          contractAddress,
          Number(activeChain.network),
          Buffer.from(functionSignature, 'hex'),
        ]
      );

      const signature = await walletProvider.signMessage(messageToSign);

      const { r, s, v } = getSignatureParametersEthers(signature);
      console.log(r, s, v);

      const provider = await biconomy.provider;

      const { data } =
        await contractInstance.populateTransaction.executeMetaTransaction(
          userAddress,
          functionSignature,
          r,
          s,
          v
        );

      const txParams = {
        data: data,
        to: contractAddress,
        from: userAddress,
        signatureType: 'PERSONAL_SIGN',
      };

      try {
        setMintStatus((prev) => ({
          ...prev,
          [token_uri]: {
            askingSignature: true,
            isMinted: false,
            error: null,
          },
        }));

        const promise = provider.send('eth_sendTransaction', [txParams]);

        setMintStatus((prev) => ({
          ...prev,
          [token_uri]: {
            askingSignature: false,
            isMinted: false,
            error: null,
          },
        }));

        tx = await promise;

        setMintStatus((prev) => ({
          ...prev,
          [token_uri]: {
            askingSignature: false,
            isMinted: true,
            error: null,
          },
        }));
      } catch (err) {
        snackbar.onOpen({
          message: 'Minting failed, please try again',
          type: 'error',
        });

        setMintStatus((prev) => ({
          ...prev,
          [token_uri]: {
            askingSignature: false,
            isMinted: true,
            error: err,
          },
        }));

        return {
          isMinted: false,
          error: err,
        };
      }

      biconomy.on('txHashGenerated', (data: any) => {
        console.log(data);
      });
      biconomy.on('txMined', (data: any) => {
        console.log(data);
      });

      return {
        isMinted: true,
        transactionUrl:
          (process.env.NEXT_PUBLIC_MINT_CHAIN === 'polygon'
            ? 'https://polygonscan.com'
            : 'https://rinkeby.etherscan.io') +
          '/tx/' +
          tx,
      };
    } catch (err) {
      snackbar.onOpen({
        message: 'Biconomy is still loading. Try again in a few minutes!',
        type: 'warning',
      });
    }
  };

  const mintCredential = async (
    credential: PartialDeep<Credentials>
  ): Promise<MintResponse> => {
    try {
      // 1. verify is the user owns the credential
      if (credential.target_id !== me.id) {
        throw new Error('You are not the owner of this credential!');
      }

      // 2. mint the NFT
      const res = await mint(credential?.uri || '');

      if (res.error) {
        throw res.error;
      }

      // 3. change the status of the credential
      await updateCredential({
        id: credential.id,
        tx_url: res.transactionUrl,
      });

      return res;
    } catch (error) {
      console.log('[useMint] Error:', error);

      return {
        isMinted: false,
        error,
      };
    }
  };

  return (
    <BiconomyContext.Provider
      value={{
        mint,
        mintCredential,
        mintStatus,
      }}
    >
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={snackbar.handleClose}
      >
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>
    </BiconomyContext.Provider>
  );
}
