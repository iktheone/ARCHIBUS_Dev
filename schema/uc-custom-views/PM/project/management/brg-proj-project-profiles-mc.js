var projProjectProfilesMcController = View.createController('projProjectProfilesMc', {

    quest : null,

    projProjectProfilesMcColumnReport_afterRefresh : function() {
		var project_type = this.projProjectProfilesMcColumnReport.getFieldValue('project.project_type');
		var q_id = 'Project - ' + project_type;
		this.quest = new Ab.questionnaire.Quest(q_id, 'projProjectProfilesMcColumnReport', true);
    },

    projProjectProfilesMcForm_afterRefresh : function() {
		var project_type = this.projProjectProfilesMcForm.getFieldValue('project.project_type');
		var q_id = 'Project - ' + project_type;
		this.quest = new Ab.questionnaire.Quest(q_id, 'projProjectProfilesMcForm');

		for (var i = 0; i < 6; i++) {
			this.projProjectProfilesMcForm.getFieldElement('project.status').options[i].setAttribute("disabled", "true");
		}

        // disable the complete and close statuses as well (must use Complete button)
		for (var i = 12; i < 16; i++) {
			this.projProjectProfilesMcForm.getFieldElement('project.status').options[i].setAttribute("disabled", "true");
		}

		var status = this.projProjectProfilesMcForm.getFieldValue('project.status');
		if (status == 'Approved' || status == 'Approved-In Design' || status == 'Approved-Cancelled' || status == 'Issued-In Process' ||
				status == 'Issued-On Hold' || status == 'Issued-Stopped' || status == 'Completed-Pending' || status == 'Completed-Not Ver' ||
				status == 'Completed-Verified' || status == 'Closed') {
			this.projProjectProfilesMcForm.enableField('project.status', true);
		}
		else this.projProjectProfilesMcForm.enableField('project.status', false);

        // show the "Complete" button if status = "Issued-In Process" and only for specific roles.
        var projCompGroup = View.user.isMemberOfGroup('PROJCOMP');
        var projCompAdminGroup = View.user.isMemberOfGroup('PROJCOMP-ADMIN');
        var role = View.user.role;

        if (!(projCompGroup || projCompAdminGroup)) {
            this.projProjectProfilesMcForm.actions.get('btnCompleteProj').button.setText("-");
            this.projProjectProfilesMcForm.actions.get('btnCompleteProj').show(false);
        }
        else {
            if (projCompAdminGroup && status == "Completed-Not Ver") {
                this.projProjectProfilesMcForm.actions.get('btnCompleteProj').button.setText(getMessage("btnCompVerText"));
                this.projProjectProfilesMcForm.actions.get('btnCompleteProj').show(true);
            }
            else if ((status.substring(0,6) == "Issued") || (status.substring(0,8) == "Approved")) {
                this.projProjectProfilesMcForm.actions.get('btnCompleteProj').show(true);
            }
            else {
                this.projProjectProfilesMcForm.actions.get('btnCompleteProj').button.setText("-");
                this.projProjectProfilesMcForm.actions.get('btnCompleteProj').show(false);
            }
        }

        var acct = this.projProjectProfilesMcForm.getFieldValue("project.ac_id");
        loadAcctCode(acct);
    },

    projProjectProfilesMcForm_beforeSave : function() {
    	this.quest.beforeSaveQuestionnaire();
    	return this.validateDateFields();
    },

    validateDateFields : function() {
    	var date_start = getDateObject(this.projProjectProfilesMcForm.getFieldValue('project.date_start'));//note that getFieldValue returns date in ISO format
    	var date_end = getDateObject(this.projProjectProfilesMcForm.getFieldValue('project.date_end'));
    	if (date_end < date_start) {
    		this.projProjectProfilesMcForm.addInvalidField('project.date_end', getMessage('endBeforeStart'));
    		return false;
    	}
    	return true;
    },

    projProjectProfilesMcForm_afterAcctValidationSave: function() {
        if(this.projProjectProfilesMcForm.save()) {
            this.projProjectProfilesMcColumnReport.refresh();
            this.projProjectProfilesMcForm.closeWindow();
        }
    }
});

function getDateObject(ISODate)
{
	var tempArray = ISODate.split('-');
	return new Date(tempArray[0],tempArray[1]-1,tempArray[2]);
}

/****************************************************************
 * Project Restriction Console functions
 */

function onProjectIdSelval() {
	projectIdSelval('');
}


/****************************************************************
 * Account Code Support functions
 */
// ************************************************************************
// Checks the Account Code (through PHP) and call the saveFormCallback function
// if successful.  Valid Account codes are automatically inserted into the
// ac table.
// ************************************************************************
function checkAcctAndSave()
{
    var autoGeneratedWorkRequest;
    var oldPhase = projProjectProfilesMcController.projProjectProfilesMcForm.record.oldValues['project.proj_phase'];
    var newPhase = projProjectProfilesMcController.projProjectProfilesMcForm.getFieldValue('project.proj_phase');
    var closeoutExpression = /^CLOSEOUT.*/;

    //If we're closing out the project ensure that all associated work requests are completed
    if(!oldPhase.match(closeoutExpression) && newPhase.match(closeoutExpression)){
        var wfResults = Workflow.runRuleAndReturnResult('AbCommonResources-getDataRecords', {
            tableName: 'wr',
            fieldNames: toJSON(['wr_id', 'status', 'requestor']),
            restriction: toJSON("project_id='" + projProjectProfilesMcController.projProjectProfilesMcForm.getFieldValue('project.project_id').replace(/'/g,"''") + "'")
        });
        if(wfResults.code != 'executed'){
            View.showMessage('Error', wfResults.message, wfResults.detailedMessage);
            return false;
        }
        
        if(wfResults.data != 'undefined'){
            var openWorkRequests = [];
            //Statuses can easily be added/removed to/from the ignore list by altering this expression
            var allowedStatusExpression = /^(?:Com|Rej)$/;
                
            for(var i = 0; i < wfResults.data.records.length; i++){
                if(wfResults.data.records[i]['wr.requestor'] == 'PROJECT BOT')
                    autoGeneratedWorkRequest = wfResults.data.records[i]['wr.wr_id'];
                else if(!wfResults.data.records[i]['wr.status.raw'].match(allowedStatusExpression))
                    openWorkRequests.push(wfResults.data.records[i]['wr.wr_id']);
            }
            
            if(openWorkRequests.length > 0){
                var workRequestList = toJSON(openWorkRequests);
                workRequestList = workRequestList.substring(1, workRequestList.length - 1);
                projProjectProfilesMcController.view.alert('Please complete the following work requests before closing the project:\n' + workRequestList);
                return false;
            }
        }
    }
    
	//check to see if the ac_id entered is null
	var parsed_ac_id = $('ac_id_part1').value +
				$('ac_id_part2').value +
				$('ac_id_part3').value +
				$('ac_id_part4').value +
				$('ac_id_part5').value +
				$('ac_id_part6').value +
				$('ac_id_part7').value +
				$('ac_id_part8').value;
	parsed_ac_id.replace(" ", "");

	//if parsed is null then save form directly
	if (parsed_ac_id=="") {
		saveFormCallback("");
	}
	else {
		// check account code through php
		uc_psAccountCode(
			$('ac_id_part1').value,
			$('ac_id_part2').value,
			$('ac_id_part3').value,
			$('ac_id_part4').value,
			$('ac_id_part5').value,
			$('ac_id_part6').value,
			$('ac_id_part7').value,
			$('ac_id_part8').value,
			'saveFormCallback');
	}
    
    //Close the auto-generated work request
    if(autoGeneratedWorkRequest) {
        Workflow.runRuleAndReturnResult('AbCommonResources-saveRecord', {
            tableName: 'wr',
            fields: toJSON({'wr.wr_id': autoGeneratedWorkRequest, 'wr.status': 'Com'})
        });
    }
}

function saveFormCallback(acct)
{
	var success = false;
	var ac_id=acct.replace("\r\n\r\n", "");

	//check to see if the ac_id entered is null
	var parsed_ac_id = $('ac_id_part1').value +
				$('ac_id_part2').value +
				$('ac_id_part3').value +
				$('ac_id_part4').value +
				$('ac_id_part5').value +
				$('ac_id_part6').value +
				$('ac_id_part7').value +
				$('ac_id_part8').value;
	parsed_ac_id.replace(" ", "");

	//if parsed is not null, ensure that the returned ac_id isn't blank.
	if (parsed_ac_id != "" && ac_id == "") {
		ac_id = "0";
	}

	switch(ac_id)
	{
	case "1":
		View.showMessage(getMessage('error_Account1'));
		success = false;
		break;
	case "2":
		View.showMessage(getMessage('error_Account2'));
		success = false;
		break;
	case "3":
		View.showMessage(getMessage('error_Account3'));
		success = false;
		break;
	case "4":
		View.showMessage(getMessage('error_Account4'));
		success = false;
		break;
	case "5":
		View.showMessage(getMessage('error_Account5'));
		success = false;
		break;
	case "6":
		View.showMessage(getMessage('error_Account6'));
		success = false;
		break;
	case "7":
		View.showMessage(getMessage('error_Account7'));
		success = false;
		break;
	case "8":
		View.showMessage(getMessage('error_Account8'));
		success = false;
		break;
	case "99":
		View.showMessage(getMessage('error_Account99'));
		success = false;
		break;
	case "0":
		View.showMessage(getMessage('error_invalidAccount'));
		success = false;
		break;
	default:
		success = true;
	};

	// Set the valid account code
	if (success) {
        projProjectProfilesMcController.projProjectProfilesMcForm_afterAcctValidationSave()
	}
}

function loadAcctCode(acct) {
	var position = 0;
	var mark = acct.indexOf('-', position);
	var bu = acct.substring(position, mark);
	//fund
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var fund= acct.substring(position, mark);
	//dept
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var dept= acct.substring(position, mark);
	//account
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var account= acct.substring(position, mark);
	//program
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var program= acct.substring(position, mark);
	//internal
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var internal= acct.substring(position, mark);
	//project
	position=mark+1;
	mark=acct.indexOf('-',mark+1);
	var project= acct.substring(position, mark);
	//affiliate
	position=mark+1;
	//mark=acct.indexOf('-',mark+1);
	var affiliate= acct.substring(position);

	$('ac_id_part1').value = bu;
	$('ac_id_part2').value = fund;
	$('ac_id_part3').value = dept;
	$('ac_id_part4').value = account;
	$('ac_id_part5').value = program;
	$('ac_id_part6').value = internal;
	$('ac_id_part7').value = project;
	$('ac_id_part8').value = affiliate;
}


/*******
 * BRG: added verification for Complete.
 */
function onBtnCompleteProj()
{
    var form = View.panels.get('projProjectProfilesMcForm');
    var projectId = form.getFieldValue('project.project_id');
    var currentStatus = form.getFieldValue('project.status');

    if (currentStatus != "Completed-Not Ver")
    {
        if (verifyComplete(projectId)) {
            // Set to Completed-Not Ver
            form.setFieldValue("project.status", "Completed-Not Ver");
            if (form.save()) {
                if (View.user.isMemberOfGroup('PROJCOMP-ADMIN')) {
                    form.actions.get('btnCompleteProj').button.setText(getMessage("btnCompVerText"));
                }
                else {
                    form.actions.get('btnCompleteProj').show(false);
                }

                View.panels.get('projProjectProfilesMcColumnReport').refresh();
            }
        }
        else {
            View.showMessage(getMessage("cannotComplete"));
        }
    }
    else
    {
        // Verify Packages and invoice payments
        if (verifyComplete(projectId)) {

            // Set to Completed Verified.
            form.setFieldValue("project.status", "Completed-Verified");
            if (form.save()) {
                form.actions.get('btnCompleteProj').show(false);
                View.panels.get('projProjectProfilesMcColumnReport').refresh();
                View.panels.get('projProjectProfilesMcForm').closeWindow();
            }
        }
        else {
            View.showMessage(getMessage("cannotComplete"));
        }
    }
}

function verifyComplete(projectId) {
	var complete = false;

	var completeStatuses = "'Created-Withdrawn','Requested-Rejected','Approved-Cancelled','Issued-Stopped','Issued-Stopped','Completed-Not Ver','Completed-Verified','Closed'";

	var restriction = "project_id ="+BRG.Common.literalOrNull(projectId);
	restriction += " AND (EXISTS (SELECT TOP 1 1 FROM work_pkgs w WHERE w.project_id=project.project_id AND w.status NOT IN ({statuses}))";
	restriction += " OR EXISTS (SELECT TOP 1 1 FROM invoice_payment i WHERE i.project_id=project.project_id AND i.reviewed = 0))";

	restriction = restriction.replace("{statuses}", completeStatuses);

	// Verify Project Complete
	var record = BRG.Common.getDataRecords("project", ["project_id"], restriction)

	if (record.length == 0) {
		// everything is complete and/or reviewed.
		complete = true;
	}

	return complete;
}

function openPrintWindow()
{
    var form = View.panels.get('projProjectProfilesMcColumnReport');
    var projectId = form.getFieldValue('project.project_id');
    projectId = projectId.replace(/&/g,"%26");
    projectId = projectId.replace(/'/g,"%27");
	window.open('brg-proj-project-details-print.axvw?handler=com.archibus.config.ActionHandlerDrawing&project.project_id='+projectId, 'newWindow', 'width=800, height=600, resizable=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, copyhistory=no');
}