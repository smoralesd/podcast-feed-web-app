'use strict';

var PodcastFeedApp = angular.module('PodcastFeedApp', []);

PodcastFeedApp.filter('trusted', ['$sce', function($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    }
}])

PodcastFeedApp.controller('PodcastAppCtrl', ['$scope', 'FeedService', function($scope, FeedService) {

    var MAX_PODCASTS = 4;
    var podcasts = [];
    var selectedIndex = 0;

    FeedService.getPodcasts().then(function(_podcasts) {
        podcasts = _podcasts;
        $scope.podcasts = podcasts.slice(0, MAX_PODCASTS);

        $scope.selectedPodcast = podcasts[selectedIndex];

        updatePodcastsList(1, 0);
    });

    /**
     * To handle the keyboard events
     */
    $scope.handleKey = function(event) {
        switch (event.keyCode) {
            //use k to go down as in vim
            case KEY_VALUES.LOWER_K:
            case KEY_VALUES.UP:
                handleUp();
                break;
            //use j to go up as in vim
            case KEY_VALUES.LOWER_J:
            case KEY_VALUES.DOWN:
                handleDown();
                break;
            case KEY_VALUES.ENTER:
                handleEnter();
                break;
        }
    }

    var handleEnter = function() {
        var podcast = angular.element(document.querySelector('#podcastPlayer'))[0];
        if (podcast.paused) {
            podcast.play();
        } else {
            podcast.pause();
        }
    }

    var handleDown = function() {
        var previousIndex = selectedIndex++;

        if (selectedIndex >= podcasts.length) {
            selectedIndex = podcasts.length - 1;
        }

        updatePodcastsList(previousIndex, selectedIndex);
    }

    var handleUp = function() {
        var previousIndex = selectedIndex--;

        if (selectedIndex <= 0) {
            selectedIndex = 0;
        }

        updatePodcastsList(previousIndex, selectedIndex);
    }

    var updatePodcastsList = function(previous, index) {
        $scope.selectedPodcast.active = null;
        $scope.selectedPodcast = podcasts[index];
        $scope.selectedPodcast.active = 'active';

        if (previous != index) {
            var interval = Math.floor(index / MAX_PODCASTS);
            var initialPosition = interval * MAX_PODCASTS;
            var finalPosition = initialPosition + MAX_PODCASTS;
            $scope.podcasts = podcasts.slice(initialPosition, finalPosition);
        }
    }
}]);

PodcastFeedApp.factory('FeedService', ['$http', '$sce', function($http, $sce) {
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
        //using google api service to parse the rss feed
        return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(this.getCurrentUrl()));
    };

    FeedService.prototype.getPodcasts = function() {
        return this._parseFeed().then(function(results) {
            var entries = results.data.responseData.feed.entries;
            console.log('entries:', entries);

            var podcasts = entries.map(function(elem) {
                var newPodcast = new PodcastModel();
                newPodcast.parse(elem, $sce);
                return newPodcast;
            });

            return Promise.resolve(podcasts);
        });
    }

    return new FeedService();
}]);

var PodcastModel = function() {
    this.name = 'no name';
    this.description = 'no description';
    this.publishedDate = new Date();
    this.url = null;
    this.active = null;
};

PodcastModel.prototype.parse = function(data, sanitizer) {
    if (data.hasOwnProperty('title')) {
        this.name = data.title;
    }

    if (data.hasOwnProperty('publishedDate')) {
        this.publishedDate = new Date(data.publishedDate);
    }

    if (data.hasOwnProperty('contentSnippet')) {
        this.description = sanitizer.trustAsHtml(data.contentSnippet);
    }

    if (data.hasOwnProperty('link')) {
        this.url = data.link;
    }
}

var KEY_VALUES = {
    UP: 38,
    DOWN: 40,
    LOWER_J: 74,
    LOWER_K: 75,
    ENTER: 13
};

