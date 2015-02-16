module.exports = function(cards) { // Deal cards according to Hearts rules.
  var totalCards = 52;
  var piles = 4;

  var i = 0;
  while (i < totalCards) {
    for (var j=1; j <= piles; j++) {
      if (i < totalCards) { // Safety check in case of uneven division of total cards into piles.
        cards[i].belongsTo = j;
      }
      i++;
    }
  }

  return cards;
};
