angular
    .module('legal')
    .controller('mainController', mainController);

function mainController( $scope, $http, uiGridConstants) {
	///////////////////
	//Utilities
	///////////////////
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
	function search(key,value, myArray){
		//console.log(myArray)
	    for (var i=0; i < myArray.length; i++) {
			if (myArray[i][key] === value) {
				return myArray[i];
			}
		}
	}
	
	//////// End Utilities
	
	//////////////////////
	//Init
	//////////////////////
	$scope.firmCount = '';
	$scope.flags = {'flag1':false, 'flag2':false,'flag3':false};
	$scope.rowIsSelected = false;
	$scope.selectedRow = {};
	$scope.selectedFirmId = 0;
	$scope.researchSessionData = {};
	$scope.make_new_firm_show = false;
	
	/////////////////// End Init
	$scope.someProp = 'abc',
		$scope.showMe = function(){
                   alert($scope.someProp);
                };
	
	var firmInspectGridColumnDefs = [
		{name : "firmid"},
		{name : "name", width: "20%"},
		{name : "website"},
		{name : "HQ_City"},
		{name : "HQ_State"},
		{name : "contacts", type: "number", filters:makeNumericFilters()},
		{name : "dayssince", type: "number", filters:makeNumericFilters()},
		{name : "score", type: "number", filters:makeNumericFilters()},
		{name : "tier", width: "8%"},
		{name : "teamid",displayname:"team", width: "8%"},
		{name : "Flagged"},
		{name: "Edit",
            cellTemplate:'<button class="btn-block btn-success" ng-click="grid.appScope.showMe()">Edit</button>',
			enableSorting: false			}
	];
	
	$scope.toggleShowAddNewFirms = function(){
		$scope.make_new_firm_show = !$scope.make_new_firm_show;
	};
	

	
	$scope.firmInspectGridData = {
		columnDefs: firmInspectGridColumnDefs,
		enableFiltering: true,
		enableGridMenu: true,
		exporterMenuCsv: true,
		enableRowSelection: true,
		multiSelect : false,
		enableFullRowSelection : true,
		onRegisterApi: function( gridApi ){
			//console.log(gridApi);
			gridApi.selection.on.rowSelectionChanged($scope,function(row){

			//console.log($scope.gridApi.selection.getSelectedRows());
			var sel_rows = $scope.gridApi.selection.getSelectedRows();
			
			if(sel_rows.length > 0)
			{
				$scope.rowIsSelected = true;
				$scope.selectedRow = sel_rows[0];
				$scope.selectedFirmId = $scope.selectedRow.firmid;
				$scope.getFirmNotes($scope.selectedFirmId, function(data){$scope.firmNotesGridData.data = data;console.log("update my notes");});
			    //$scope.firmNotesGridData.columnDefs = columnDefs2;
				$scope.flags = {'flag1':false, 'flag2':false,'flag3':false};
				$scope.getFirmFlags($scope.selectedFirmId, 
					function(data){
						$scope.flags['flag1'] = search('flagtype',1,data) ? 1 : 0; 
						$scope.flags['flag2'] = search('flagtype',2,data) ? 1 : 0; 
						$scope.flags['flag3'] = search('flagtype',3,data) ? 1 : 0; 
						if($scope.flags['flag1'])
							$scope.flags['flag1_date'] = search('flagtype',1,data)['datetime']; 
						if($scope.flags['flag2'])
							$scope.flags['flag2_date'] = search('flagtype',2,data)['datetime'];
						if($scope.flags['flag3'])
							$scope.flags['flag3_date'] = search('flagtype',3,data)['datetime'];						
						console.log("update my flags");
						
					});
				$scope.getFirmResearchSessions($scope.selectedFirmId,
					function(data){
						$scope.researchSessionData = data;
						console.log(data);
						console.log("update my research sessions");
					});
			}
			else {
				$scope.rowIsSelected = false;
				$scope.firmNotesGridData.data = [];
				$scope.flags = {'flag1':false, 'flag2':false,'flag3':false};
				$scope.researchSessionData = {};
				console.log("flags cleared");
			}
			});
			
			gridApi.core.on.rowsRendered( $scope, function() {
				$scope.filteredRowCount = $scope.getFilteredRows().length;
			});
			
			$scope.gridApi = gridApi;
			$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
			},
		data: []};
    //$scope.firmInspectGridData.data = mockdata;
	

	
	//////////////////////
	//Firm Notes Grid
	//////////////////////
	var firmNotesGridColumnDefs = [
		{name : "noteid", width:"10%"},
		{name : "userid", width: "10%"},
		{name : "text"},
		{name : "datetime", width: "15%"}
	];
	
	$scope.firmNotesGridData = {
		columnDefs: firmNotesGridColumnDefs,
		enableFiltering: false,
		enableGridMenu: false,
		exporterMenuCsv: true,
		enableRowSelection: true,
		multiSelect : false,
		enableFullRowSelection : true,
		data: []};
		
	////End Firm Notes Grid
	
	//////////////////////
	//Firm Locks Grid
	//////////////////////
	var firmLocksGridcolumnDefs = [
		{name : "Firmid"},
		{name : "Firm Name"},
		{name : "Userid"},
		{name : "User"},
		{name : "Team"},
		{name : "Date"}
	];
	
	$scope.firmLocksGridData = {
		columnDefs: firmLocksGridcolumnDefs,
		enableFiltering: false,
		enableGridMenu: false,
		exporterMenuCsv: true,
		enableRowSelection: true,
		multiSelect : false,
		enableFullRowSelection : true,
		data: []};
		
	////End Firm Notes Grid
	
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
			$scope.firmInspectGridData.columnDefs = firmInspectGridColumnDefs;
			$scope.firmCount = data.length;
            //console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        })};

//    $scope.clickSearchFirmsButton = function(searchFirm) { 
//        if(searchFirm.length < 1)
//        {
//            return;
//        }
//
//        $http.get('/searchFirms/' + searchFirm )
//        .success(function(data) {
//            $scope.firmInspectGridData.data = data;
//			$scope.firmInspectGridData.columnDefs = columnDefs1;
//			$scope.firmCount = data.length;
//            //console.log(data);
//        })
//        .error(function(data) {
//            console.log('Error: ' + data);
//        })};
	
	$scope.getFirmResearchSessions = function(firmid, callback)  {
		$http.get('/getFirmRS/' + firmid )
        .success(function(data) {
			//$scope.firmCount = data.length;
            //console.log("notes"+data);
			callback(data);
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
	
	$scope.addFirmNote = function() {
		if(!($scope.noteadd && $scope.noteadd.note.length > 1))
        {
            return;
        }

        var tosend = {"firmid" : $scope.selectedFirmId, "text" : $scope.noteadd.note};
		console.log('Incoming Note: ' + tosend);
        $http.post('/addNote', tosend)
        .success(function(data) {
            $scope.firmaddresult = "Successfully added note" + $scope.noteadd.note;
			$scope.getFirmNotes($scope.selectedFirmId, function(data){$scope.firmNotesGridData.data = data;console.log("update my notes");});
			$scope.noteadd.note = "";
        })
        .error(function(data) {
            $scope.firmaddresult = "Failed to add note " + $scope.noteadd.note;

        })

        $scope.reset();
		
	};
	
	
	$scope.getFirmFlags = function(firmid, callback) {
		
        $http.get('/getFirmFlags/' + firmid )
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
	
		if($scope.firmadd && $scope.firmadd.name){
			$scope.firmadd.name = "";
		}
		if($scope.firmadd && $scope.firmadd.url){
			$scope.firmadd.url = "";
		}
		$scope.make_new_firm_show = false;
    };
	
	//Get page ready on refresh
	$scope.clickGetFirmsButton();

}