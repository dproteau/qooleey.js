define(['chai', 'qooleey'],
    function (chai, qooleey) {
        "use strict";

        var expect = chai.expect;

        var cbcNews = function () {
            var breakingNewsChannel = {
                name: 'Breaking News Channel',
                tenLatest: [],
                newBreakingNews: function (bn) {}
            };
            var nationalNewsChannel = {
                name: 'National News Channel',
                tenLatest: []
            };

            return {
                breakingNewsChannel: breakingNewsChannel,
                nationalNewsChannel: nationalNewsChannel
            };
        };

        var SomeSubscriber = function (name) {
            this.name = name;
        };
        SomeSubscriber.prototype.newsNotifier = function (news) {
            return this.name + ' is new aware of: ' + news;
        };


        describe('qooleey', function () {
            describe('makePublisher', function () {

                describe('when getting an emptyish object to extend', function () {

                    it('should ignore undefined object to extend', function () {
                        var objToExtend = undefined;
                        qooleey.makePublisher(objToExtend);
                        expect(objToExtend).to.be.undefined;
                    });

                    it('should ignore null object to extend', function () {
                        var objToExtend = null;
                        qooleey.makePublisher(objToExtend);
                        expect(objToExtend).to.be.null;
                    });

                    it('should extend an empty object', function () {
                        var objToExtend = {};
                        qooleey.makePublisher(objToExtend);
                        expect(objToExtend.subscribers.length).to.be.equal(0);
                        expect(objToExtend.addSubscriber).not.to.be.undefined;
                        expect(objToExtend.removeSubscriber).not.to.be.undefined;
                        expect(objToExtend.publish).not.to.be.undefined;
                    });

                });

                describe('when making 2 publishers', function () {

                    it('should have isolated subscribers list', function () {
                        var objToExtend1 = {};
                        var objToExtend2 = {};
                        var someSubscriber = new SomeSubscriber("Bob");

                        qooleey.makePublisher(objToExtend1);
                        qooleey.makePublisher(objToExtend2);

                        objToExtend1.addSubscriber(someSubscriber.newsNotifier, someSubscriber);

                        expect(objToExtend1.subscribers.length).to.be.equal(1);
                        expect(objToExtend2.subscribers.length).to.be.equal(0);
                    });


                });

                describe('when extending an object and setting an auto-publish method', function () {
                    var andrew,
                        cn;

                    beforeEach(function () {
                        cn = cbcNews();

                        andrew = new SomeSubscriber('Andrew');
                    });

                    it('should not set the auto-publish decorator when the autoPublishName is not a method of the SUT', function () {
                        qooleey.makePublisher(cn.breakingNewsChannel, 'newMissingMethod');
                        cn.breakingNewsChannel.addSubscriber(andrew.newsNotifier, andrew);

                        expect(cn.breakingNewsChannel['newMissingMethod']).to.be.undefined;
                    });

                    it('should not set the auto-publish decorator when the autoPublishName is only a property of the SUT', function () {
                        qooleey.makePublisher(cn.breakingNewsChannel, 'name');
                        cn.breakingNewsChannel.addSubscriber(andrew.newsNotifier, andrew);

                        expect(Object.prototype.toString.call(cn.breakingNewsChannel['name'])).to.be.equal('[object String]');
                    });

                    it('should automatically publish', function () {
                        var message = 'Elvis Found Alive on an Island in the Pacific Ocean!';
                        var spy = sinon.spy(cn.breakingNewsChannel, 'newBreakingNews');

                        qooleey.makePublisher(cn.breakingNewsChannel, 'newBreakingNews');
                        cn.breakingNewsChannel.addSubscriber(andrew.newsNotifier, andrew);

                        cn.breakingNewsChannel.newBreakingNews(message);

                        expect(spy.calledOnce, 'newBreakingNews calledOnce').to.be.true;
                        expect(spy.calledWith(message), 'newBreakingNews calledWith message').to.be.true;
                    });

                    it('should automatically publish the same "message" to every subscribers', function () {
                        var message = 'Elvis Found Alive on an Island in the Pacific Ocean!';
                        var spy = sinon.spy(andrew, 'newsNotifier');

                        qooleey.makePublisher(cn.breakingNewsChannel, 'newBreakingNews');
                        cn.breakingNewsChannel.addSubscriber(andrew.newsNotifier, andrew);

                        cn.breakingNewsChannel.newBreakingNews(message);

                        expect(spy.calledOnce, 'newsNotifier calledOnce').to.be.true;
                        expect(spy.calledWith(message), 'newsNotifier calledWith message').to.be.true;
                    });

                });

            });

            describe('addSubscriber', function () {
                describe('when adding a subscriber', function () {
                    var andrew,
                        cn;

                    beforeEach(function () {
                        cn = cbcNews();
                        qooleey.makePublisher(cn.breakingNewsChannel);

                        andrew = new SomeSubscriber('Andrew');

                    });

                    it('should increase the subscribers count by one', function () {
                        cn.breakingNewsChannel.addSubscriber(andrew.newsNotifier, andrew);

                        expect(cn.breakingNewsChannel.subscribers.length).to.be.equal(1);
                    });

                    it('should be able to find the object in the subscribers list', function() {
                        cn.breakingNewsChannel.addSubscriber(andrew.newsNotifier, andrew);

                        expect(cn.breakingNewsChannel.subscribers[0].subscriber).to.be.equal(andrew);
                    });

                    it('should publish to it', function () {
                        var message = "Elvis Found Alive on an Island in the Pacific Ocean!";
                        var spy = sinon.spy(andrew, "newsNotifier");
                        cn.breakingNewsChannel.addSubscriber(andrew.newsNotifier, andrew);

                        cn.breakingNewsChannel.publish(message);

                        expect(spy.calledOnce).to.be.true;
                        expect(spy.calledWith(message)).to.be.true;
                    });

                    it('should be able to remove it', function () {
                        var subscrbrId = cn.breakingNewsChannel.addSubscriber(andrew.newsNotifier, andrew);

                        cn.breakingNewsChannel.removeSubscriber(subscrbrId);
                        expect(cn.breakingNewsChannel.subscribers.length).to.be.equal(0);
                    });

                });

            });

            describe('removeSubscriber', function () {
                describe('when there are many subscribers', function () {
                    var someSubscriber,
                        subs,
                        names = ['Andrew', 'Bob', 'Cameron'],
                        cn;

                    var isIdContainedIn = function (subscriberList, id) {
                        var i = 0;
                        for(;i < subscriberList.length; i++) {
                            if(subscriberList[i].id === id){
                                return true;
                            }
                        }
                        return false;
                    };
                    beforeEach(function () {
                        cn = cbcNews();
                        qooleey.makePublisher(cn.breakingNewsChannel);

                        subs = {};
                        for(var i = 0; i < names.length; i++){
                            someSubscriber = new SomeSubscriber(names[i]);
                            subs[names[i]] = someSubscriber;
                            subs[names[i] + 'Id'] = cn.breakingNewsChannel.addSubscriber(someSubscriber.newsNotifier, someSubscriber);
                        }

                    });

                    it('should remove the right subscriber by its id', function () {
                        cn.breakingNewsChannel.removeSubscriber(subs[names[1] + 'Id']);

                        expect(isIdContainedIn(cn.breakingNewsChannel.subscribers, subs[names[0] + 'Id']), 'Andrew is in the subscribers array').to.be.true;
                        expect(isIdContainedIn(cn.breakingNewsChannel.subscribers, subs[names[1] + 'Id']), 'Bob is missing').to.be.false;
                        expect(isIdContainedIn(cn.breakingNewsChannel.subscribers, subs[names[2] + 'Id']), 'Cameron is in the subscribers array').to.be.true;
                    });

                })


            });

        });

});
