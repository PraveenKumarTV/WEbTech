var app=angular.module("MovieTicketBooking",[]);
app.controller("Mctrl",['$scope','$http',function($scope,$http){
    $scope.name1='';
    $scope.genre1='';
    $scope.name2='';
    $scope.genre2='';
    $scope.name3='';
    $scope.movies=[];
     $scope.loadMovies=function(){
        $http.get("http://localhost:3000/movies")
        .then(function(response){
            $scope.movies=response.data;
        },function(error){
            alert("Could not load movies");
        });
    };
    $scope.loadMovies();
    $scope.insertMovie=function(){
        var data={movie:$scope.name1,genre:$scope.genre1};
        $http.post("http://localhost:3000/movies",data)
        .then(function(response){
            alert("Movie Inserted");
            $scope.name1='';
            $scope.genre1='';
            $scope.loadMovies();
        },function(error){
            alert("Could not insert movie");
        });
    };
    $scope.editMovie=function(){
        var data={movie:$scope.name2,genre:$scope.genre2};
        $http.put("http://localhost:3000/movies",data)
        .then(function(response){
            alert("Movie updated");
            $scope.name2='';
            $scope.genre2='';
            $scope.loadMovies();
        },function(error){
            alert("Could not update movie");
        });
    };
    $scope.deleteMovie=function(){
        if(!$scope.name3){
            alert("Please enter movie name to delete");
            return;
        }
        $http.delete("http://localhost:3000/movies?movie="+encodeURIComponent($scope.name3))
        .then(function(response){
            alert("Movie deleted");
            $scope.name3='';
            $scope.loadMovies();
        },function(error){
            alert("Could not delete movie");
        })
    }
   
}])
app.directive('movieDisplay',function(){
    return{
        restrict:'E',
        scope:{
            movie:'='
        },
        template:`
        <div>
            <h4>{{movie.movie}}</h4>
            <p>Genre: {{movie.genre}}</p>
        </div>
        `
    }
})