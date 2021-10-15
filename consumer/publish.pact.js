const pact = require('@pact-foundation/pact-node');

if (!process.env.CI) {
    console.log("skipping Pact publish...");
    process.exit(0)
}

const pactBrokerUrl = process.env.PACT_BROKER_BASE_URL || 'http://localhost:8000';
const pactBrokerUsername = process.env.PACT_BROKER_USERNAME || 'pact_workshop';
const pactBrokerPassword = process.env.PACT_BROKER_PASSWORD || 'pact_workshop';

const gitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString().trim();

const opts = {
    pactFilesOrDirs: ['./pacts/'],
    pactBroker: pactBrokerUrl,
    pactBrokerUsername: pactBrokerUsername,
    pactBrokerPassword: pactBrokerPassword,
    tags: ['prod', 'test'],
    consumerVersion: gitHash
};

pact
    .publishPacts(opts)
    .then(() => {
        console.log('Pact contract publishing complete!');
        console.log('');
        console.log(`Head over to ${pactBrokerUrl} and login with`);
        console.log(`=> Username: ${pactBrokerUsername}`);
        console.log(`=> Password: ${pactBrokerPassword}`);
        console.log('to see your published contracts.')
    })
    .catch(e => {
        console.log('Pact contract publishing failed: ', e)
    });