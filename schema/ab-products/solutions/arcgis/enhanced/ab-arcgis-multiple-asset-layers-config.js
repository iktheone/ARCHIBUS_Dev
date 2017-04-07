var mapConfigObject = {
	// the view method to call when the map is loaded
	"mapLoadedCallback" : mapLoadedCallback,
	// initial map extent
	"mapInitExtent" : [-7934782, 5240479, -7933103, 5241488],
	// initial map extent WKID	
	"mapInitExtentWKID" : 102100,
	// currently not used	
	//"lods" : [],
	// basemap layers	
	"basemapLayerList" : [
			//basemap
			{ 	
				name: 'Basemap',
				url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',
				//url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
				opacity: 1.0
			}
		],
	// reference layers
	"referenceLayerList" : [
			//pu campus basemap annotation
			{
				name: 'Land Base',
				url: 'http://tiles.arcgis.com/tiles/lq5SzPW1rLR0h1u9/arcgis/rest/services/hq_land_base/MapServer',
				opacity: 0.75,
				index: 90
			}
		],
	// the method to call when the feature layer is loaded
	"featureLayerLoadedCallback": featureLayerLoadedCallback,

	// the method to call when the feature layer is clicked
	"featureLayerClickCallback": featureLayerClickCallback,

	// feature layers (archibus assets)
	"featureLayerList" : [
			// buildings
			{
				name: 'Building',
				url: 'http://services3.arcgis.com/lq5SzPW1rLR0h1u9/arcgis/rest/services/hq_buildings/FeatureServer/0',
				opacity: 0.75,
				index: 75,
				outFields: ['*'],
				zoomToResults: true,
				toolTipField: 'name',
				assetIdField: 'bl_id',
				assetTypeField: 'ab_asset_type'
			},
			// parcels
			{
				name: 'Parcel',
				url: 'http://services3.arcgis.com/lq5SzPW1rLR0h1u9/arcgis/rest/services/hq_parcels/FeatureServer/0',
				opacity: 0.5,
				index: 50,
				outFields: ['*'],
				zoomToResults: true,
				toolTipField: 'MAP_PAR_ID',
				assetIdField: 'MAP_PAR_ID',
				assetTypeField: 'AB_ASSET_TYPE'
			}
		]	

};