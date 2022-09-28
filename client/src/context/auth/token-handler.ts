const tokenHandlerFactory = () => {
  let token: string | undefined = undefined;

  const getToken = () => token;

  const setToken = (value: string) => {
    token = value;
  };

  const deleteToken = () => {
    token = undefined;
  };

  return { getToken, setToken, deleteToken };
};

export const tokenHandler = tokenHandlerFactory();
