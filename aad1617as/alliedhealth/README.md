A vanilla JavaScript "template."

This is a work in progress that seeks to
use a simple MVC pattern that "reacts" to events 
by running qualified methods of the controller object. 
A few demo actions are included as examples.

Except for Lea Verou's prefixfree library, which adds
2 objects to the global namespace (the window object),
this template adds only 4 more: 

L, a small personal js library;

m, the model, which holds state variables; 

v, the view, which holds references to all
 elements and objects that have id properties; 

c, the controller, which holds all the methods
for the app. 