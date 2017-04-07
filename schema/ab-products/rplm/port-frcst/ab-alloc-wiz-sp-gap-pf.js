var allocWizSpGapController = View.createController('allocWizSpGap', {
	scn_id: '',
	minDate: '',
	maxDate: '',
	
	afterViewLoad: function(){
		this.allocWizSpGap_yearTree.addParameter('start', getMessage('start'));
		this.allocWizSpGap_yearTree.addParameter('end', getMessage('end'));
		var unitTitle = getMessage('unitTitleMetric');
		var units = View.project.units;
		if (units == "imperial") {
			unitTitle = getMessage('unitTitleImperial');
		}
		this.allocWizSpGap_yearTree.addParameter('unitTitle', unitTitle);
    	this.initializeTreePanel();
    	
    	this.setMinDate();
    	this.setMaxDate();
    },
    
    initializeTreePanel: function(){
    	this.allocWizSpGap_yearTree.createRestrictionForLevel = createRestrictionForLevel;
    },
    
    changeScenario: function() {
    	this.scn_id = View.getOpenerView().controllers.get('allocWiz').scn_id;
    	this.allocWizSpGap_console.clear();
    },
    
    setMinDate: function() {
    	var fromDate = new Date();
    	fromDate.setMonth(fromDate.getMonth()-5);
    	if (fromDate) this.minDate = FormattingDate(fromDate.getDate(), fromDate.getMonth() + 1, fromDate.getFullYear(), "YYYY-MM-DD");
    },
    
    setMaxDate: function() {
    	var toDate = new Date();
    	toDate.setMonth(toDate.getMonth()+6);
    	if (toDate) this.maxDate = FormattingDate(toDate.getDate(), toDate.getMonth() + 1, toDate.getFullYear(), "YYYY-MM-DD");
    },
    
    allocWizSpGap_yearTree_beforeRefresh: function() {
    	View.openProgressBar(getMessage('refreshingChart'));
    	
    	this.scn_id = View.getOpenerView().controllers.get('allocWiz').scn_id;
		var date_start = this.allocWizSpGap_console.getFieldValue('bl.from_date');
		var date_end = this.allocWizSpGap_console.getFieldValue('bl.to_date');
		if (date_start == '' && date_end == '') {
			this.setMinDate();
			this.setMaxDate();
		} else if (date_start != '' && date_end == '') {
			this.minDate = date_start;
			var toDate = getDateObject(date_start);
			toDate.setMonth(toDate.getMonth()+12);
			this.maxDate = FormattingDate(toDate.getDate(), toDate.getMonth() + 1, toDate.getFullYear(), "YYYY-MM-DD");
		} else if (date_start == '' && date_end != '') {
			this.maxDate = date_end;
			var fromDate = getDateObject(date_end);
			fromDate.setMonth(fromDate.getMonth()-12);
			this.minDate = FormattingDate(fromDate.getDate(), fromDate.getMonth() + 1, fromDate.getFullYear(), "YYYY-MM-DD");
		} else {
			this.minDate = date_start;
			this.maxDate = date_end;
		}

    	var consoleRestriction = this.getGpConsoleRestriction('bl.site_id');
    	consoleRestriction += " AND " + this.getDateRestriction('gp.date_start');
    	var endDateRestriction = this.getDateRestriction("${sql.dateAdd('day', 1, 'gp.date_end')}");
		this.allocWizSpGap_yearTree.addParameter('consoleRestriction', consoleRestriction);
		this.allocWizSpGap_yearTree.addParameter('endDateRestriction', endDateRestriction);
		this.allocWizSpGap_yearTree.addParameter('scn_id', this.scn_id);
    },
    
    allocWizSpGap_yearTree_afterRefresh: function() {
    	this.allocWizSpGap_yearTree.expand();
    	View.updateProgressBar(1/4);
		this.refreshGapChart();
		View.closeProgressBar();
	},
	
	allocWizSpGap_console_onFilter: function() {
		this.allocWizSpGap_yearTree.refresh();
	},
	
	getGpConsoleRestriction: function(siteFieldName) {
		var consoleRestriction = "1=1";
		var sites = this.allocWizSpGap_console.getFieldMultipleValues('bl.site_id');
		if (sites.length > 0 && sites[0] != '') {
			consoleRestriction += " AND " + siteFieldName + " IN (";
			var sitesList = this.getSitesList();
			consoleRestriction += sitesList + ")";
		}
		var bls = this.allocWizSpGap_console.getFieldMultipleValues('bl.bl_id');
		if (bls.length > 0 && bls[0] != '') {
			var blsList = '';
			consoleRestriction += " AND gp.bl_id IN (";
			for (var i = 0; i < bls.length; i++) {
				var bl = bls[i];
				if (blsList != '') blsList += ',';
				blsList += "'" + bl + "'";
			}
			consoleRestriction += blsList + ")";
		}
		return consoleRestriction;
	},
	
	getDateRestriction: function(dateField) {
		var restriction = " 1=1 ";
		var date_start = this.allocWizSpGap_console.getFieldValue('bl.from_date');
		var date_end = this.allocWizSpGap_console.getFieldValue('bl.to_date');
		if (date_start == '') {
			var date = this.getMinMaxEvtDate('gp.date_start');
			if (date) date_start = FormattingDate(date.getDate(), date.getMonth() + 1, date.getFullYear(), "YYYY-MM-DD");
		}		
		if (date_end == '') {
			var date = this.getMinMaxEvtDate('gp.date_end');
			if (date) date_end = FormattingDate(date.getDate(), date.getMonth() + 1, date.getFullYear(), "YYYY-MM-DD");
		}
		if (date_start != '' && date_end != '') {
			restriction += " AND " + dateField + " >= ${sql.date('" + date_start + "')} ";
			restriction += " AND " + dateField + " <= ${sql.date('" + date_end + "')} ";
		}
		return restriction;
	},
	
	refreshGapChart: function() {	
		if (this.minDate == '' || this.maxDate == '') {
			this.allocWizSpGap_chartPanel.show(false);
			return;
		}
		var date = getDateObject(this.maxDate);
		date.setMonth(date.getMonth() + 1);
		var dateEnd = FormattingDate(date.getDate(), date.getMonth() + 1, date.getFullYear(), "YYYY-MM-DD");

		var arrayDate = [];
		arrayDate = this.minDate.split("-");
		var monthStart = arrayDate[0] + '-' + arrayDate[1];
		arrayDate = dateEnd.split("-");
		var monthEnd = arrayDate[0] + '-' + arrayDate[1];

		var blSiteRestriction = this.getGpConsoleRestriction('bl.site_id');
		this.allocWizSpGap_chartPanel.addParameter('monthStart', monthStart);
		this.allocWizSpGap_chartPanel.addParameter('monthEnd', monthEnd);
		this.allocWizSpGap_chartPanel.addParameter('portfolioScenario', this.scn_id);
		this.allocWizSpGap_chartPanel.addParameter('blSiteRestriction', blSiteRestriction);
		this.allocWizSpGap_chartPanel.refresh();
		this.allocWizSpGap_chartPanel.show();
	},	
	
	allocWizSpGap_console_onAllocWizSpGap_selValSite: function() {
		var controller = View.controllers.get('allocWizSpGap');
		View.selectValue('allocWizSpGap_console',
				getMessage('sites'),
				['bl.site_id'],
				'site',
				['site.site_id'],
				['site.site_id', 'site.name'],
				"EXISTS (SELECT 1 FROM gp LEFT OUTER JOIN bl ON gp.bl_id=bl.bl_id WHERE bl.site_id = site.site_id AND gp.portfolio_scenario_id = '"+controller.scn_id +"')",
				null, false, false, null, 800, 600, 'multiple'
		);
	},
	
	allocWizSpGap_console_onAllocWizSpGap_selValBl: function() {
		var restriction = '1=1';
		var sitesList = this.getSitesList();
		if (sitesList != '') restriction += " AND bl.site_id IN ("	+ sitesList + ")";	
		
		var controller = View.controllers.get('allocWizSpGap');
		View.selectValue('allocWizSpGap_console',
				getMessage('buildings'),
				['bl.site_id','bl.bl_id'],
				'bl',
				['bl.site_id','bl.bl_id'],
				['bl.site_id','bl.bl_id','bl.name'],
				"EXISTS (SELECT 1 FROM gp WHERE gp.bl_id=bl.bl_id AND gp.portfolio_scenario_id = '"+controller.scn_id +"') AND " + restriction,
				null, false, false, null, 800, 600, 'multiple'
		);
	},
	
	getMinMaxEvtDate: function(dateField) {
		var restriction = new Ab.view.Restriction();
		restriction.addClause('gp.portfolio_scenario_id', this.scn_id);
		var bls = this.allocWizSpGap_console.getFieldMultipleValues('bl.bl_id');
		if (this.isExpanded && bls.length > 0 && bls[0] != '') restriction.addClause('gp.bl_id', bls, 'IN');
		
		var siteRestriction = "1=1";
		var sitesList = this.getSitesList();
		if (sitesList != '') {
			siteRestriction += " AND bl.site_id IN (" + sitesList + ")";			
		}
		this.allocWizSpGap_ds3.addParameter('siteRestriction', siteRestriction);
		
		var date_start = null;
		var records = this.allocWizSpGap_ds3.getRecords(restriction);
		if (records.length > 0) {
			date_start = records[0].getValue(dateField);
		}
		return date_start;
	},
	
	getSitesList: function() {
		var sitesList = '';
		var sites = this.allocWizSpGap_console.getFieldMultipleValues('bl.site_id'); 
		for (var i = 0; i < sites.length; i++) {
			var site = sites[i];
			if (site == '') continue;
			if (sitesList != '') sitesList += ',';
			sitesList += "'" + site + "'";
		}
		return sitesList;
	}
});

function onClickTreeNode(){
	var controller = View.controllers.get('allocWizSpGap');
	var objTree = View.panels.get('allocWizSpGap_yearTree');
	var crtNode = objTree.lastNodeClicked;
	var levelIndex = crtNode.level.levelIndex;
	var restriction = new Ab.view.Restriction();
	if(levelIndex == 3){
		var gp_id = crtNode.data['gp.gp_id'];
		restriction.addClause('gp.gp_id', Number(gp_id));
		var viewName = 'ab-alloc-wiz-evts-edit-pf.axvw';
    	var record = controller.allocWizSpGap_ds1.getRecord(restriction);
    	var is_available = record.getValue('gp.is_available');
    	if (is_available == 0) viewName = 'ab-alloc-wiz-evts-edit-unavail-pf.axvw';
    	var ls_id = record.getValue('gp.ls_id');
    	if (ls_id != '') viewName = 'ab-alloc-wiz-evts-edit-ls-pf.axvw';
    	
		View.openDialog(viewName, restriction, false, {
	    	width: 900,
	    	height: 570,
			closeButton : true,
			isNewGroup: false,
			callback: function(dateStart) {
				controller.allocWizSpGap_console_onFilter();
			}
		});
	}
}

function createRestrictionForLevel(parentNode, level){
    var restriction = new Ab.view.Restriction();
    if (parentNode.data) {
        var prob = parentNode.data['gp.dv_id'];
        if (!prob && level == 1) {
            restriction.addClause('gp.dv_id', '', 'IS NULL', 'AND', true);
        }
		
		if (prob && level == 1) {
            restriction.addClause('gp.dv_id', prob, '=', 'AND', true);
        }
        
        if (prob && level == 2){
        	var date_start = parentNode.data['gp.date_start'];
        	date_start = getDateWithISOFormat(date_start);
            restriction = new Ab.view.Restriction();
            restriction.addClause('gp.date_start', date_start, '=', 'AND', true);
        }  
        
        if (prob && level == 3){
        	var date_start = parentNode.data['gp.date_start'];
        	date_start = getDateWithISOFormat(date_start);
        	var name = parentNode.data['gp.name'];
            restriction = new Ab.view.Restriction();
            restriction.addClause('gp.date_start', date_start, '=', 'AND', true);
            restriction.addClause('gp.name', name, '=', 'AND', true);
        } 
    }
    return restriction;
}

function getDateObject(ISODate)
{
	var tempArray = ISODate.split('-');
	return new Date(tempArray[0],tempArray[1]-1,tempArray[2]);
}
