export type Role = 'super_admin' | 'admin' | 'user';

export type TUserStatus = 'active' | 'delete' | 'block';

export const UserStatus: TUserStatus[] = ['active', 'block', 'delete'];

export type TGender =
  | 'male'
  | 'female'
  | 'transgender'
  | 'other'

export const Gender: TGender[] = [
  'male',
  'female',
  'transgender',
  'other'
];

export type IMaritalStatus =
  | 'single'
  | 'married'
  | 'divorced'
  | 'widowed'
  | 'engaged'
  | 'separated'
  | 'in a relationship'
  | 'domestic partnership'
  | 'complicated'
  | 'widower'
  | 'prefer not to say'
  | 'other';

export const MaritalStatus: IMaritalStatus[] = [
  'single',
  'married',
  'divorced',
  'widowed',
  'engaged',
  'separated',
  'in a relationship',
  'domestic partnership',
  'complicated',
  'widower',
  'prefer not to say',
  'other',
];
