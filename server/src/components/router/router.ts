import { Router } from "express";

type RouterFactoryProps = {
  userRouter: Router;
  sessionRouter: Router;
};

export const routerFactory = ({
  userRouter,
  sessionRouter,
}: RouterFactoryProps) => {
  const router = Router();

  router.use("/users", userRouter);
  router.use("/session", sessionRouter);

  return router;
};
