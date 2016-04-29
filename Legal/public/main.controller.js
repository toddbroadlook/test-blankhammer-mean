angular
    .module('legal')
    .controller('mainController', mainController);

function mainController( $scope, $http) {
	var columnDefs1 = [
		{name : "firmid"},
		{name : "name"},
		{name : "website"},
		{name : "city"},
		{name : "state"},
		{name : "postalcode"},
		{name : "country"}
	];
	
	$scope.firmCount = '';
	
	$scope.gridData = {
		columnDefs: columnDefs1,
		enableFiltering: true,
		enableGridMenu: true,
		data: []};
    //$scope.gridData.data = mockdata;
    
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