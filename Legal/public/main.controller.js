angular
    .module('legal')
    .controller('mainController', mainController);

function mainController( $scope, $http) {
    $scope.nameForLegalSearch = "";
    // when landing on the page, get all todos and show them
    $scope.clickGetFirmsButton = function() { $http.get('/retrieveFirms')
        .success(function(data) {
            $scope.firms = data;
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
            $scope.searchFirms = data;
            console.log(data);
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