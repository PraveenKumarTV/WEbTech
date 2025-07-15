 var app=angular.module("myapp",[]);
        app.controller("ctrl",function($scope){
            $scope.name="Praveen";
            $scope.num="";
            $scope.f1=function(){
                $scope.num+='1';
            }
            $scope.changeName=function(){
                $scope.name="Soundar";
            }
            $scope.f1=function(digit){
                $scope.num+=digit;
            }
            $scope.clear=function(){
                $scope.num="";
            }
            $scope.add=function(){
                $scope.num+='+';
            }
             $scope.sub=function(){
                $scope.num+='-';
            }
             $scope.mul=function(){
                $scope.num+='*';
            }
             $scope.div=function(){
                $scope.num+='/';
            }
             $scope.mod=function(){
                $scope.num+='%';
            }
            $scope.equal=function(){
                var l=$scope.num.length;
                /*var nums=[];var ops=[];
                var tmp="";
                for(var i=0;i<l;i++){
                    if($scope.num[i]=='+' || $scope.num[i]=='-' || $scope.num[i]=='*' || $scope.num[i]=='/' ||$scope.num[i]=='-'){
                        nums.push(parseInt(tmp));
                        tmp="";ops.push($scope.num[i]);
                    }
                    else tmp+=$scope.num[i];
                }
                nums.push(parseInt(tmp));tmp="";
               var res=nums[0];
               for(var i=0;i<ops.length;i++){
                if(ops[i]=='+'){res+=nums[i];}
                else if(ops[i]=='-'){
                    res-=nums[i];
                }
                else if(ops[i]=='*'){
                    res*=nums[i];
                }
                else if(ops[i]=='/'){
                    res/=nums[i];
                }
                else if(ops[i]=='%'){
                    res=res%nums[i];
                }
               }*/
               $scope.num=eval($scope.num);
            }
        });