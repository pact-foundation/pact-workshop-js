const router = require("express").Router();
const { exec } = require("child_process");

router.all("/", (req, res, next) => {
  console.log(
    `Got webhook ${JSON.stringify(req.body)} \n Triggering provider tests...`
  );

  const testPact = exec(`cd ../provider && CI=true npm run test:pact`, {
    cwd: __dirname,
  });

  testPact.stdout.on("data", (data) => {
    console.log(`provider-verification: ${data.toString()}`);
  });
  testPact.stderr.on("data", (data) => {
    console.log(`provider-verification [error]: ${data.toString()}`);
  });

  testPact.on("exit", (code) => {
    if (code !== 0) {
      console.log("provider-verification: tests failed");
      res.status(500).send();
    } else {
      console.log("provider-verification: tests passed");
      res.status(200).send();
    }
  });
});

module.exports = router;
