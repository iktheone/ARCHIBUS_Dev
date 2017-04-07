var docREPORT = View.createController('docREPORT', {
	
	afterViewLoad: function() {
		var opener =this.view.getOpenerView()
		//var wr = opener.panels.get("wr_report").getFieldValue('wrhwr.wr_id')
		this.detailsPanel.restriction =  opener.panels.get("wr_report").restriction
	},
	detailsPanel_afterRefresh: function() {
		//Replace Disabled Select Menu With Span
        var enumfields = [
			$("wrhwr.status") || null,
			$("wrhwr.priority") || null,
			$("wrhwr.towing") || null
		];
		 this.replaceDisabledEnumFields(enumfields);
	},
	replaceDisabledEnumFields: function (fields) {
        for (var i = 0, j = fields.length; i < j; i++) {
            if (fields[i] !== null && fields[i].disabled === true) {
                var coverEl = document.createElement("SPAN");
                fields[i].style.display = "none";
                coverEl.innerHTML = fields[i].options[0].text;
                if (fields[i].coverEl) {
                    fields[i].parentNode.removeChild(fields[i].coverEl);
                }
                fields[i].coverEl = coverEl;
                fields[i].parentNode.appendChild(coverEl);
            }
            else if (fields[i].coverEl) {
                fields[i].coverEl.style.display = "none";
                fields[i].style.display = "block";
            }
        }
    },

    replaceDisabledDateFields: function (fields) {
        for (var i = 0, j = fields.length; i < j; i++) {
            if (fields[i] !== null && fields[i].disabled === true) {
                fields[i].parentNode.children[1].style.display = "none";
            } else {
                fields[i].parentNode.children[1].style.display = "";
            }
        }
    }
	
})

/*
function user_form_onload() {
	var form = AFM.view.View.getControl('', 'detailsPanel');
	var priority = form.getFieldValue('wrhwr.priority');
	var status = form.getFieldValue('wrhwr.status');
	
	document.getElementById("Showwrhwr.priority").innerHTML = getEnumDisplay('wr', 'priority', priority);
	document.getElementById("Showwrhwr.status").innerHTML = getEnumDisplay('wr', 'status', status);

	// replace the linefeeds with html breaks (for description and comments)
	// restyle/overwide the 350px width of the readonly span.
	var descriptionSpan =	document.getElementById("Showwrhwr.description");
	descriptionSpan.innerHTML = form.getFieldValue('wrhwr.description').replace(/\n/g, "<br/>");
	descriptionSpan.style.width = "90%";
	var cfnotesSpan = document.getElementById("Showwrhwr.cf_notes");
	cfnotesSpan.innerHTML = form.getFieldValue('wrhwr.cf_notes').replace(/\n/g, "<br/>");
	cfnotesSpan.style.width = "90%";
}


function getEnumDisplay(table_name, field_name, value) {

		var retVal = null;
		var enumDisplay = "";
		
		var restriction = "table_name = '"+table_name+"' AND field_name = '"+field_name+"'";

		var parameters = 
		{
					tableName: 'afm_flds',
					fieldNames: toJSON(['enum_list']),
					restriction: toJSON(restriction)
		};
		var wfrResult = AFM.workflow.Workflow.runRuleAndReturnResult('AbCommonResources-getDataRecord',parameters);  

		if (wfrResult.code == 'executed') {
			var record = wfrResult.data.records[0];
			if (typeof(record) != 'undefined') {
				var fullFieldName = "afm_flds.enum_list";
				retVal = (record[fullFieldName] == null ? null : record[fullFieldName]);
			}
		}
		
		if (retVal != null) {
			var enumArray;
			enumArray = retVal.split(";");
			
			var counter = 0;
				
			while (counter < (enumArray.length-1)) {
				// check if it's equal to the value
				if (enumArray[counter] == value) {
					enumDisplay = enumArray[counter+1];
					break;
				}
				counter = counter + 2;  // need to skip by 2 because it's value/display pair.
			}
		}
		
		return enumDisplay;
}
	
*/	
	
//	var wo_id = form.getFieldValue('wo.wo_id');
	
//	var restriction = "wr_id IN (SELECT wr_id FROM wr WHERE wo_id=" + wo_id+")";

//	var wrGrid = AFM.view.View.getControl('', 'wrPanel');
//	wrGrid.refresh(restriction);

//	var cfGrid = AFM.view.View.getControl('', 'laborPanel');
//	cfGrid.refresh(restriction);
	
//	var otherGrid = AFM.view.View.getControl('', 'otherPanel');
//	otherGrid.refresh(restriction);
	
//	var tlGrid = AFM.view.View.getControl('', 'toolsPanel');
//	tlGrid.refresh(restriction);

//}