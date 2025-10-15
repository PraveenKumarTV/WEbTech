var app = angular.module("chatApp", []);

app.controller("ctrl", ['$scope', '$http', function($scope, $http) {
    $scope.name = "";
    $scope.msg = "";
    $scope.msgs = [];

    $scope.postMsg = function() {
        if (!$scope.name || !$scope.msg) {
            alert("Please enter name and message.");
            return;
        }

        const obj = { name: $scope.name, msg: $scope.msg };
        $scope.msgs.push(obj); // ✅ This will display in the table

        console.log("Current Messages:", $scope.msgs);

        $http.post("http://localhost:3000/chat", obj).then(function(response) {
            alert("Message sent successfully");
        }, function(error) {
            alert("Error: " + error.statusText);
        });

        $scope.msg = "";
    };
}]);
