export default {
  registerCoach(context, data) {
    context.commit('registerCoach', {
      ...data,
      id: context.rootGetters.userId,
    });
  },
};
