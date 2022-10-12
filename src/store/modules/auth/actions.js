let timer;

export default {
  async login(context, payload) {
    return context.dispatch('auth', { ...payload, mode: 'login' });
  },
  async signup(context, payload) {
    return context.dispatch('auth', { ...payload, mode: 'signup' });
  },
  async auth(context, payload) {
    const { mode } = payload;
    const webApiKey = 'AIzaSyBauC8pr3un4FdDvWcfV5sQgnGDpcEZkdo';
    const url =
      mode === 'signup'
        ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${webApiKey}`
        : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${webApiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ ...payload, returnSecureToken: true }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to authenticate');
      throw error;
    }

    // const expiresIn = 5000;
    const expiresIn = +responseData.expiresIn * 1000;
    const expirationDate = new Date().getTime() + expiresIn;

    localStorage.setItem('token', responseData.idToken);
    localStorage.setItem('userId', responseData.localId);
    localStorage.setItem('expirationDate', expirationDate);

    timer = setTimeout(function () {
      context.dispatch('autoLougout');
    }, expiresIn);

    context.commit('setUser', {
      token: responseData.idToken,
      userId: responseData.localId,
    });
  },
  logout(context) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');

    clearTimeout(timer);

    context.commit('setUser', {
      token: null,
      userId: null,
    });
  },
  autoLogin(context) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expirationDate = localStorage.getItem('expirationDate');

    const expiresIn = +expirationDate - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    timer = setTimeout(function () {
      context.dispatch('autoLougout');
    }, expiresIn);

    if (token && userId) {
      context.commit('setUser', {
        token,
        userId,
      });
    }
  },
  autoLougout(context) {
    context.dispatch('logout');
    context.commit('setAutoLogout');
  },
};
