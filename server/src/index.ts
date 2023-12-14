import { appFactory } from "features/core/lib/app-factory";
import { createAppConfig } from "features/core/lib/config-factory";

const config = createAppConfig();
const app = appFactory({ config });

app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
