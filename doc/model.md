# Number Play - model description

This document is a high-level description of the model used in PhET's _Number Play_ simulation.

## Ten Screen

## Twenty Screen

## Compare Screen

## Game Screen

The **Game** screen contains two games: the 'Counting' game and the 'Subitize' game. On the level selection screen:
* Counting games are the top row of buttons, Subitize games are the bottom row of buttons. 
* Level 1 for each game type is the left column of buttons, Level 2 is the right column of buttons. 

A challenge in each game displays a random number of objects to the user and a range of numbered buttons that can be pressed to indicate
the user's choice of the number of objects. A challenge is incomplete until the user presses the button with 
the number that matches the number of objects. When the correct answer button is pressed, the 'New Challenge' button
(rectangular right arrow button) appears that loads a new challenge when pressed.

### Counting

The 'Counting' game builds on the **Ten**, **Twenty**, and **Compare** screens by using a simpler version of the
"counting areas" from those screens. Just like on those screens, the counting areas display the objects in a variety of 
representations, and allow the user to move the objects around. The game also uses the 'Ten Frame' representation from
the **Ten** and **Twenty** screens. Both levels show a representation of a number by alternating between objects in a 
counting area and a ten frame.

In Level 1, objects in the counting area are shown in the "ungrouped" state, where they do not
have card backgrounds and cannot be combined with other objects. 

In Level 2, the objects are shown in the "grouped" state. The size of each group is randomly chosen from the divisors
2, 5, and 10, and the remainder is placed on an additional card.

### Subitize

The 'Subitize' game uses the objects from the previous screens, as well as adding a "dot", but introduces a new 
interface that only displays the objects for 0.5 seconds at a time. The 'Reveal' button (square eye button)
appears when the objects are hidden so the user may press it to see them again. If three incorrect answers have been 
submitted, the time that objects are shown increases by 0.1 second, and continues to do so for each additional incorrect
answer.

In Level 1, the objects can be shown in a random arrangement or a predetermined shape.

In Level 2, the objects are grouped in a structured, grid-like arrangement that is randomly generated.

### Summary
 
Here is a summary of the ranges of each game and level:

Game | Level | Minimum Number | Maximum Number |
--- | --- | --- | --- |
Counting | 1 | 1 | 10 |
Counting | 2 | 11 | 20 |
Subitize | 1 | 1 | 5 |
Subitize | 2 | 6 | 10 |

Since the challenges in both levels of each game are randomly generated, all levels can be played endlessly.
One star is awarded per challenge that is successfully completed on the first try. On the 'Subitize' game,
pressing the 'Reveal' button does not disqualify the user from getting a first-try star.

