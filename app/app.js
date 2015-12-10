'use strict';

// Declare app level module which depends on views, and components
var VideoFeedApp = angular.module('VideoFeedApp', []);

VideoFeedApp.controller('VideoAppCtrl', ['$scope', function($scope) {
    var maxVideos = 4;
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
    }, {
        id: 4,
        name: 'video 4',
        description: 'description 4',
        publishDate: '2015/12/08',
        img: 'url'
    }, {
        id: 5,
        name: 'video 5',
        description: 'description 5',
        publishDate: '2015/12/07',
        img: 'url'
    }];

    $scope.videos = videos.slice(0, maxVideos);

    $scope.feedUrl = '';

    $scope.selectedVideo = videos[0];

}]);
