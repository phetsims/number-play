# Number Play - model description

This document is a high-level description of the model used in PhET's _Number Play_ simulation.

## Ten Screen

The _Ten_ screen displays five representations of the same number that can all be individually hidden. They are the "
Word", "Total", "Ten Frame", "Ones", and "Objects". Interactive representations are Total, Ones, and Objects, and
non-interactive representations are Word and Ten Frame. Changing the current number with any of the interactive
representations updates all of the other representations to match.

In the upper left corner, the Word accordion box represents the current number as a written word. If a second language
is added using the Second Language option in the Preferences dialog, a toggle switch appears that can be used to switch
the word representation to the second language.

To the left of the Word accordion box is the speech synthesis button, which reads aloud the current number on the screen
in the selected language and voice. The primary and secondary language and voice can be set in the Preferences dialog.
The Preferences dialog also has a setting to automatically hear the total as it updates.

In the top center of the screen is the Total accordion box, which displays the current number in numerical form. The
arrow buttons can be used to increase or decrease the current number.

In the upper right corner, the Ten Frame accordion box represents the current number as a ten frame.

On the lower left side of the screen is the Ones accordion box, which represents the current number in “Paper Ones.”
Ones can be combined (or added together) by overlapping them, and split apart (or subtracted by one) by grabbing the
handle at the top of the paper. The user can change the current number using Ones by adding more (either by dragging
them out of the creator panel or pressing the up arrow button) or removing them (either by returning them to the creator
panel or pressing the down arrow button).

On the lower right side of the screen is the Objects accordion box, which represents the current number as a display of
objects.The user can choose between dogs, apples, butterflies, and beach balls. The Objects can be combined, split
apart, increased, or decreased using the same interactions as the paper ones. The Objects’ types can be changed using
the radio buttons in the lower right corner of the accordion box.

To the upper left of the Ones accordion box and to the upper right of the Objects accordion box are grid buttons that
correspond to each accordion box. When the button is pressed, the Ones or Objects are split apart and organized into a
grid of singles.

To the right of the Objects accordion box are a group of 3 buttons that determine how Objects can be manipulated. The
first mode keeps all Objects as singles, unable to be combined with other Objects. The second mode allows the Objects to
be combined with other Objects, similar to the behavior of Ones. The third mode keeps the Ones and Objects linked
together, such that corresponding Objects and Ones have matching positions and number values.

## Twenty Screen

The _Twenty_ screen is nearly identical to the _Ten_ screen, while having a maximum total of 20.

## Game Screen

The **Game** screen contains two games: the 'Counting' game and the 'Subitize' game. On the level selection screen:

* Counting games are the top row of buttons, Subitize games are the bottom row of buttons.
* Level 1 for each game type is the left column of buttons, Level 2 is the right column of buttons.

A challenge in each game displays a random number of objects to the user and a range of numbered buttons that can be
pressed to indicate the user's choice of the number of objects. A challenge is incomplete until the user presses the
button with the number that matches the number of objects. When the correct answer button is pressed, the 'New
Challenge' button
(rectangular right arrow button) appears that loads a new challenge when pressed.

### Counting

The 'Counting' game builds on the **Ten**, **Twenty**, and **Compare** screens by using a simpler version of the
"counting areas" from those screens. Just like on those screens, the counting areas display the objects in a variety of
representations, and allow the user to move the objects around. The game also uses the 'Ten Frame' representation from
the **Ten** and **Twenty** screens. Both levels show a representation of a number by alternating between objects in a
counting area and a ten frame.

In Level 1, objects in the counting area are shown in the "ungrouped" state, where they do not have card backgrounds and
cannot be combined with other objects.

In Level 2, the objects are shown in the "grouped" state. The size of each group is randomly chosen from the divisors 2,
5, and 10, and the remainder is placed on an additional card.

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

| Game     | Level | Minimum Number | Maximum Number |
|----------|-------|----------------|----------------|
| Counting | 1     | 1              | 10             |
| Counting | 2     | 11             | 20             |
| Subitize | 1     | 1              | 5              |
| Subitize | 2     | 6              | 10             |

Since the challenges in both levels of each game are randomly generated, all levels can be played endlessly. One star is
awarded per challenge that is successfully completed on the first try. On the 'Subitize' game, pressing the 'Reveal'
button does not disqualify the user from getting a first-try star.

## Lab Screen

The Lab screen is designed to be a flexible space for telling a mathematical story, without any feedback from the
simulation. The representations included are:
Number cards, from 1-20 Symbolic cards (+, –, =)
Ten frames (up to 10 at a time)
Objects (dogs, apples, butterflies, beach balls)
Ones (these can be omitted using the “Show Ones” setting in the Preferences dialog)

Ten frames can contain any of the objects, but only one type of object is allowed per ten frame. 
