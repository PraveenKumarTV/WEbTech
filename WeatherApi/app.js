var app=angular.module("WeatherApp",[]);
app.controller("Wctrl",['$scope','$http',function($scope,$http){
    $scope.city='';
    $scope.weatherData=null;
    const apiKey="665a26335661e6b4e444edf5903ec02e";
    $scope.getWeather=function(){
        const url=`https://api.openweathermap.org/data/2.5/weather?q=${$scope.city}&appid=${apiKey}&units=metric`;
        $http.get(url).then(function(response){
            $scope.weatherData=response.data;
        },function(error){
            alert("Could not get data");
            $scope.weatherData=null;
        });
    };
}]);
app.directive("weatherCard",function(){
    return{
        restrict:'E',
        scope:{
            data:'='
        },
        template:
        `<div class="weather-card">
            <h2>{{data.name}},{{data.sys.country}}</h2>
            <p>Temperature: {{data.main.temp}}°C</p>
            <p>Weather: {{data.weather[0].description}}</p>
            <p>Humidity: {{data.main.humidity}}%</p>
            <p>Wind Speed: {{data.wind.speed}} m/s</p>
        </div>`
    };
});