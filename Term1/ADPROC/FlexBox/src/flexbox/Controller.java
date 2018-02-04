package flexbox;

import java.util.*;

public class Controller {

    /* BEGIN app wide constant value declarations */
    public enum PRINTING_OPTIONS {
        NO,
        ONE,
        TWO
    }

    private enum BOX_TYPE {
        ONE,
        TWO,
        THREE,
        FOUR,
        FIVE,
        INVALID
    }

    public static HashMap<String, Double> cardCost = new HashMap<>();
    static {
        cardCost.put("1",0.50);
        cardCost.put("2",0.60);
        cardCost.put("3",0.72);
        cardCost.put("4",0.90);
        cardCost.put("5",1.40);
    }

    public static final double extraSealable = 0.08;
    public static final double extraOneColorPrinting = 0.13;
    public static final double extraTwoColorPrinting = 0.16;
    public static final double extraReBottom = 0.14;
    public static final double extraReCorners = 0.10;
    /* END */

    private OrderFormWindow ofw;
    private InvoiceWindow iw;
    private Model model;

    public Controller() {
        initializeApp();
    }

    private void initializeApp() {
        //Create the View objects
        ofw = new OrderFormWindow();
        iw = new InvoiceWindow();
        model = new Model();

        // Connect View objects with self
        ofw.setController(this);
        iw.setController(this);

        // Start both the windows and show only the OrderFormWindow
        // OrderFormWindow
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                ofw.setVisible(true);
            }
        });

        //InvoiceWindow
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                iw.setVisible(false);
            }
        });
    }

    private BOX_TYPE findBoxType(final double length, final double height, final double width,
                                 final String grade, final PRINTING_OPTIONS cp, final boolean st,
                                 final boolean rb, final boolean rc) {
        // Convert grade to integer for comparison
        Integer intGrade = Integer.parseInt(grade);

        if ((1 <= intGrade && intGrade <= 3) && cp == PRINTING_OPTIONS.NO && !rb && !rc) {
            return BOX_TYPE.ONE;
        } else if ((1 <= intGrade && intGrade <= 4) && cp == PRINTING_OPTIONS.ONE && !rb && !rc) {
            return BOX_TYPE.TWO;
        } else if ((2 <= intGrade && intGrade <= 5) && cp == PRINTING_OPTIONS.TWO && !rb && !rc) {
            return BOX_TYPE.THREE;
        } else if ((2 <= intGrade && intGrade <=5) && cp == PRINTING_OPTIONS.TWO && rb && !rc) {
            return BOX_TYPE.FOUR;
        } else if ((3 <= intGrade && intGrade <= 5) && cp == PRINTING_OPTIONS.TWO && rb && rc) {
            return BOX_TYPE.FIVE;
        } else {
            // Invalid
            return BOX_TYPE.INVALID;
        }
    }

    public void addOrder(final double length, final double height, final double width,
                         final String grade, final PRINTING_OPTIONS cp, final boolean st,
                         final boolean rb, final boolean rc, final int num) throws InvalidInputException {

        BOX_TYPE bType = findBoxType(length, height, width, grade, cp, st, rb, rc);

        switch (bType) {
            case ONE:
                model.addOrder(new BoxTypeOne(height, width, length, grade, cp, rb, rc, st, num));
                break;
            case TWO:
                model.addOrder(new BoxTypeTwo(height, width, length, grade, cp, rb, rc, st, num));
                break;
            case THREE:
                model.addOrder(new BoxTypeThree(height, width, length, grade, cp, rb, rc, st, num));
                break;
            case FOUR:
                model.addOrder(new BoxTypeFour(height, width, length, grade, cp, rb, rc, st, num));
                break;
            case FIVE:
                model.addOrder(new BoxTypeFive(height, width, length, grade, cp, rb, rc, st, num));
                break;
            case INVALID:
                // throw the invalidBox exception
                throw new InvalidInputException("Sorry, we are not able to supply this order.");
        }

    }

    public void generateInvoice() throws InvalidInputException {
        ArrayList<OrderDetails> orders = model.getOrderArray();

        double invoiceCost = 0.0;
        int counter = 1;
        StringBuilder invoice = new StringBuilder("Invoice\n\n");

        if (orders.size() > 0) {
            // Process the orders
            for (OrderDetails order: orders) {
                // Calculate cost
                order.calculateCost();

                // Generate the invoice text
                invoice.append(String.format("Order %d\n", counter));
                invoiceCost += order.cost;
                invoice.append(order.toString());
                invoice.append("\n");
                counter++;
            }

            invoice.append(String.format("Total payable: $%.2f", invoiceCost));

            // Update the InvoiceWindow text area
            iw.setInvoiceTextArea(invoice.toString());

            // Hide OrderFormWindow and show InvoiceWindow
            ofw.setVisible(false);
            iw.setVisible(true);

        } else {
            throw new InvalidInputException("Please add your order before generating the invoice");
        }

    }

    public void removeAllOrders() {
        model.resetOrderArray();
    }

    public void resetEverything() {
        initializeApp();
    }
}