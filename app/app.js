'use strict';

// Declare app level module which depends on views, and components
var VideoFeedApp = angular.module('VideoFeedApp', []);

VideoFeedApp.controller('VideoAppCtrl', ['$scope', 'FeedService', function($scope, FeedService) {

    var MAX_VIDEOS = 4;
    var videos = [];
    var selectedIndex = 0;

    FeedService.getVideos().then(function(_videos) {
        videos = _videos;
        $scope.videos = videos.slice(0, MAX_VIDEOS);

        $scope.selectedVideo = videos[selectedIndex];
        updateVideoList(1, 0);
    });

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

        updateVideoList(previousIndex, selectedIndex);
    }

    var handleUp = function() {
        var previousIndex = selectedIndex--;

        if (selectedIndex <= 0) {
            selectedIndex = 0;
        }

        updateVideoList(previousIndex, selectedIndex);
    }

    var updateVideoList = function(previous, index) {
        $scope.selectedVideo.active = null;
        $scope.selectedVideo = videos[index];
        $scope.selectedVideo.active = 'active';

        if (previous != index) {
            var interval = Math.floor(index / MAX_VIDEOS);
            var initialPosition = interval * MAX_VIDEOS;
            var finalPosition = initialPosition + MAX_VIDEOS;
            $scope.videos = videos.slice(initialPosition, finalPosition);
        }
    }
}]);

VideoFeedApp.factory('FeedService', ['$http', '$sce', function($http, $sce) {
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
            console.log('entries:', entries);

            var videos = entries.map(function(elem) {
                var newVideo = new VideoModel();
                newVideo.parse(elem, $sce);
                return newVideo;
            });

            return Promise.resolve(videos);
        });
    }

    return new FeedService();
}]);

var VideoModel = function() {
    this.name = 'no name';
    this.description = 'no description';
    this.publishedDate = new Date();
    this.videoUrl = null;
};

VideoModel.prototype.parse = function(data, sanitizer) {
    if (data.hasOwnProperty('title')) {
        this.name = data.title;
    }

    if (data.hasOwnProperty('publishedDate')) {
        this.publishedDate = new Date(data.publishedDate);
    }

    if (data.hasOwnProperty('contentSnippet')) {
        // this.description = data.contentSnippet;
        this.description = sanitizer.trustAsHtml(data.contentSnippet);
    }

    if (data.hasOwnProperty('link')) {
        this.videoUrl = data.link;
    }
}

var KEY_VALUES = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    LOWER_J: 74,
    LOWER_K: 75,
    ENTER: 13
};
