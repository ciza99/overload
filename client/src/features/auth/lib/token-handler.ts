const tokenHandlerFactory = () => {
  let token: string | undefined;

  return {
    getToken: () => token,
    setToken: (value: string) => {
      token = value;
    },
    deleteToken: () => {
      token = undefined;
    },
  };
};

export const tokenHandler = tokenHandlerFactory();
