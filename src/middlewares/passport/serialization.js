const { Auth } = require('$models');

module.exports = {

  serializeAuth: (auth, done) => {
    done(null, auth.id);
  },

  deserializeAuth: async (id, done) => {
    try {
      const authUser = await Auth.findById(id).select('email user_id').exec();
      done(null, authUser);

    } catch (error) {
      done(error, null);
    }
  }
};
