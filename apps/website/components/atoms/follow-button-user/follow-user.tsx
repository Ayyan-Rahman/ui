import useTranslation from 'next-translate/useTranslation';

import { useMutation } from '@tanstack/react-query';

import { useBidirectionFollow } from '../../../hooks/use-bidirectional-follow';
import { LoadingButton } from '../loading-button';
import { FollowButtonProps } from './type';

export function FollowUserButton({
  wallet,
  onSuccess,
  ...props
}: FollowButtonProps) {
  const { t } = useTranslation('common');
  const { onFollow } = useBidirectionFollow();
  const followMutation = useMutation(() => onFollow(wallet), { onSuccess });

  return (
    <LoadingButton
      variant="contained"
      color="primary"
      isLoading={followMutation.isLoading}
      onClick={() => followMutation.mutate()}
      {...props}
    >
      {t('actions.connect')}
    </LoadingButton>
  );
}
