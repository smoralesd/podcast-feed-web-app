'use strict';

describe('PodcastFeedApp', function() {

    describe('Podcast list', function() {

        beforeEach(function() {
            browser.get('index.html');
        });

        it('should work', function() {

            var podcastList = element.all(by.repeater('podcast in podcasts'));
            expect(podcastList.count()).toBe(4);
        });
    });

});
