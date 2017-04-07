var abSpCompareScenariosCtrl = View.createController('abSpCompareScenariosCtrl', {
	
	afterViewLoad: function(){
		if (valueExists(this.view.getParentTab())) {
			// hide default icons
			View.setToolbarButtonVisible('printButton', false);
			View.setToolbarButtonVisible('emailButton', false);
			View.setToolbarButtonVisible('favoritesButton', false);		
		}
	}
});