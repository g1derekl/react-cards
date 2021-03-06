## **react-cards**

A multiplayer playing cards engine built on React and Websockets

Live demo: http://boxofcards-g1derekl.rhcloud.com/ (Drag cards to move, F to flip and Q/E to rotate.)

Cards made interactive with [Interact.js](http://interactjs.io/)

What works:

 - Creating and connecting to room
 - Moving cards around on the surface
 - Flipping (showing/hiding) cards
 - Live list of connected clients
 - Put moved card on top of pile

To do:

 - Group cards and allow multiple-select and move
 - Easily shuffle cards
 - Position-based POV (players see board differently based on their seating position)
 - Hidden hands (special area for each player where only they can see cards)
 - Chat
 - Hash card values on client to prevent cheating
 - More to come

To run on your own machine:

 - `git clone git@github.com:g1derekl/react-cards.git && cd react-cards`
 - `npm install`
 - `npm start`

ISC License (ISC)

Copyright (c) 2016, Derek Li

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

