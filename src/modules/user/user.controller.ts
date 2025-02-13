import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import ApiError from '../../errors/ApiError';
import { UserService } from './user.service';
import { User } from './user.model';
import { Types } from 'mongoose';

const createAdminOrSuperAdmin = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await UserService.createAdminOrSuperAdmin(payload);
  sendResponse(res, {
    code: StatusCodes.CREATED,
    data: result,
    message: `${
      payload.role === 'admin' ? 'Admin' : 'Super Admin'
    } created successfully`,
  });
});

//get all users from database
const getAllUsers = catchAsync(async (req, res) => {
  const currentUserId = req.user.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  console.log(currentUserId)
  // Aggregation pipeline to fetch users with connection status
  const aggregationPipeline = [
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: 'connections',
        let: { targetUserId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  {
                    $and: [
                      { $eq: ['$senderId', currentUserId] },
                      { $eq: ['$receiverId', '$$targetUserId'] },
                    ],
                  },
                  {
                    $and: [
                      { $eq: ['$senderId', '$$targetUserId'] },
                      { $eq: ['$receiverId', currentUserId] },
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: 'connection',
      },
    },
    {
      $addFields: {
        connectionStatus: {
          $cond: {
            if: { $gt: [{ $size: '$connection' }, 0] },
            then: {
              $let: {
                vars: { conn: { $arrayElemAt: ['$connection', 0] } },
                in: {
                  $switch: {
                    branches: [
                      {
                        case: { $eq: ['$$conn.status', 'accepted'] },
                        then: 'connected',
                      },
                      {
                        case: { $eq: ['$$conn.status', 'pending'] },
                        then: 'pending',
                      },
                      {
                        case: { $eq: ['$$conn.status', 'rejected'] },
                        then: 'rejected',
                      },
                    ],
                    default: 'not-connected',
                  },
                },
              },
            },
            else: 'not-connected',
          },
        },
      },
    },
    {
      $project: {
        password: 0,
        isDeleted: 0,
        failedLoginAttempts: 0,
        lockUntil: 0,
      },
    },
    { $skip: skip },
    { $limit: limit },
  ];

  // Execute aggregation
  const users = await User.aggregate(aggregationPipeline).exec();

  // Get total count for pagination
  const total = await User.countDocuments({
    _id: { $ne: currentUserId },
    role: 'mentor',
    isDeleted: false,
  });

  res.json({
    data: users,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
});
// const getAllUsers = catchAsync(async (req, res) => {
//   const {userId} = req.user?.userId;
//   const filters = pick(req.query, ['userName', 'email', 'role']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
//   const result = await UserService.getFilteredUsersWithConnectionStatus(userId,filters, options);
//   sendResponse(res, {
//     code: StatusCodes.OK,
//     data: result,
//     message: 'Users fetched successfully',
//   });
// });

//get single user from database
const getSingleUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserService.getSingleUser(userId);
  sendResponse(res, {
    code: StatusCodes.OK,
    data: result,
    message: 'User fetched successfully',
  });
});

//update profile image
const updateProfileImage = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are unauthenticated.');
  }
  if (req.file) {
    req.body.profile_image = {
      imageUrl: '/uploads/users/' + req.file.filename,
      file: req.file,
    };
  }
  const result = await UserService.updateMyProfile(userId, req.body);
  sendResponse(res, {
    code: StatusCodes.OK,
    data: result,
    message: 'Profile image updated successfully',
  });
});

//update user from database
const updateMyProfile = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are unauthenticated.');
  }
  if (req.file) {
    req.body.profile_image = {
      imageUrl: '/uploads/users/' + req.file.filename,
      file: req.file,
    };
  }
  const result = await UserService.updateMyProfile(userId, req.body);
  sendResponse(res, {
    code: StatusCodes.OK,
    data: result,
    message: 'User updated successfully',
  });
});

//update user status from database
const updateUserStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const payload = req.body;
  const result = await UserService.updateUserStatus(userId, payload);
  sendResponse(res, {
    code: StatusCodes.OK,
    data: result,
    message: 'User status updated successfully',
  });
});

//update user
const updateUserProfile = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const payload = req.body;
  const result = await UserService.updateUserProfile(userId, payload);
  sendResponse(res, {
    code: StatusCodes.OK,
    data: result,
    message: 'User updated successfully',
  });
});

//get my profile
const getMyProfile = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are unauthenticated.');
  }
  const result = await UserService.getMyProfile(userId);
  sendResponse(res, {
    code: StatusCodes.OK,
    data: result,
    message: 'User fetched successfully',
  });
});
//delete user from database
const deleteMyProfile = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are unauthenticated.');
  }
  const result = await UserService.deleteMyProfile(userId);
  sendResponse(res, {
    code: StatusCodes.OK,
    data: result,
    message: 'User deleted successfully',
  });
});

export const UserController = {
  createAdminOrSuperAdmin,
  getAllUsers,
  getSingleUser,
  updateMyProfile,
  updateProfileImage,
  updateUserStatus,
  getMyProfile,
  updateUserProfile,
  deleteMyProfile,
};
