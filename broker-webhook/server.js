const app = require("express")();
const cors = require("cors");
const routes = require("./routes");

const port = 9090;

app.use(cors());
app.use(routes);

app.listen(port, () =>
  console.log(
    `## CI Simulator ## Broker webhook is listening on port ${port}...`
  )
);
