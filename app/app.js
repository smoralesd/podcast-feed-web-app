'use strict';

// Declare app level module which depends on views, and components
var VideoFeedApp = angular.module('VideoFeedApp', []);

VideoFeedApp.controller('VideoAppCtrl', ['$scope', function($scope) {
    var videos = [{
        id: 1,
        name: 'video 1',
        description: 'description 1',
        publishDate: '2015/12/11',
        img: 'url',
        active: 'active'
    }, {
        id: 2,
        name: 'video 2',
        description: 'description 2',
        publishDate: '2015/12/10',
        img: 'url'
    }, {
        id: 3,
        name: 'video 3',
        description: 'description 3',
        publishDate: '2015/12/09',
        img: 'url'
    }];

    $scope.videos = videos;

    $scope.feedUrl = '';

    $scope.selectedVideo = videos[0];

}]);


