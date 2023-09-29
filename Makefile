
define STEP
	echo "step $$STEP_NO"
	cd $$STEP_NO
	npm run $$JOB --prefix $$APPLICATION
endef
export STEP
define CAN_I_DEPLOY
	echo "step $$STEP_NO"
	cd $$STEP_NO/$$APPLICATION
	npx pact-broker can-i-deploy \
				--pacticipant $$PACTICIPANT \
				--broker-base-url http://localhost:8000 \
				--broker-username pact_workshop \
				--broker-password pact_workshop \
				--latest
endef
export CAN_I_DEPLOY

all: 
	make step2_test_unit_consumer 
	make step3_test_unit_consumer 
	make step3_test_pact_consumer
	make step4_tests

.PHONY: step1 step2 step3 step4 step5 step6 step7 step8 step9 step10 step11 step12 step13
step1_run_consumer:
	STEP_NO=step1 APPLICATION=consumer JOB=start bash -c "$$STEP"

step2_test_consumer:
	STEP_NO=step2 APPLICATION=consumer JOB=test bash -c "$$STEP"
step2_test_unit_consumer:
	STEP_NO=step2 APPLICATION=consumer JOB=test:unit bash -c "$$STEP"
step2_run_consumer:
	STEP_NO=step2 APPLICATION=consumer JOB=start bash -c "$$STEP"
step2_run_provider:
	STEP_NO=step2 APPLICATION=provider JOB=start bash -c "$$STEP"

step3_tests: step3_test_unit_consumer step3_test_pact_consumer

step3_test_consumer:
	STEP_NO=step3 APPLICATION=consumer JOB=test bash -c "$$STEP"
step3_test_unit_consumer:
	STEP_NO=step3 APPLICATION=consumer JOB=test:unit bash -c "$$STEP"
step3_test_pact_consumer:
	STEP_NO=step3 APPLICATION=consumer JOB=test:pact bash -c "$$STEP"
step3_run_consumer:
	STEP_NO=step3 APPLICATION=consumer JOB=start bash -c "$$STEP"
step3_run_provider:
	STEP_NO=step3 APPLICATION=provider JOB=start bash -c "$$STEP"


step4_tests: step4_test_unit_consumer step4_test_pact_consumer step4_test_pact_provider

step4_test_consumer:
	STEP_NO=step4 APPLICATION=consumer JOB=test bash -c "$$STEP"
step4_test_unit_consumer:
	STEP_NO=step4 APPLICATION=consumer JOB=test:unit bash -c "$$STEP"
step4_test_pact_consumer:
	STEP_NO=step4 APPLICATION=consumer JOB=test:pact bash -c "$$STEP"
step4_test_pact_provider:
	STEP_NO=step4 APPLICATION=provider JOB=test:pact bash -c "$$STEP"
step4_run_consumer:
	STEP_NO=step4 APPLICATION=consumer JOB=start bash -c "$$STEP"
step4_run_provider:
	STEP_NO=step4 APPLICATION=provider JOB=start bash -c "$$STEP"

step5_tests: step5_test_unit_consumer step5_test_pact_consumer step5_test_pact_provider

step5_test_consumer:
	STEP_NO=step5 APPLICATION=consumer JOB=test bash -c "$$STEP"
step5_test_unit_consumer:
	STEP_NO=step5 APPLICATION=consumer JOB=test:unit bash -c "$$STEP"
step5_test_pact_consumer:
	STEP_NO=step5 APPLICATION=consumer JOB=test:pact bash -c "$$STEP"
step5_test_pact_provider:
	STEP_NO=step5 APPLICATION=provider JOB=test:pact bash -c "$$STEP"
step5_run_consumer:
	STEP_NO=step5 APPLICATION=consumer JOB=start bash -c "$$STEP"
step5_run_provider:
	STEP_NO=step5 APPLICATION=provider JOB=start bash -c "$$STEP"

step6_tests: step6_test_unit_consumer step6_test_pact_consumer step6_test_pact_provider

step6_test_consumer:
	STEP_NO=step6 APPLICATION=consumer JOB=test bash -c "$$STEP"
step6_test_unit_consumer:
	STEP_NO=step6 APPLICATION=consumer JOB=test:unit bash -c "$$STEP"
step6_test_pact_consumer:
	STEP_NO=step6 APPLICATION=consumer JOB=test:pact bash -c "$$STEP"
step6_test_pact_provider:
	STEP_NO=step6 APPLICATION=provider JOB=test:pact bash -c "$$STEP"
step6_run_consumer:
	STEP_NO=step6 APPLICATION=consumer JOB=start bash -c "$$STEP"
step6_run_provider:
	STEP_NO=step6 APPLICATION=provider JOB=start bash -c "$$STEP"

step7_tests: step7_test_unit_consumer step7_test_pact_consumer step7_test_pact_provider

step7_test_consumer:
	STEP_NO=step7 APPLICATION=consumer JOB=test bash -c "$$STEP"
step7_test_unit_consumer:
	STEP_NO=step7 APPLICATION=consumer JOB=test:unit bash -c "$$STEP"
step7_test_pact_consumer:
	STEP_NO=step7 APPLICATION=consumer JOB=test:pact bash -c "$$STEP"
step7_test_pact_provider:
	STEP_NO=step7 APPLICATION=provider JOB=test:pact bash -c "$$STEP"
step7_run_consumer:
	STEP_NO=step7 APPLICATION=consumer JOB=start bash -c "$$STEP"
step7_run_provider:
	STEP_NO=step7 APPLICATION=provider JOB=start bash -c "$$STEP"

step8_tests: step8_test_unit_consumer step8_test_pact_consumer step8_test_pact_provider

step8_test_consumer:
	STEP_NO=step8 APPLICATION=consumer JOB=test bash -c "$$STEP"
step8_test_unit_consumer:
	STEP_NO=step8 APPLICATION=consumer JOB=test:unit bash -c "$$STEP"
step8_test_pact_consumer:
	STEP_NO=step8 APPLICATION=consumer JOB=test:pact bash -c "$$STEP"
step8_test_pact_provider:
	STEP_NO=step8 APPLICATION=provider JOB=test:pact bash -c "$$STEP"
step8_run_consumer:
	STEP_NO=step8 APPLICATION=consumer JOB=start bash -c "$$STEP"
step8_run_provider:
	STEP_NO=step8 APPLICATION=provider JOB=start bash -c "$$STEP"

step9_tests: step9_test_unit_consumer step9_test_pact_consumer step9_test_pact_provider

step9_test_consumer:
	STEP_NO=step9 APPLICATION=consumer JOB=test bash -c "$$STEP"
step9_test_unit_consumer:
	STEP_NO=step9 APPLICATION=consumer JOB=test:unit bash -c "$$STEP"
step9_test_pact_consumer:
	STEP_NO=step9 APPLICATION=consumer JOB=test:pact bash -c "$$STEP"
step9_test_pact_provider:
	STEP_NO=step9 APPLICATION=provider JOB=test:pact bash -c "$$STEP"
step9_run_consumer:
	STEP_NO=step9 APPLICATION=consumer JOB=start bash -c "$$STEP"
step9_run_provider:
	STEP_NO=step9 APPLICATION=provider JOB=start bash -c "$$STEP"

step10_tests: step10_test_unit_consumer step10_test_pact_consumer step10_test_pact_provider

step10_test_consumer:
	STEP_NO=step10 APPLICATION=consumer JOB=test bash -c "$$STEP"
step10_test_unit_consumer:
	STEP_NO=step10 APPLICATION=consumer JOB=test:unit bash -c "$$STEP"
step10_test_pact_consumer:
	STEP_NO=step10 APPLICATION=consumer JOB=test:pact bash -c "$$STEP"
step10_test_pact_provider:
	STEP_NO=step10 APPLICATION=provider JOB=test:pact bash -c "$$STEP"
step10_run_consumer:
	STEP_NO=step10 APPLICATION=consumer JOB=start bash -c "$$STEP"
step10_run_provider:
	STEP_NO=step10 APPLICATION=provider JOB=start bash -c "$$STEP"

step11_tests: step11_test_unit_consumer step11_test_pact_consumer step11_test_pact_publish step11_test_pact_provider step11_can_i_deploy_provider step11_can_i_deploy_consumer

step11_test_consumer:
	STEP_NO=step11 APPLICATION=consumer JOB=test bash -c "$$STEP"
step11_test_unit_consumer:
	STEP_NO=step11 APPLICATION=consumer JOB=test:unit bash -c "$$STEP"
step11_test_pact_consumer:
	STEP_NO=step11 APPLICATION=consumer JOB=test:pact bash -c "$$STEP"
step11_test_pact_publish:
	STEP_NO=step11 APPLICATION=consumer JOB=pact:publish bash -c "$$STEP"
step11_test_pact_provider:
	PACT_BROKER_PUBLISH_VERIFICATION_RESULTS=true STEP_NO=step11 APPLICATION=provider JOB=test:pact bash -c "$$STEP"
step11_run_consumer:
	STEP_NO=step11 APPLICATION=consumer JOB=start bash -c "$$STEP"
step11_run_provider:
	STEP_NO=step11 APPLICATION=provider JOB=start bash -c "$$STEP"
step11_can_i_deploy_consumer:
	STEP_NO=step11 APPLICATION=consumer PACTICIPANT=FrontendWebsite bash -c "$$CAN_I_DEPLOY"
step11_can_i_deploy_provider:
	STEP_NO=step11 APPLICATION=provider PACTICIPANT=FrontendWebsite bash -c "$$CAN_I_DEPLOY"

## Fake Webhooks

step12_tests: step12_test_unit_consumer step12_test_pact_consumer step12_test_pact_publish step12_test_pact_provider

step12_webhooks: step12_create_webhook step12_test_pact_consumer step12_test_pact_publish

step12_start_broker_webhook_service:
	STEP_NO=step12 APPLICATION=broker-webhook JOB=start bash -c "$$STEP"
step12_create_webhook:
	cd step12/broker-webhook && ./create_webhook.sh
step12_test_consumer:
	STEP_NO=step12 APPLICATION=consumer JOB=test bash -c "$$STEP"
step12_test_unit_consumer:
	STEP_NO=step12 APPLICATION=consumer JOB=test:unit bash -c "$$STEP"
step12_test_pact_consumer:
	STEP_NO=step12 APPLICATION=consumer JOB=test:pact bash -c "$$STEP"
step12_test_pact_publish:
	STEP_NO=step12 APPLICATION=consumer JOB=pact:publish bash -c "$$STEP"
step12_test_pact_provider:
	STEP_NO=step12 APPLICATION=provider JOB=test:pact bash -c "$$STEP"
step12_run_consumer:
	STEP_NO=step12 APPLICATION=consumer JOB=start bash -c "$$STEP"
step12_run_provider:
	STEP_NO=step12 APPLICATION=provider JOB=start bash -c "$$STEP"

## PactFlow Tokens
step13_tests: step13_test_unit_consumer step13_test_pact_consumer step13_test_pact_publish step13_test_pact_provider

step13_test_consumer:
	STEP_NO=step13 APPLICATION=consumer JOB=test bash -c "$$STEP"
step13_test_unit_consumer:
	STEP_NO=step13 APPLICATION=consumer JOB=test:unit bash -c "$$STEP"
step13_test_pact_consumer:
	STEP_NO=step13 APPLICATION=consumer JOB=test:pact bash -c "$$STEP"
step13_test_pact_publish:
	STEP_NO=step13 APPLICATION=consumer JOB=pact:publish bash -c "$$STEP"
step13_test_pact_provider:
	STEP_NO=step13 APPLICATION=provider JOB=test:pact bash -c "$$STEP"
step13_run_consumer:
	STEP_NO=step13 APPLICATION=consumer JOB=start bash -c "$$STEP"
step13_run_provider:
	STEP_NO=step13 APPLICATION=provider JOB=start bash -c "$$STEP"

broker:
	docker compose up -d
	sleep 10
	curl http://localhost:8000/diagnostic/status/heartbeat