var projMngDashCpsChgController = View.createController('projMngDashCpsChg', {
	
	projMngDashCpsChgForm_afterRefresh: function() {
		var form = View.panels.get('projMngDashCpsChgForm');
		var status = form.getFieldValue('activity_log.status');
		var approved_by = form.getFieldValue('activity_log.approved_by');
		var apprv_mgr1 = form.getFieldValue('work_pkgs.apprv_mgr1');
		if (status != 'REQUESTED') {
			Ext.get('projMngDashCpsChgForm_apprv_select').dom.parentNode.parentNode.style.display = 'none';
			form.showField('activity_log.approved_by', true);
			form.enableField('activity_log.approved_by', false);
			form.setInstructions();
		}
		else {
			if (apprv_mgr1 == '') {
				Ext.get('projMngDashCpsChgForm_apprv_select').dom.parentNode.parentNode.style.display = 'none';
				form.showField('activity_log.approved_by', true);
				form.enableField('activity_log.approved_by', true);
				form.setInstructions(getMessage('enableApprv'));
			} else {
				Ext.get('projMngDashCpsChgForm_apprv_select').dom.parentNode.parentNode.style.display = '';
				form.showField('activity_log.approved_by', false);
				$('projMngDashCpsChgForm_apprv_select').options[1].innerHTML = apprv_mgr1;
				$('projMngDashCpsChgForm_apprv_select').value = '0';
				if (apprv_mgr1 && apprv_mgr1 == approved_by) $('projMngDashCpsChgForm_apprv_select').value = '1';	
				form.setInstructions(getMessage('enableApprv'));
			}	
		}
		this.disableApprvActions();
	},

	disableApprvActions: function() {
		var status = this.projMngDashCpsChgForm.getFieldValue('activity_log.status');
		var apprv_mgr1 = this.projMngDashCpsChgForm.getFieldValue('work_pkgs.apprv_mgr1');
		var approved_by = this.projMngDashCpsChgForm.getFieldValue('activity_log.approved_by');
		var value = $('projMngDashCpsChgForm_apprv_select').value;
		if ((status == 'REQUESTED' && apprv_mgr1 != '' && value != 0) 
				|| (status == 'REQUESTED' && apprv_mgr1 == '' && approved_by != '')) {
			this.projMngDashCpsChgForm.actions.get('save').show(true);
			this.projMngDashCpsChgForm.actions.get('approve').show(true);
			this.projMngDashCpsChgForm.actions.get('reject').show(true);
			this.projMngDashCpsChgForm.actions.get('saveDis').show(false);
			this.projMngDashCpsChgForm.actions.get('approveDis').show(false);
			this.projMngDashCpsChgForm.actions.get('rejectDis').show(false);
		} else if (status == 'REQUESTED') {
			this.projMngDashCpsChgForm.actions.get('save').show(true);
			this.projMngDashCpsChgForm.actions.get('approve').show(false);
			this.projMngDashCpsChgForm.actions.get('reject').show(false);
			this.projMngDashCpsChgForm.actions.get('saveDis').show(false);
			this.projMngDashCpsChgForm.actions.get('approveDis').show(true);
			this.projMngDashCpsChgForm.actions.get('rejectDis').show(true);
		} else {
			this.projMngDashCpsChgForm.actions.get('save').show(false);
			this.projMngDashCpsChgForm.actions.get('approve').show(false);
			this.projMngDashCpsChgForm.actions.get('reject').show(false);
			this.projMngDashCpsChgForm.actions.get('saveDis').show(true);
			this.projMngDashCpsChgForm.actions.get('approveDis').show(true);
			this.projMngDashCpsChgForm.actions.get('rejectDis').show(true);
		}
	},
	
	projMngDashCpsChgForm_onSave: function() {
		this.projMngDashCpsChgForm.clearValidationResult();
		var apprv_mgr1 = this.projMngDashCpsChgForm.getFieldValue('work_pkgs.apprv_mgr1');
		var value = $('projMngDashCpsChgForm_apprv_select').value;
		if (apprv_mgr1 != '' && value == '1')  {
			this.projMngDashCpsChgForm.setFieldValue('activity_log.approved_by', apprv_mgr1);
		}
		else if (apprv_mgr1 != '') this.projMngDashCpsChgForm.setFieldValue('activity_log.approved_by', '');
		if (!this.projMngDashCpsChgForm.save()) return;
		View.getOpenerView().panels.get('projMngDashCps_cps').refresh();
		View.getOpenerView().panels.get('projMngDashAlert_msgs').refresh();
		//View.closeThisDialog();	
	},
	
	projMngDashCpsChgForm_onApprove: function() {
		if (!this.validateRequestFields()) return;
		var apprv_mgr1 = this.projMngDashCpsChgForm.getFieldValue('work_pkgs.apprv_mgr1');
		var wbs_id = this.projMngDashCpsChgForm.getFieldValue('activity_log.wbs_id');
		var action_title = this.projMngDashCpsChgForm.getFieldValue('activity_log.action_title');
		var wbs_title = action_title;
		if (wbs_id) wbs_title = wbs_id + ' - ' + action_title;
		var controller = this;
        var message = getMessage('confirmApprove');
        View.confirm(message, function(button){
            if (button == 'yes') {
            	if (apprv_mgr1 != '') controller.projMngDashCpsChgForm.setFieldValue('activity_log.approved_by', apprv_mgr1);
            	controller.copyBaselineValues();
            	if (!controller.projMngDashCpsChgForm.save()) return;
        		controller.projMngDashCpsChgForm.setFieldValue('activity_log.status', 'APPROVED');
        		var today = new Date();
        		var date_approved = FormattingDate(today.getDate(), today.getMonth()+1, today.getFullYear(), strDateShortPattern);
        		controller.projMngDashCpsChgForm.setFieldValue('activity_log.date_approved', date_approved);
            	controller.projMngDashCpsChgForm.save();	
            	controller.projMngDashCpsChgForm.refresh();
            	var activity_log_id = controller.projMngDashCpsChgForm.getFieldValue('activity_log.activity_log_id');
                try {
                	var parameters = {'activity_log_id' : activity_log_id};
            		var result = Workflow.callMethodWithParameters('AbProjectManagement-ProjectManagementService-approveChangeOrderFCPM', parameters);
            		if (result.code == 'executed') {
            			View.getOpenerView().panels.get('projMngDashCps_cps').refresh();
                		View.getOpenerView().panels.get('projMngDashAlert_msgs').refresh();
                		View.closeThisDialog();
            		} else {
            			View.showMessage(result.code + " :: " + result.message);
            		}	
                } 
                catch (e) {

                }
            }
        });
		
	},
	
	projMngDashCpsChgForm_onReject: function() {		
		if (!this.validateRequestFields()) return;
		var action_title = this.projMngDashCpsChgForm.getFieldValue('activity_log.action_title');
		var apprv_mgr1 = this.projMngDashCpsChgForm.getFieldValue('work_pkgs.apprv_mgr1');
		var wbs_id = this.projMngDashCpsChgForm.getFieldValue('activity_log.wbs_id');
		var wbs_title = action_title;
		if (wbs_id) wbs_title = wbs_id + ' - ' + action_title;
		var controller = this;
        var message = getMessage('confirmReject');
        View.confirm(message, function(button){
            if (button == 'yes') {
            	if (apprv_mgr1 != '') controller.projMngDashCpsChgForm.setFieldValue('activity_log.approved_by', apprv_mgr1);
            	if (!controller.projMngDashCpsChgForm.save()) return;
            	controller.projMngDashCpsChgForm.setFieldValue('activity_log.status', 'REJECTED');
            	controller.projMngDashCpsChgForm.save();   
            	controller.projMngDashCpsChgForm.refresh();
            	View.getOpenerView().panels.get('projMngDashCps_cps').refresh();
        		View.getOpenerView().panels.get('projMngDashAlert_msgs').refresh();
        		View.closeThisDialog();
            }
        });
		
	},	
	
	validateRequestFields: function() {
		var valid = true;
		this.projMngDashCpsChgForm.clearValidationResult();
		if (!this.validateCostFields()) valid = false;
		if (!this.validateApprvFields()) valid = false;
		return valid;
	},
	
	validateCostFields: function() {
		var cost_estimated = parseFloat(this.projMngDashCpsChgForm.getFieldValue('activity_log.cost_estimated'));
		var cost_est_cap = parseFloat(this.projMngDashCpsChgForm.getFieldValue('activity_log.cost_est_cap'));
		var sum = cost_estimated + cost_est_cap;
		if (sum <= 0) {
			this.projMngDashCpsChgForm.addInvalidField('activity_log.cost_estimated', '');
			this.projMngDashCpsChgForm.addInvalidField('activity_log.cost_est_cap', '');
			this.projMngDashCpsChgForm.displayValidationResult('');
			View.showMessage(getMessage('totCostsGreaterZero'));
			return false;
		}
		else return true;
	},
	
	validateApprvFields: function() {
		var apprv_mgr1 = this.projMngDashCpsChgForm.getFieldValue('work_pkgs.apprv_mgr1');
		var approved_by = this.projMngDashCpsChgForm.getFieldValue('activity_log.approved_by');
		var value = $('projMngDashCpsChgForm_apprv_select').value;
		if (apprv_mgr1 != '' && value == '0')  {
			this.projMngDashCpsChgForm.addInvalidField('projMngDashCpsChgForm_apprv_field', '');
			this.projMngDashCpsChgForm.displayValidationResult('');
			View.showMessage(getMessage('enterAuthMgr'));
			return false;
		}
		else if (apprv_mgr1 == '' && approved_by == '') {
			this.projMngDashCpsChgForm.addInvalidField('activity_log.approved_by', '');
			this.projMngDashCpsChgForm.displayValidationResult('');
			View.showMessage(getMessage('enterAuthMgr'));
			return false;
		}
		else if (apprv_mgr1 == '') return checkAuthMgrEm();
		else return true;
	},
	
	copyBaselineValues: function() {
		var form = View.panels.get('projMngDashCpsChgForm');
		var cost_estimated = form.getFieldValue('activity_log.cost_estimated');
		var cost_est_cap = form.getFieldValue('activity_log.cost_est_cap');
		var cost_est_design_exp = form.getFieldValue('activity_log.cost_est_design_exp');
		var cost_est_design_cap = form.getFieldValue('activity_log.cost_est_design_cap');
		if (cost_est_design_exp == 0) form.setFieldValue('activity_log.cost_est_design_exp', cost_estimated);
		if (cost_est_design_cap == 0) form.setFieldValue('activity_log.cost_est_design_cap', cost_est_cap);
		form.setFieldValue('activity_log.date_scheduled', form.getFieldValue('activity_log.date_planned_for'));
		form.setFieldValue('activity_log.duration', form.getFieldValue('activity_log.duration_est_baseline'));
		form.setFieldValue('activity_log.hours_est_design', form.getFieldValue('activity_log.hours_est_baseline'));
	}
});

function enableApprv() {
	var controller = View.controllers.get('projMngDashCpsChg');
	controller.disableApprvActions();
}

function checkAuthMgrEm() {
	var form = View.panels.get('projMngDashCpsChgForm');
	form.clearValidationResult();
	var em_id = form.getFieldValue('activity_log.approved_by');
	if (em_id == '') return;
	var restriction = new Ab.view.Restriction();
	restriction.addClause('em.em_id', em_id);
	var records = View.dataSources.get('projMngDashCpsChgDs4').getRecords(restriction);
	if (records.length < 1) {
		form.addInvalidField('activity_log.approved_by', '');
		form.displayValidationResult('');
		View.showMessage(getMessage('invalidAuthMgr'));
		return false;
	}
	return true;
}

function afterSelectAuthMgr(fieldName, selectedValue) {
	if (fieldName == 'activity_log.approved_by') {
		var form = View.panels.get('projMngDashCpsChgForm');
		form.setFieldValue('activity_log.approved_by',selectedValue);
		enableApprv();
	}
}

function projMngDashCpsChg_selValVn_onSelect(fieldName, newValue, oldValue) {
	var controller = View.controllers.get('projMngDashCpsChg');
	var form = controller.projMngDashCpsChgForm;
	if (fieldName == 'activity_log.work_pkg_id' && newValue != '') {
		var restriction = new Ab.view.Restriction();
		restriction.addClause('work_pkg_bids.project_id', form.getFieldValue('activity_log.project_id'));
		restriction.addClause('work_pkg_bids.work_pkg_id', newValue);
		var records = controller.projMngDashCpsChgDs3.getRecords(restriction);
		if (records.length > 0) {
			var record = records[0];
			var vn_id = record.getValue('work_pkg_bids.vn_id');
			var site_id = record.getValue('project.site_id');
			var bl_id = record.getValue('project.bl_id');
			var proj_phase = record.getValue('work_pkgs.proj_phase');
			var wbs_id = record.getValue('work_pkgs.wbs_id');
			var apprv_mgr1 = record.getValue('work_pkgs.apprv_mgr1');
			
			if (vn_id) form.setFieldValue('activity_log.vn_id', vn_id);
			if (site_id) form.setFieldValue('activity_log.site_id', site_id);
			if (bl_id) form.setFieldValue('activity_log.bl_id', bl_id);
			if (proj_phase) form.setFieldValue('activity_log.proj_phase', proj_phase);	
			if (wbs_id) form.setFieldValue('activity_log.wbs_id', wbs_id);
			if (wbs_id) form.setFieldValue('work_pkgs.wbs_id', wbs_id);
			if (apprv_mgr1) form.setFieldValue('work_pkgs.apprv_mgr1', apprv_mgr1);
		}
	}
}
