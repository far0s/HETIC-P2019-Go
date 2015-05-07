# HETIC-P2019-Go

## The project

We have 6 weeks (May-June) to create a Go game, using every technology we want (mostly HTML/CSS/JS), in the form of a web-application.

## The team

is composed of four 1st year students at HETIC :
- Sébastien DANCER-MICHEL
- Ronan FOURREAU
- Bastien BERGAGLIA
- Louis-Victor MORGAUT

## Roadmap

Primary and high-priority functionnalities to add :
- The app can save a save into a "partie.txt" file
- The app can load a save from a "partie.txt" file
- The app allows player against player game
- The app allows player againt AI game
- Implement basic Go rules
- Score count
- Identify end-game and winner/loser

"partie.txt" : 
for 9x9 goban, there will be 10 lignes (9+1) with 9 characters on each line except last line, which will have only one character.
The 9 first lines represents le saved goban with ' ' (spaces)
For an intersection without stone, 'N' black stones and 'b' for white stones
The last line only contains 'n' or 'b' depending of whose turn it is.
