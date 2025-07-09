@echo off
echo Compiling Java Number Guessing Game...
javac NumberGuessingGame.java

if %ERRORLEVEL% EQU 0 (
    echo Compilation successful!
    echo.
    echo Starting the game...
    echo.
    java NumberGuessingGame
) else (
    echo Compilation failed!
    pause
)