'use strict';

// Declare app level module which depends on views, and components
var VideoFeedApp = angular.module('VideoFeedApp', []);

VideoFeedApp.controller('VideoAppCtrl', ['$scope', 'FeedService', function($scope, FeedService) {

    var MAX_VIDEOS = 4;

    FeedService.getVideos().then(function(_videos) {
        console.log('_videos:', _videos);
    });

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

    $scope.videos = videos.slice(0, MAX_VIDEOS);

    var selectedIndex = 0;
    $scope.selectedVideo = videos[selectedIndex];

    $scope.handleKey = function(event) {
        switch (event.keyCode) {
            case KEY_VALUES.LOWER_K:
            case KEY_VALUES.UP:
                handleUp();
                break;
            case KEY_VALUES.LOWER_J:
            case KEY_VALUES.DOWN:
                handleDown();
                break;
            case KEY_VALUES.ENTER:
                console.log('handling enter');
                break;
        }
    }

    var handleDown = function() {
        var previousIndex = selectedIndex++;

        if (selectedIndex >= videos.length) {
            selectedIndex = videos.length - 1;
        }

        $scope.selectedVideo.active = null;
        $scope.selectedVideo = videos[selectedIndex];
        $scope.selectedVideo.active = 'active';

        updateVideoList(previousIndex, selectedIndex);
    }

    var handleUp = function() {
        var previousIndex = selectedIndex--;

        if (selectedIndex <= 0) {
            selectedIndex = 0;
        }

        $scope.selectedVideo.active = null;
        $scope.selectedVideo = videos[selectedIndex];
        $scope.selectedVideo.active = 'active';

        updateVideoList(previousIndex, selectedIndex);
    }

    var updateVideoList = function(previous, index) {
        var interval = Math.floor(index / MAX_VIDEOS);

        if (previous != index) {
            var initialPosition = interval * MAX_VIDEOS;
            var finalPosition = initialPosition + MAX_VIDEOS;
            $scope.videos = videos.slice(initialPosition, finalPosition);
        }
    }
}]);

VideoFeedApp.factory('FeedService', ['$http', function($http) {
    var FeedService = function() {
        this.feeds = {
            'all': 'http://edition.cnn.com/services/podcasting/all/rss.xml',
            'bell ringers club': 'http://rss.cnn.com/services/podcasting/brc/rss',
            'debates': 'http://rss.cnn.com/services/podcasting/CNN-debates/rss.xml'
        };

        this.current = 'debates';
    }

    FeedService.prototype.getCurrentUrl = function() {
        return this.feeds[this.current];
    };

    FeedService.prototype._parseFeed = function() {
        return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(this.getCurrentUrl()));
    };

    FeedService.prototype.getVideos = function() {
        return this._parseFeed().then(function(results) {
            var entries = results.data.responseData.feed.entries;
            return Promise.resolve(entries);
        });
    }

    return new FeedService();
}]);

var KEY_VALUES = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    LOWER_J: 74,
    LOWER_K: 75,
    ENTER: 13
};
