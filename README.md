# Pact JS workshop

## Introduction

This workshop is aimed at demonstrating core features and benefits of contract testing with Pact.

Whilst contract testing can be applied retrospectively to systems, we will follow the [consumer driven contracts](https://martinfowler.com/articles/consumerDrivenContracts.html) approach in this workshop - where a new consumer and provider are created in parallel to evolve a service over time, especially where there is some uncertainty with what is to be built.

This workshop should take from 1 to 2 hours, depending on how deep you want to go into each topic.

**Workshop outline**:

- [step 1: **create consumer**](https://github.com/bookmd/pact-workshop-js/tree/step1#step-1---simple-consumer-calling-provider): Create our consumer before the Provider API even exists
- [step 2: **unit test**](https://github.com/bookmd/pact-workshop-js/tree/step2#step-2---client-tested-but-integration-fails): Write a unit test for our consumer
- [step 3: **pact test**](https://github.com/bookmd/pact-workshop-js/tree/step3#step-3---pact-to-the-rescue): Write a Pact test for our consumer
- [step 4: **pact verification**](https://github.com/bookmd/pact-workshop-js/tree/step4#step-4---verify-the-provider): Verify the consumer pact with the Provider API
- [step 5: **fix consumer**](https://github.com/bookmd/pact-workshop-js/tree/step5#step-5---back-to-the-client-we-go): Fix the consumer's bad assumptions about the Provider
- [step 6: **pact test**](https://github.com/bookmd/pact-workshop-js/tree/step6#step-6---consumer-updates-contract-for-missing-products): Write a pact test for `404` (missing User) in consumer
- [step 7: **provider states**](https://github.com/bookmd/pact-workshop-js/tree/step7#step-7---adding-the-missing-states): Update API to handle `404` case
- [step 8: **pact test**](https://github.com/bookmd/pact-workshop-js/tree/step8#step-8---authorization): Write a pact test for the `401` case
- [step 9: **pact test**](https://github.com/bookmd/pact-workshop-js/tree/step9#step-9---implement-authorisation-on-the-provider): Update API to handle `401` case
- [step 10: **request filters**](https://github.com/bookmd/pact-workshop-js/tree/step10#step-10---request-filters-on-the-provider): Fix the provider to support the `401` case
- [step 11: **pact broker**](https://github.com/bookmd/pact-workshop-js/tree/step11#step-11---using-a-pact-broker): Implement a broker workflow for integration with CI/CD
- [step 12: **simulate CI**](https://github.com/bookmd/pact-workshop-js/tree/step12#step-12---simulate-ci): Run a simulation of a CI pipeline to understand how pact interacts with CI

_NOTE: Each step is tied to, and must be run within, a git branch, allowing you to progress through each stage incrementally. For example, to move to step 2 run the following: `git checkout step2`_

## Learning objectives

If running this as a team workshop format, you may want to take a look through the [learning objectives](./LEARNING.md).

## Requirements

[Docker](https://www.docker.com)

[Docker Compose](https://docs.docker.com/compose/install/)

[Node + NPM](https://nodejs.org/en/)

## Scenario

There are two components in scope for our workshop.

1. Product Catalog website. It provides an interface to query the Product service for product information.
1. Product Service (Provider). Provides useful things about products, such as listing all products and getting the details of an individual product.

## Step 12 - Simulate CI

For the sake of this workshop, we won't integrate with a real CI provider and instead
we will run a simulation of a CI pipeline to understand how pact interacts with CI.

### Pact & CI flow

This is the CI flow we wan't to achieve with pact:

![](https://docs.pact.io/assets/images/platinum-1ccc02e1539bd69994553cb5769501e6.png)

In words -
once a Consumer publishes a pact, the CI should trigger a test in the Provider to verify the consumer pact.

This is being done with the brokers webhooks capability.

Until the provider is verified, the Consumer will keep checking if it can deploy, once the verification is finished - the Consumer will know if its contract is fulfilled, and can pass the CI.

### Preparing the broker for CI

We've mentioned that the way the CI triggers the provider verification is through the brokers webhooks capability.
So we need to prepare the broker for this.

We've prepared a script that does that for us.

```
> cd broker-webhook
> ./create_webhook.sh
```

The result of the script should look like

```
{"uuid":"14wT3xUyo0liBRy7ZqQsFw","description":"POST host.docker.internal","enabled":true,"request":{"method":"POST","url":"http://host.docker.internal:9090","headers":{"Content-Type":"application/json"},"body":{"state":"${pactbroker.githubVerificationStatus}","description":"Pact Verification Tests ${pactbroker.providerVersionTags}","context":"${pactbroker.providerName}","target_url":"${pactbroker.verificationResultUrl}"}},"events":[{"name":"contract_content_changed"}],"createdAt":"2022-08-01T14:02:41+00:00","_links":{"self":{"title":"POST host.docker.internal","href":"http://localhost:8000/webhooks/14wT3xUyo0liBRy7ZqQsFw"},"pb:execute":{"title":"Test the execution of the webhook with the latest matching pact or verification by sending a POST request to this URL","href":"http://localhost:8000/webhooks/14wT3xUyo0liBRy7ZqQsFw/execute"},"pb:webhooks":{"title":"All webhooks","href":"http://localhost:8000/webhooks"}}}
```

go to this link (replace "14wT3xUyo0liBRy7ZqQsFw" in the end with the uuid of the webhook you created):

http://localhost:8000/hal-browser/browser.html#http://localhost:8000/webhooks/14wT3xUyo0liBRy7ZqQsFw

And you will see that we have created a webhook that will call "http://host.docker.internal:9090" on every contract that was changed,
given it in the body information like state, provider name, etc.

So now we only need to have the server at "http://host.docker.internal:9090" to be running, and we can trigger the webhook!.

### Running the Verifier Server

Regular CI's have built-in support for triggering pipelines from webhooks, because we're simulating a CI, we need to run a webhook listener server by ourselves.

To do that run

```
> cd broker-webhook
> npm install
> npm run start
```

You can look at the server code in the folder, it basically triggers the `npm test:pact` command in the provider directory.

### Publishing a contract -> To trigger the simulated CI flow

The broker triggers the webhook only on new contracts, so we have two options:

- update one of our existing contracts
- delete the existing contract and republish it

For the sake of saving time we're going to delete the existing contract <b>This shouldn't be done in the real world </b>

To do that we will go to our broker homepage http://localhost:8000/ and click on the "..." and then "Delete integration" button next to the contract we want to delete.

now make sure the verifier server is running ("broker-webhook") and now we can re-publish the contract.

```
> cd consumer
> npm run pact:publish
```

meanwhile we can run the `can-i-deploy` step, and we will see that at first we can't deploy, because the contract has not been verified yet!.

```
> cd consumer
> pact-broker can-i-deploy \
               --pacticipant FrontendWebsite \
               --broker-base-url http://localhost:8000 \
               --broker-username pact_workshop \
               --broker-password pact_workshop \
               --latest
```

If we'll look in the verifier server logs we'll eventually see

```
Got webhook {"state":"pending","description":"Pact Verification Tests ","context":"ProductService","target_url":""}
 Triggering provider tests...

 ... provider tests ...

 provider-verification: tests passed
```

now run the `can-i-deploy` step again, and we should see that we can deploy! 🌈.
