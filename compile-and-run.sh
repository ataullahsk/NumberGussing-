#!/bin/bash

echo "Compiling Java Number Guessing Game..."
javac NumberGuessingGame.java

if [ $? -eq 0 ]; then
    echo "Compilation successful!"
    echo ""
    echo "Starting the game..."
    echo ""
    java NumberGuessingGame
else
    echo "Compilation failed!"
    exit 1
fi