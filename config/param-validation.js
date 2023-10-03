import { Joi } from 'express-validation';

export default {
  // POST /api/users
  createUser: {
    body: Joi.object({
      username: Joi.string().required(),
    }),
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: Joi.object({
      id: Joi.number().integer(),
      username: Joi.string().required(),
      updatedAt: Joi.string(),
      createdAt: Joi.string(),
    }),
    params: Joi.object({
      userId: Joi.string().hex().required(),
    }),
  },

  // POST /api/auth/login
  login: {
    body: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  // createAssetDetails:{
  //   body: Joi.object({
  //     user_id: Joi.string().uuid().required(),
  //     user_name: Joi.string().required(),
  //     name: Joi.string().required(),
  //     url: Joi.string().required(),
  //     status: Joi.string().required(),
  //     category: Joi.string().required(),
  //     metadata: Joi.object({
  //       access: Joi.string().required(),
  //       description: Joi.string().required(),
  //     })
  //   })
  // },

  createAssetDetails: {
    body: Joi.object({
      user_id: Joi.string().uuid().required(),
      user_name: Joi.string().required(),
      assets: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().required(),
            url: Joi.string().required(),
            status: Joi.string(),
            category: Joi.string().required(),
            metaData: Joi.object({
              Access: Joi.string().required(),
              Channel: Joi.string().required(),
              Date: Joi.string().required(),
              Group: Joi.string().required(),
            }),
          })
        )
        .required(),
    }),
  },
  
  updateAssetDetails: {
    body: Joi.object({
      user_id: Joi.string().uuid(),
      user_name: Joi.string(),
      name: Joi.string(),
      url: Joi.string(),
      status: Joi.string(),
      category: Joi.string(),
      metadata: Joi.object({
        access: Joi.string(),
        description: Joi.string(),
      })
    }),
    params: Joi.object({
      id: Joi.string().guid().required(),
    }),
  },
};
