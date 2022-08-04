import { useMutation } from 'react-query';

import { useAuth } from '../providers/auth';

function base64toBlob(base64: string) {
  if (typeof window === 'undefined') return new Blob();

  const dataURI = base64.split(',')[0];
  const byteString =
    dataURI[0].indexOf('base64') >= 0
      ? window.atob(dataURI[1])
      : decodeURI(dataURI[1]);
  const len = byteString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }
  return new Blob([bytes], { type: 'image/jpeg' });
}

type UploadMutationResult = {
  author_id: string;
  blur: string | null;
  id: string;
  metadata: { originalname: string };
  type: string;
};

export function useUploadImage() {
  const { fetchAuth } = useAuth();

  const uploadMutation = useMutation(async (file?: string | File) => {
    const formdata = new FormData();
    formdata.append('file', file instanceof File ? file : base64toBlob(file));

    return fetchAuth<UploadMutationResult>('storage/upload', {
      method: 'POST',
      body: formdata,
    });
  });

  return uploadMutation.mutateAsync;
}
