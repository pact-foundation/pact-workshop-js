
define STEP
	echo "step $$STEP_NO"
	cd $$STEP_NO
	npm install
	npm run $$JOB --prefix $$APPLICATION
endef
export STEP

.PHONY: step1 step2 step3 step4 step5 step6 step7 step8 step9 step10 step11 step12
step1_run_consumer:
	STEP_NO=step1 APPLICATION=consumer JOB=start bash -c "$$STEP"

step2_test_consumer:
	STEP_NO=step2 APPLICATION=consumer JOB=test bash -c "$$STEP"
step2_run_consumer:
	STEP_NO=step2 APPLICATION=consumer JOB=start bash -c "$$STEP"
step2_run_provider:
	STEP_NO=step2 APPLICATION=provider JOB=start bash -c "$$STEP"

step3_test_consumer:
	STEP_NO=step3 APPLICATION=consumer JOB=test bash -c "$$STEP"
step3_test_unit_consumer:
	STEP_NO=step3 APPLICATION=consumer JOB=test:unit bash -c "$$STEP"
step3_test_pact_consumer:
	STEP_NO=step3 APPLICATION=consumer JOB=test:pact bash -c "$$STEP"
# step3_test_provider:
# 	STEP_NO=step3 APPLICATION=provider JOB=test bash -c "$$STEP"
step3_run_consumer:
	STEP_NO=step3 APPLICATION=consumer JOB=start bash -c "$$STEP"
step3_run_provider:
	STEP_NO=step3 APPLICATION=provider JOB=start bash -c "$$STEP"

step3:
	STEP_NO=step3 bash -c "$$STEP"
step4:
	STEP_NO=step4 bash -c "$$STEP"
step5:
	STEP_NO=step5 bash -c "$$STEP"
step6:
	STEP_NO=step6 bash -c "$$STEP"
step7:
	STEP_NO=step7 bash -c "$$STEP"
step8:
	STEP_NO=step8 bash -c "$$STEP"
step9:
	STEP_NO=step9 bash -c "$$STEP"
step10:
	STEP_NO=step10 bash -c "$$STEP"
step11:
	STEP_NO=step11 bash -c "$$STEP"
step12:
	STEP_NO=step12 bash -c "$$STEP"