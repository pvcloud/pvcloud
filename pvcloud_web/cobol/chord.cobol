
IDENTIFICATION DIVISION.
PROGRAM-ID. HELLO-WORLD.

DATA DIVISION.
WORKING-STORAGE SECTION.
01 Tune1                PIC X(2) VALUE "C".

PROCEDURE DIVISION.
    DISPLAY 'This COBOL procedure provides you the tune combination of a chord for a given base tune'.
    DISPLAY 'No human being has been hurt while creating this procedure - yet -'.
    DISPLAY 'Use it at your own risk. We accept no liability of any kind.'.
    DISPLAY 'Enter your base tune: ' WITH NO ADVANCING
    ACCEPT Tune1
    DISPLAY 'You entered ', Tune1

    IF Tune1 EQUALS 'C' THEN
      DISPLAY "C  | E  | G  | C"
    END-IF
    IF Tune1 EQUALS 'C#' THEN
      DISPLAY "C# | F | G# | C#"
    END-IF
    IF Tune1 EQUALS 'D' THEN
       DISPLAY "D  | F# | A  | D"
    END-IF
    IF Tune1 EQUALS 'D#' THEN
      DISPLAY "D# | G  | A# | D#"
    END-IF
    IF Tune1 EQUALS 'E' THEN
      DISPLAY "E  | G# | B  | E"
    END-IF
    IF Tune1 EQUALS 'F' THEN
      DISPLAY "F  | A  | C  | F"
    END-IF
    IF Tune1 EQUALS 'F#' THEN
      DISPLAY "F# | A# | C# | F#"
    END-IF
    IF Tune1 EQUALS 'G' THEN
      DISPLAY "G  | B  | D  | G"
    END-IF
    IF Tune1 EQUALS 'G#' THEN
      DISPLAY "G# | C  | D# | G#"
    END-IF
    IF Tune1 EQUALS 'A' THEN
      DISPLAY "A  | C# | E  | A"
    END-IF
    IF Tune1 EQUALS 'A#' THEN
      DISPLAY "A# | D  | F  | A#"
    END-IF
    IF Tune1 EQUALS 'B' THEN
      DISPLAY "B  | D# | F# | B"
    END-IF
    STOP RUN.

