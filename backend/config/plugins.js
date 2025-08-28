module.exports = {
  upload: {
    config: {
      sizeLimit: 10 * 1024 * 1024, // 10MB limit
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64
      },
      responsiveDimensions: true,
    },
  },
  'users-permissions': {
    config: {
      jwtSecret: process.env.JWT_SECRET,
    },
  },
};
