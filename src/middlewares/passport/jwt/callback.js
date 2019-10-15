module.exports = async (jwtPayload, cb) => {
  try {
    cb(null, jwtPayload);

  } catch (err) {
    cb(err);
  }
};
