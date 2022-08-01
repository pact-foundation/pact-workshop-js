const router = require('express').Router();
const exec = require('child_process').exec;

router.all("/", (req, res, next) => {
    console.log('Triggering provider tests...');

    exec(`cd ${__dirname}/../provider && PACT_BROKER_PUBLISH_VERIFICATION_RESULTS=true npm run test:pact`, (err) => {
        if (err) {
            console.error('Triggering test failed', err);
            res.status(500).send();
        } else {
            console.log('Tests ran successfully');
            res.status(200).send();
        }
    });
});

module.exports = router;