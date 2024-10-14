#!/bin/bash
set -e

json_payload='{
    "events": [
      {
        "name": "contract_content_changed"
      }
    ],
    "request": {
      "method": "POST",
      "url": "'http://"${PACT_BROKER_WEBHOOK_HOST_WHITELIST:-host.docker.internal}":9090'",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "state": "${pactbroker.githubVerificationStatus}",
        "description": "Pact Verification Tests ${pactbroker.providerVersionTags}",
        "context": "${pactbroker.providerName}",
        "target_url": "${pactbroker.verificationResultUrl}"
      }
    }
  }'

echo $json_payload
curl http://localhost:8000/webhooks/204430af-f8c8-4feb-8135-f027df8ecf34 \
    -X PUT --user pact_workshop:pact_workshop \
    -H "Content-Type: application/json" -d "${json_payload}" -v