import { Box, Button } from "components/index";
import { useAuth } from "context/auth/auth-context";

export const Home = () => {
  const { logout } = useAuth();

  return (
    <Box>
      <Button onPress={logout}>Log out</Button>
    </Box>
  );
};
