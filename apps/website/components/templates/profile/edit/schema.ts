import { object, string, SchemaOf } from 'yup';

import { Users } from '../../../../services/graphql/types.generated';

export type EditUserSchema = Pick<
  Users,
  'name' | 'username' | 'about' | 'email_address' | 'pfp'
>;

export const schema: SchemaOf<EditUserSchema> = object({
  name: string().min(2).defined(),
  username: string().min(2).defined(),
  about: string().min(2).defined(),
  email_address: string().min(2).email().defined(),
  pfp: string().min(2).defined(),
  // discord_id: string().min(2).defined(),
});

export const defaultValues = ({
  name,
  username,
  about,
  email_address,
  pfp,
}: //discord_id,
Partial<Users>): EditUserSchema => ({
  name,
  username,
  about,
  email_address,
  pfp,
  //discord_id,
});
