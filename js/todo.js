angular.module("todo",[])
          .directive("autoFocus",["$timeout",function($timeout){
            return {
              restrict:'A',
              link : function(scope,element,attributes){
                //监听scope中的 item 下的可编辑状态 
                scope.$watch('item.isEditing',function(newValue){
                  //当可编辑状态为真时。调用focus方法（原生方法）
                  if(newValue){
                    //还得等 input显示的时候在调用这个方法 ，什么时候显示呢
                    //可以使用timeout来 改变js代码的执行顺序
                    //使 element.focus()最后执行
                    $timeout(function() {
                      element[0].focus();
                    }, 0);
                  }
                })
              }
            }
          }])
          .controller("todoApp",["$scope",function($scope){
            $scope.taskList = [];

            //将本地存储的 任务列表 拿出来
            getDataFromLocal();
            function getDataFromLocal(){
              if(localStorage.getItem('taskList')){
                $scope.taskList = angular.fromJson(localStorage.getItem('taskList'));
              }
            }
           
            //添加任务列表
            $scope.add = function(e){
              if(e.keyCode == 13){
                //如果输入非空
                if($scope.newTask){
                  //获取输入框中的值
                  $scope.taskList.push({
                    name : $scope.newTask,
                    isCompleted : false, 
                    isEditing : false 
                  })

                  
                  //清空任务文本框中的内容
                  $scope.newTask = "";
                }
              }
            }

            //点击任务前边的复选框改变任务状态 并且改变全选框的状态
            $scope.changeStatus = function(){
              console.log($scope.status)
              for(var i = 0; i < $scope.taskList.length; i++){
                if(!$scope.taskList[i].isCompleted){
                  $scope.status = false;
                  return;
                }
              }
              $scope.status = true;
            }

            //未完成任务的数量
            $scope.unCompletedCount = function(){
              var num = 0;
              //遍历数据
              $scope.taskList.forEach(function(item){
                if(!item.isCompleted){
                  num++;
                }
              })
              return num;
            }

            //默认全选
            $scope.selected = 'All';
            //完成过滤功能
            $scope.filterTask = function(str){
              if(str == 'All'){
                $scope.condition = "";
                $scope.selected = 'All';
              }else if(str == 'Active'){
                $scope.condition = false;
                $scope.selected = 'Active';
              }else if(str == 'Completed'){
                $scope.condition = true;
                $scope.selected = 'Completed';
              }
            }

            //点击删除
            $scope.deleteTask = function(task){
              var index = $scope.taskList.indexOf(task);
              $scope.taskList.splice(index,1);
            }

            //清除完成的任务
            $scope.clearCompleted = function(){
              for(var i = 0; i < $scope.taskList.length; i++){
                if($scope.taskList[i].isCompleted){
                  $scope.taskList.splice(i,1);
                  i--;
                }
              }
            }

            //批量改变任务状态
            $scope.changeAllStatus = function(){
              $scope.taskList.forEach(function(item){
                item.isCompleted = $scope.status;
              })
            }

            //双击修改内容
            $scope.editTask = function (task) {
              for(var i = 0; i < $scope.taskList.length; i++){
                $scope.taskList[i].isEditing = false;
              }
              task.isEditing = true;
            }

            //失去焦点事件
            $scope.onblurmodify = function(task){
              task.isEditing = false;
            }

            //监听数据的变化，当数据发生变化的时候在存到本地里
            //$watch()有三个参数，默认情况下自能监听简单数据类型。当第三个参数为true时
            //$watch就可以深层监听复杂数据类型
            $scope.$watch('taskList',function(newValue){
              //存储到本地存储里
              localStorage.setItem('taskList',angular.toJson($scope.taskList));
            },true)

          }])
