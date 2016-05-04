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
	
	var columnDefs2 = [
		{name : "noteid"},
		{name : "userid", width: "20%"},
		{name : "text"},
		{name : "datetime"}
	];
	
	$scope.firmCount = '';
	
	
	$scope.firmInspectGridData = {
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

			console.log($scope.gridApi.selection.getSelectedRows());
			var sel_rows = $scope.gridApi.selection.getSelectedRows();
			
			if(sel_rows.length > 0)
			{
				$scope.rowIsSelected = true;
				$scope.selectedRow = sel_rows[0];
				$scope.selectedFirmId = $scope.selectedRow.firmid;
				$scope.getFirmNotes($scope.selectedFirmId, function(data){$scope.firmNotesGridData.data = data;console.log("update my notes");});
			    //$scope.firmNotesGridData.columnDefs = columnDefs2;
				
			}
			else {
				$scope.rowIsSelected = false;
				$scope.firmNotesGridData.data = [];
			}
			});
			

			
			$scope.gridApi = gridApi;
			$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
			},
		data: []};
    //$scope.firmInspectGridData.data = mockdata;
	
	$scope.firmNotesGridData = {
		columnDefs: columnDefs2,
		enableFiltering: false,
		enableGridMenu: false,
		exporterMenuCsv: true,
		enableRowSelection: true,
		multiSelect : false,
		enableFullRowSelection : true,
		data: []};
	
	$scope.rowIsSelected = false;
	$scope.selectedRow = {};
	$scope.selectedFirmId = 0;
	
	
    $scope.getFilteredRows=function(){
		//var _renderedRows = $scope.gridApi.grid.renderContainers.body.renderedRows;
		//$scope.filteredRows=_renderedRows;
		return $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
    };
	
	$scope.getFilteredRowCount= function(){ return $scope.getFilteredRows().length;};
    
    $scope.nameForLegalSearch = "";

	/////////////////////////////
	//Database accessing frontend functions
	/////////////////////////////
    $scope.clickGetFirmsButton = function() { $http.get('/retrieveFirms')
        .success(function(data) {
            //$scope.firms = data;
			$scope.firmInspectGridData.data = data;
			$scope.firmInspectGridData.columnDefs = columnDefs1;
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
            $scope.firmInspectGridData.data = data;
			$scope.firmInspectGridData.columnDefs = columnDefs1;
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
	
	$scope.getFirmNotes = function(firmid, callback) {
		
        $http.get('/getFirmNotes/' + firmid )
        .success(function(data) {
			//$scope.firmCount = data.length;
            //console.log("notes"+data);
			callback(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
    })};

	////////////////////////////////////////////////////

    $scope.reset = function() { 
        $scope.firmadd.name = "";
        $scope.firmadd.url = "";
    };

}