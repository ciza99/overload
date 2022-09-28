import { appFactory } from "components/app/app-factory";
import { createAppConfig } from "config/config";

const config = createAppConfig();
const app = appFactory({ config });

app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
