angular
    .module('legal')
    .controller('mainController', mainController);

function mainController( $scope, $http, uiGridConstants) {
	function makeNumericFilters() {
		var filter = [
	    {
          condition: uiGridConstants.filter.LESS_THAN,
          placeholder: 'lt<'
        },
        {
          condition: uiGridConstants.filter.GREATER_THAN,
          placeholder: 'gt>'
        }
	    ];
		return filter;
	}
	
	var columnDefs1 = [
		{name : "firmid"},
		{name : "name", width: "20%"},
		{name : "website"},
		{name : "HQ_City"},
		{name : "HQ_State"},
		{field : "contacts", type: "number", filters:makeNumericFilters()},
		{field : "dayssince", type: "number", filters:makeNumericFilters()},
		{name : "score"},
		{name : "tier", width: "8%"},
		{name : "teamid",displayname:"team", width: "8%"},
		{name : "Flagged"}
	];
	
	$scope.firmCount = '';
	
	
	$scope.gridData = {
		columnDefs: columnDefs1,
		enableFiltering: true,
		enableGridMenu: true,
		exporterMenuCsv: true,
		enableRowSelection: true,
		multiSelect : false,
		enableFullRowSelection : true,
		onRegisterApi: function( gridApi ){
			//console.log(gridApi);
			gridApi.selection.on.rowSelectionChanged($scope,function(row){
			var msg = 'row selected ' + row.isSelected;
			console.log($scope.gridApi.selection.getSelectedRows());
			});
			$scope.gridApi = gridApi;
			$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
			},
		data: []};
    //$scope.gridData.data = mockdata;
	
	
	
	
	
    $scope.getFilteredRows=function(){
		//var _renderedRows = $scope.gridApi.grid.renderContainers.body.renderedRows;
		//$scope.filteredRows=_renderedRows;
		return $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
    };
	
	$scope.getFilteredRowCount= function(){ return $scope.getFilteredRows().length;};
    
    $scope.nameForLegalSearch = "";
    // when landing on the page, get all todos and show them
    $scope.clickGetFirmsButton = function() { $http.get('/retrieveFirms')
        .success(function(data) {
            //$scope.firms = data;
			$scope.gridData.data = data;
			$scope.gridData.columnDefs = columnDefs1;
			$scope.firmCount = data.length;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        })};

    $scope.clickSearchFirmsButton = function(searchFirm) { 
        if(searchFirm.length < 1)
        {
            return;
        }

        $http.get('/searchFirms/' + searchFirm )
        .success(function(data) {
            $scope.gridData.data = data;
			$scope.gridData.columnDefs = columnDefs1;
			$scope.firmCount = data.length;
            //console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        })};

    $scope.addFirm = function() { 
        if(!($scope.firmadd && $scope.firmadd.name.length > 1))
        {
            return;
        }

        if($scope.firmadd.url.length < 1)
        {
            return;
        }

        var tosend = {"name" : $scope.firmadd.name, "url" : $scope.firmadd.url};
        $http.post('/firm', tosend)
        .success(function(data) {
            $scope.firmaddresult = "Successfully added " + $scope.firmadd.name;

        })
        .error(function(data) {
            $scope.firmaddresult = "Failed to add " + $scope.firmadd.name;

        })

        $scope.reset();
    };


    $scope.reset = function() { 
        $scope.firmadd.name = "";
        $scope.firmadd.url = "";
    };

}