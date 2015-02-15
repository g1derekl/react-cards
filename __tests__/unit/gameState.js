jest.dontMock('lodash')
    .dontMock('../../lib/js/gameState.js')
    .dontMock('../../lib/js/cards.json');

var _ = require('lodash');

var gameState = require('../../lib/js/gameState.js');
var cards = require('../../lib/js/cards.json');

describe('game state logic', function() {
  it('determines the correct starting player', function() {
    var twoOfClubs = _.find(cards, {value: '2', suit: 'Club'});

    twoOfClubs.belongsTo = 3;

    var startingPlayer = gameState.determineStartingPlayer(cards);

    expect(startingPlayer).toEqual(3);
  });

  it('determines the correct turn order given the starting player', function() {
    var firstPlayer = 3;

    var order = gameState.determineOrder(firstPlayer);

    expect(order).toEqual([3, 4, 1, 2]);
  });

  it('determines the correct trick winner given the trick\'s discard', function() {
    var discard = {
      2: {value: '3', suit: 'Club'},
      3: {value: '5', suit: 'Club'},
      4: {value: '7', suit: 'Spade'},
      1: {value: '2', suit: 'Diamond'}
    };

    var trickWinner = gameState.determineTrickWinner(2, discard);

    expect(trickWinner[0]).toEqual(3); // Player that won trick
    expect(trickWinner[1]).toEqual(0); // Amount of points player took
  });

  it('determines the correct trick winner given the trick\'s discard (with non-matching suit)', function() {
    var discard = {
      2: {value: '3', suit: 'Club'},
      3: {value: '5', suit: 'Club'},
      4: {value: '7', suit: 'Spade'},
      1: {value: '2', suit: 'Diamond'}
    };

    var trickWinner = gameState.determineTrickWinner(1, discard);

    expect(trickWinner[0]).toEqual(1); // Player that won trick
    expect(trickWinner[1]).toEqual(0); // Amount of points player took
  });

  it('determines the correct trick winner given the trick\'s discard (with face cards)', function() {
    var discard = {
      2: {value: '2', suit: 'Diamond'},
      3: {value: '5', suit: 'Club'},
      4: {value: '7', suit: 'Spade'},
      1: {value: 'A', suit: 'Diamond'}
    };

    var trickWinner = gameState.determineTrickWinner(1, discard);

    expect(trickWinner[0]).toEqual(1); // Player that won trick
    expect(trickWinner[1]).toEqual(0); // Amount of points player took
  });

  it('determines the correct trick winner given the trick\'s discard (with points)', function() {
    var discard = {
      2: {value: 'Q', suit: 'Spade'},
      3: {value: '5', suit: 'Heart'},
      4: {value: '7', suit: 'Spade'},
      1: {value: '2', suit: 'Diamond'}
    };

    var trickWinner = gameState.determineTrickWinner(1, discard);

    expect(trickWinner[0]).toEqual(1); // Player that won trick
    expect(trickWinner[1]).toEqual(14); // Amount of points player took
  });

  it('tabulates points correctly at the end of a hand', function() {
    var pointsHand = {1: 5, 2: 21, 3: 0, 4: 0};

    var pointsTotal = gameState.addHandToPoints(pointsHand, {1: 4, 2: 4, 3: 4, 4: 14});

    expect(pointsTotal[1]).toEqual(9);
    expect(pointsTotal[2]).toEqual(25);
    expect(pointsTotal[3]).toEqual(4);
    expect(pointsTotal[4]).toEqual(14);
  });

  it('tabulates points correctly at the end of a hand (with shooting the moon)', function() {
    var pointsHand = {1: 0, 2: 26, 3: 0, 4: 0};

    var pointsTotal = gameState.addHandToPoints(pointsHand, {1: 4, 2: 4, 3: 4, 4: 14});

    expect(pointsTotal[1]).toEqual(30);
    expect(pointsTotal[2]).toEqual(4);
    expect(pointsTotal[3]).toEqual(30);
    expect(pointsTotal[4]).toEqual(40);
  });
});