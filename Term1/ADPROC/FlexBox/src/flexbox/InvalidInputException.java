package flexbox;

/*
Thrown when
 - there is no matching type of box for the user input
 - the user input is invalid or wrong
 - generating invoice on empty oder list
 */
public class InvalidInputException extends Exception {
    public InvalidInputException(String message) {
        super(message);
    }
}