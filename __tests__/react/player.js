jest.dontMock('../../lib/react/player.jsx')
    .dontMock('lodash');

var React = require('react/addons');
var Player = require('../../lib/react/player.jsx');
var TestUtils = React.addons.TestUtils;

var cards = [
  {value: 'A', suit: 'Heart'},
  {value: '2', suit: 'Heart'},
  {value: '3', suit: 'Heart'},
  {value: '4', suit: 'Heart'},
  {value: '5', suit: 'Heart'},
  {value: '6', suit: 'Heart'},
  {value: '7', suit: 'Heart'},
  {value: '8', suit: 'Heart'},
  {value: '9', suit: 'Heart'},
  {value: '10', suit: 'Heart'},
  {value: 'J', suit: 'Heart'},
  {value: 'Q', suit: 'Heart'},
  {value: 'K', suit: 'Heart'}
];

// Since the component only renders what it's given, enforces turn order
// and doesn't do much else, there's not a whole lot we can test here.
describe('a player\'s hand', function() {
  it('displays everything passed in props', function() {

    var playerHand = TestUtils.renderIntoDocument(
      <Player order={[2, 3, 4, 1]} number={1} cards={cards} points={0} />
    );

    var cardsInHand = TestUtils.scryRenderedDOMComponentsWithClass(playerHand, 'card');
    expect(cardsInHand.length).toEqual(13);

    var label = TestUtils.findRenderedDOMComponentWithTag(playerHand, 'h5');
    expect(label.getDOMNode().textContent).toEqual('Player 1  - 0 points')
  });
});