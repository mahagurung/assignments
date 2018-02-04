package flexbox;

import javax.swing.JFrame;

public abstract class View extends JFrame {

    protected Controller controller;

    public View(String title) {
        super(title);
        initComponents();
    }

    // Method to connect view to the controller
    public void setController(Controller c) {
        this.controller = c;
    }

    /*
    The following steps needs to be done in initComponents abstract method.
        Set GUI Layout
        instantiate GUI components and other instance variables
        add GUI components to the content pane
    */
    abstract void initComponents();
}