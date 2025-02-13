import { Model, Types } from 'mongoose';
import { Role } from '../../middlewares/roles';
import { IMaritalStatus, TGender, TUserStatus } from './user.constant';
import { PaginateOptions, PaginateResult } from '../../types/paginate';

export type TProfileImage = {
  imageUrl: string;
  file: Record<string, any>;
};

export type TPhotoGallery = {
  imageUrl: string;
  file: Record<string, any>;
};

export type TUser = {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  profileImage?: TProfileImage;
  photoGallery?: TPhotoGallery[];
  status: TUserStatus;
  location: {
    latitude: number;
    longitude: number;
  };
  gender: TGender;
  dateOfBirth: Date;
  age: number;
  continent: string;
  country: string;
  state: string;
  city: string;
  address: string;
  ethnicity: string;
  denomination: string;
  education: string;
  maritalStatus: IMaritalStatus;
  hobby: string;
  occupation: string;
  interests: string[];
  aboutMe: string;
  role: Role;
  isEmailVerified: boolean;
  isOnline: boolean;
  isDeleted: boolean;
  isBlocked: boolean;
  lastPasswordChange: Date;
  isResetPassword: boolean;
  failedLoginAttempts: number;
  lockUntil: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
};

export interface UserModal extends Model<TUser> {
  paginate: (
    filter: object,
    options: PaginateOptions
  ) => Promise<PaginateResult<TUser>>;
  isExistUserById(id: string): Promise<Partial<TUser> | null>;
  isExistUserByEmail(email: string): Promise<Partial<TUser> | null>;
  isMatchPassword(password: string, hashPassword: string): Promise<boolean>;
}
