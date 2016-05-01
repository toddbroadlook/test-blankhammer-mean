angular
    .module('legal')
    .controller('mainController', mainController);

function mainController( $scope, $http, uiGridConstants) {
	var numeric_filters = [
        {
          condition: uiGridConstants.filter.GREATER_THAN,
          placeholder: 'gt>'
        },
        {
          condition: uiGridConstants.filter.LESS_THAN,
          placeholder: 'lt<'
        }];
	
	var columnDefs1 = [
		{name : "firmid"},
		{name : "name"},
		{name : "website"},
		{name : "city"},
		{name : "state"},
		{field : "contacts", filters:numeric_filters},
		{name : "dayssince"},
		{name : "score"},
		{name : "tier"},
		{name : "teamid"}
	];
	
	$scope.firmCount = '';
	
	
	$scope.gridData = {
		columnDefs: columnDefs1,
		enableFiltering: true,
		enableGridMenu: true,
		exporterMenuCsv: true,
		onRegisterApi: function( gridApi ){
			//console.log(gridApi);
			$scope.gridApi = gridApi;},
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
            //console.log(data);
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