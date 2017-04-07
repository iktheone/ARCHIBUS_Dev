var workRequestStepController = View.createController('workRequestStep', {

	afterInitialDataFetch:function(){
		checkFormFieldsForStep("odwStepForm","wr");
	},
	afterRefresh:function(){
		checkFormFieldsForStep("odwStepForm","wr");
	},
	odwStepForm_onApprove: function(){
		var record = ABHDC_getDataRecord2( this.odwStepForm); 	    
		var comments = this.odwStepForm.getFieldValue("wr_step_waiting.comments");
	    var wr_id = this.odwStepForm.getFieldValue("wr.wr_id");
		
		var result = {};
	    try {
			result = Workflow.callMethod('AbBldgOpsOnDemandWork-WorkRequestService-approveWorkRequest', record,comments);	
      	}catch (e) {
    		if (e.code=='ruleFailed'){
      		  View.showMessage(e.message);
      		}else{
    		  Workflow.handleError(e);
    		}
    		return;
		}
		if (result.code == 'executed') {
			View.getOpenerView().refresh();
	        View.closeThisDialog();			
	   	}else{
	       	Workflow.handleError(result);
	    }  
	},
	
	odwStepForm_onDispatch: function(){

		if(this.odwStepForm.getFieldValue("wr.supervisor") == "" 
			&& this.odwStepForm.getFieldValue("wr.work_team_id") == ""){
			this.odwStepForm.addInvalidField("wr.supervisor",getMessage("supervisorOrWorkteam"));
			this.odwStepForm.displayValidationResult();
			return;
		}
	
         
		var comments = this.odwStepForm.getFieldValue("wr_step_waiting.comments");
    	var record = ABHDC_getDataRecord2(this.odwStepForm);
		
		var result = {}; 
      	try {
			result = Workflow.callMethod('AbBldgOpsOnDemandWork-WorkRequestService-dispatchWorkRequest', record,comments);
      	}catch(e){
    		if (e.code=='ruleFailed'){
      		  View.showMessage(e.message);
      		}else{
    		  Workflow.handleError(e);
    		}
    		return;
		}
		if (result.code == 'executed') {
			View.getOpenerView().refresh();
	        View.closeThisDialog();			
	   	}else{
	       	Workflow.handleError(result);
	    }  
	},
	
	odwStepForm_onReject: function(){
		var stepType = this.odwStepForm.getFieldValue("wr_step_waiting.step_type");
		var record = ABHDC_getDataRecord2(this.odwStepForm);	    
		var comments = this.odwStepForm.getFieldValue("wr_step_waiting.comments");
	    
	    var result = {};
	    try {
	    	if(stepType == 'approval'){
	    		result = Workflow.callMethod('AbBldgOpsOnDemandWork-WorkRequestService-rejectWorkRequest', record,comments);
	    	}else if(stepType == 'dispatch'){
	    		result = Workflow.callMethod('AbBldgOpsOnDemandWork-WorkRequestService-rejectDispatchWorkRequest', record,comments);
	    	}
				
      	}catch (e) {
      		if (e.code=='ruleFailed'){
      		  View.showMessage(e.message);
      		}else{
    		  Workflow.handleError(e);
    		}
    		return;
		} 
		if (result.code == 'executed') {
			var tabPanel = View.getOpenerView().getView('parent').panels.get('tabs');
			tabPanel.selectTab('search')
	        View.closeThisDialog();			
	    } else {
	       	Workflow.handleError(result);
	    } 
	},
	odwStepForm_onForward: function(){
		this.odwStepForm.clearValidationResult();

		if(this.odwStepForm.getFieldValue("wr.completed_by") == ""){
			this.odwStepForm.addInvalidField("wr.completed_by",getMessage("forwardToMissing"));
			this.odwStepForm.displayValidationResult();
			return;
		}
		
		// we use the completed_by as temporary field
		var forwardTo = this.odwStepForm.getFieldValue("wr.completed_by");
		this.odwStepForm.setFieldValue("wr.completed_by","")
		
		var comments = this.odwStepForm.getFieldValue("wr_step_waiting.comments");
    	var id = this.odwStepForm.getFieldValue("wr.wr_id");
    	var stepLogId = this.odwStepForm.getFieldValue("wr_step_waiting.step_log_id");
    		
    	var result = {};	
      	try {
			result = Workflow.callMethod('AbBldgOpsHelpDesk-StepService-forwardStep', 'AbBldgOpsOnDemandWork',id,stepLogId,comments,forwardTo);	
      	}catch(e){
    		if (e.code=='ruleFailed'){
      		  View.showMessage(e.message);
      		}else{
    		  Workflow.handleError(e);
    		}
    		return;
		}
		if (result.code == 'executed') {
			View.getOpenerView().refresh();
	        View.closeThisDialog();			
	   	}else{
	       	 Workflow.handleError(result);
	    }
	},
	odwStepForm_onConfirm: function(){
		var stepType = this.odwStepForm.getFieldValue("wr_step_waiting.step_type");
		var record = ABHDC_getDataRecord2(this.odwStepForm);
		
		var result = {};
		try {
			if(stepType == 'survey'){
				record['activity_log.activity_log_id'] = record['wr.activity_log_id'];
				record['activity_log.satisfaction'] = record['wr.satisfaction'];
				record['activity_log.satisfaction_notes'] = record['wr.satisfaction_notes'];
				
	    		result = Workflow.callMethod('AbBldgOpsOnDemandWork-WorkRequestService-saveSatisfaction', record);
	    	}else if(stepType == 'verification'){
	    		result = Workflow.callMethod('AbBldgOpsOnDemandWork-WorkRequestService-verifyWorkRequest', record);
	    	}
			
      	}catch(e) {
    		if (e.code=='ruleFailed'){
      		  View.showMessage(e.message);
      		}else{
    		  Workflow.handleError(e);
    		}
    		return;
		}
		if (result.code == 'executed') {
			View.getOpenerView().refresh();
	        View.closeThisDialog();			
	   	}else{
	       	 Workflow.handleError(result);
	    }
	},
	odwStepForm_onReturn: function(){
		var record = ABHDC_getDataRecord2(this.odwStepForm);
		
		var result = {};
		try {
			result = Workflow.callMethod('AbBldgOpsOnDemandWork-WorkRequestService-returnWorkRequest', record);	
      	}catch(e){
    		if (e.code=='ruleFailed'){
      		  View.showMessage(e.message);
      		}else{
    		  Workflow.handleError(e);
    		}
    		return;
		}
		if (result.code == 'executed') {
			View.getOpenerView().refresh();
	        View.closeThisDialog();			
	   	}else{
	       	 Workflow.handleError(result);
	    }
	}
});

function onSelectForwardTo(){
	var form = View.panels.get("odwStepForm");
	var stepType = form.getFieldValue("wr_step_waiting.step_type");
	if(stepType == 'estimation'){
		Ab.view.View.selectValue(
        	'odwStepForm', 'Forward to', ['wr.completed_by'], 'em', ['em.em_id'], 
        	['em.em_id','em.em_std','em.email'], 
        	"email = '${user.email}' OR email IN (SELECT email FROM cf WHERE is_estimator = 1)",'', true, false);
	} else if(stepType == 'scheduling'){
		Ab.view.View.selectValue(
        	'odwStepForm', 'Forward to', ['wr.completed_by'], 'em', ['em.em_id'], 
        	['em.em_id','em.em_std','em.email'], 
        	"email = '${user.email}' OR email IN (SELECT email FROM cf WHERE is_planner = 1)",'', true);
	} else if(stepType == 'approval'||stepType == 'review'){
		Ab.view.View.selectValue(
        	'odwStepForm', 'Forward to', ['wr.completed_by'], 'em', ['em.em_id'], 
        	['em.em_id','em.em_std','em.email'], 
        	" em.email != '${user.email}' " +
        	"AND ((EXISTS (SELECT 1 FROM afm_userprocs,afm_users WHERE afm_userprocs.activity_id = 'AbBldgOpsHelpDesk' AND afm_userprocs.process_id='Business Manager' AND afm_users.email = em.email AND afm_users.user_name = afm_userprocs.user_name))  " +
        	" OR (EXISTS (SELECT 1 FROM afm_roleprocs LEFT OUTER JOIN afm_users ON (afm_roleprocs.role_name = afm_users.role_name) WHERE afm_users.email = em.email AND activity_id = 'AbBldgOpsHelpDesk' AND process_id = 'Business Manager'))) " ,
			'', true, false);
	}
}


function onChangeSupervisor(fieldName,selectedValue,previousValue){
	var form = View.panels.get("odwStepForm");
	if(valueExists(fieldName) && valueExists(selectedValue)){
		form.setFieldValue(fieldName,selectedValue);
	}
	if(form.getFieldValue("wr.supervisor") != ""){
		form.setFieldValue("wr.work_team_id","");
	}
}

function onChangeWorkTeamId(fieldName, selectedValue, previousValue){
	var form = View.panels.get("odwStepForm");
	if(valueExists(fieldName) && valueExists(selectedValue)){
		form.setFieldValue(fieldName,selectedValue)	
	}
	if(form.getFieldValue('wr.work_team_id') != ''){
		form.setFieldValue('wr.supervisor','');	
	}
}