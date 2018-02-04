package flexbox;

import javax.swing.*;
import java.awt.event.*;
import static flexbox.Controller.PRINTING_OPTIONS;

public class OrderFormWindow extends View {

    private JButton addButton;
    private JButton clearAllButton;
    private JButton clearButton;
    private JComboBox<String> colorPrintingComboBox;
    private JLabel colorPrintingLabel;
    private JLabel countLabel;
    private JTextField countTextField;
    private JButton genInvoiceButton;
    private JComboBox<String> gradeComboBox;
    private JLabel gradeLabel;
    private JLabel heightLabel;
    private JTextField heightTextField;
    private JLabel lengthLabel;
    private JTextField lengthTextField;
    private JLabel widthLabel;
    private JTextField widthTextField;
    private ButtonGroup reBottomGroup;
    private JLabel reBottomLabel;
    private JRadioButton reBottomNoRadioButton;
    private JRadioButton reBottomYesRadioButton;
    private ButtonGroup reCornerGroup;
    private JLabel reCornerLabel;
    private JRadioButton reCornerNoRadioButton;
    private JRadioButton reCornerYesRadioButton;
    private ButtonGroup sealableTopGroup;
    private JLabel sealableTopLabel;
    private JRadioButton sealableTopNoRadioButton;
    private JRadioButton sealableTopYesRadioButton;
    private final String alertTitle = "FlexBox";

    public OrderFormWindow() {
        super("Order Form");
    }

    @SuppressWarnings("unchecked")
    void initComponents() {
        /* Instantiate components */

        // Labels
        //
        lengthLabel = new JLabel("Length (m)");
        heightLabel = new JLabel("Height (m)");
        widthLabel = new JLabel("Width (m)");
        gradeLabel = new JLabel("Grade");
        colorPrintingLabel = new JLabel("Color Printing");
        reBottomLabel = new JLabel("Reinforced Bottom");
        reCornerLabel = new JLabel("Reinforced Corners");
        sealableTopLabel = new JLabel("Sealable Top");
        countLabel = new JLabel("Number of Boxes");

        // TextFields initialized with 5 columns
        //
        lengthTextField = new JTextField(5);
        heightTextField = new JTextField(5);
        widthTextField = new JTextField(5);
        countTextField = new JTextField(5);

        // Combo boxes
        //
        gradeComboBox = new JComboBox<>();
        gradeComboBox.setModel(new DefaultComboBoxModel<>(new String[]{"1", "2", "3", "4", "5"}));

        colorPrintingComboBox = new JComboBox<>();
        colorPrintingComboBox.setModel(new DefaultComboBoxModel<>(new String[]{"NO COLOR", "ONE COLOR", "TWO COLORS"}));

        // Radio Buttons
        // Initialize radio buttons with a default selection of "No"
        //
        reBottomYesRadioButton = new JRadioButton("Yes", false);
        reBottomNoRadioButton = new JRadioButton("No", true);
        reCornerYesRadioButton = new JRadioButton("Yes", false);
        reCornerNoRadioButton = new JRadioButton("No", true);
        sealableTopYesRadioButton = new JRadioButton("Yes", false);
        sealableTopNoRadioButton = new JRadioButton("No", true);

        // Group the radio buttons
        //
        reBottomGroup = new ButtonGroup();
        reBottomGroup.add(reBottomYesRadioButton);
        reBottomGroup.add(reBottomNoRadioButton);

        reCornerGroup = new ButtonGroup();
        reCornerGroup.add(reCornerYesRadioButton);
        reCornerGroup.add(reCornerNoRadioButton);

        sealableTopGroup = new ButtonGroup();
        sealableTopGroup.add(sealableTopYesRadioButton);
        sealableTopGroup.add(sealableTopNoRadioButton);

        // Buttons
        //
        addButton = new JButton("Add");
        addButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evt) {
                addButtonActionPerformed(evt);
            }
        });

        clearButton = new JButton("Clear");
        clearButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evt) {
                clearButtonActionPerformed(evt);
            }
        });

        clearAllButton = new JButton("Clear All");
        clearAllButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evt) {
                clearAllButtonActionPerformed(evt);
            }
        });

        genInvoiceButton = new JButton("Generate Invoice");
        genInvoiceButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evt) {
                genInvoiceButtonActionPerformed(evt);
            }
        });

        // Create content pane and set layout
        GroupLayout layout = new GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        layout.setHorizontalGroup(
                layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                        .addGroup(layout.createSequentialGroup()
                                .addGap(16, 16, 16)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.TRAILING)
                                        .addComponent(sealableTopLabel)
                                        .addComponent(reCornerLabel)
                                        .addComponent(reBottomLabel)
                                        .addComponent(colorPrintingLabel)
                                        .addComponent(gradeLabel)
                                        .addComponent(widthLabel)
                                        .addComponent(heightLabel)
                                        .addComponent(lengthLabel)
                                        .addComponent(countLabel))
                                .addGap(37, 37, 37)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                                        .addComponent(lengthTextField, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE)
                                        .addComponent(heightTextField, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE)
                                        .addComponent(widthTextField, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE)
                                        .addComponent(gradeComboBox, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE)
                                        .addComponent(colorPrintingComboBox, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE)
                                        .addGroup(layout.createSequentialGroup()
                                                .addComponent(reBottomYesRadioButton)
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addComponent(reBottomNoRadioButton))
                                        .addGroup(layout.createSequentialGroup()
                                                .addComponent(reCornerYesRadioButton)
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addComponent(reCornerNoRadioButton))
                                        .addGroup(layout.createSequentialGroup()
                                                .addComponent(sealableTopYesRadioButton)
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                .addComponent(sealableTopNoRadioButton))
                                        .addComponent(countTextField, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE))
                                .addContainerGap(GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                        .addGroup(GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                                .addContainerGap(79, Short.MAX_VALUE)
                                .addComponent(clearAllButton)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(clearButton)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(addButton)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(genInvoiceButton)
                                .addContainerGap())
        );
        layout.setVerticalGroup(
                layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                        .addGroup(layout.createSequentialGroup()
                                .addGap(9, 9, 9)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.BASELINE)
                                        .addComponent(lengthLabel)
                                        .addComponent(lengthTextField, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.BASELINE)
                                        .addComponent(heightLabel)
                                        .addComponent(heightTextField, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE))
                                .addGap(12, 12, 12)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.BASELINE)
                                        .addComponent(widthTextField, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE)
                                        .addComponent(widthLabel))
                                .addGap(17, 17, 17)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                                        .addComponent(gradeLabel)
                                        .addComponent(gradeComboBox, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE))
                                .addGap(18, 18, 18)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                                        .addComponent(colorPrintingLabel)
                                        .addComponent(colorPrintingComboBox, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE))
                                .addGap(18, 18, 18)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                                        .addComponent(reBottomLabel)
                                        .addGroup(layout.createParallelGroup(GroupLayout.Alignment.BASELINE)
                                                .addComponent(reBottomYesRadioButton)
                                                .addComponent(reBottomNoRadioButton)))
                                .addGap(18, 18, 18)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.BASELINE)
                                        .addComponent(reCornerLabel)
                                        .addComponent(reCornerYesRadioButton)
                                        .addComponent(reCornerNoRadioButton))
                                .addGap(18, 18, 18)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.BASELINE)
                                        .addComponent(sealableTopLabel)
                                        .addComponent(sealableTopYesRadioButton)
                                        .addComponent(sealableTopNoRadioButton))
                                .addGap(18, 18, 18)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.BASELINE)
                                        .addComponent(countLabel)
                                        .addComponent(countTextField, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.BASELINE)
                                        .addComponent(genInvoiceButton)
                                        .addComponent(addButton)
                                        .addComponent(clearButton)
                                        .addComponent(clearAllButton))
                                .addContainerGap(GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        pack();
    }

    private void clearAllButtonActionPerformed(ActionEvent evt) {
        // Clear current form
        clearCurrentForm();

        // Clear the order details array
        controller.removeAllOrders();
    }

    private void clearButtonActionPerformed(ActionEvent evt) {
        // Clear all the text fields and radio button selections
        clearCurrentForm();
    }

    private void clearCurrentForm() {
        /*
        /  Reset all the text fields to empty
        /  Reset all the Radio buttons to default
        /  Reset combo boxes to default value
        */
        lengthTextField.setText("");
        widthTextField.setText("");
        heightTextField.setText("");
        countTextField.setText("");
        gradeComboBox.setSelectedIndex(0);
        colorPrintingComboBox.setSelectedIndex(0);
        reBottomNoRadioButton.setSelected(true);
        reBottomYesRadioButton.setSelected(false);
        reCornerNoRadioButton.setSelected(true);
        reCornerYesRadioButton.setSelected(false);
        sealableTopNoRadioButton.setSelected(true);
        sealableTopYesRadioButton.setSelected(false);
    }

    private void addButtonActionPerformed(ActionEvent evt) {
        captureFormDataAndUpdateController();
    }

    private void sendFormDataToController(final double length, final double height, final double width,
                                          final String grade, final PRINTING_OPTIONS cp, final boolean st,
                                          final boolean rb, final boolean rc, Integer num) {
        // Send form data to Controller
        try {
            controller.addOrder(length, height, width, grade, cp, st, rb, rc, num);
            clearCurrentForm();
            showOrderConfirmation();
        } catch (InvalidInputException e) {
            handleInvalidInput(e.getMessage());
        }
    }

    private void captureFormDataAndUpdateController() {

        // Capture the form data
        boolean valid = true;
        double height = 0.0;
        double length = 0.0;
        double width = 0.0;
        int num = 0;

        try {
            height = Double.parseDouble(heightTextField.getText());
            length = Double.parseDouble(lengthTextField.getText());
            width = Double.parseDouble(widthTextField.getText());
            num = Integer.parseInt(countTextField.getText());

            if ((num <= 0) || (height <= 0.0) || (length <= 0.0) || (width <= 0.0)) {
                throw new InvalidInputException("Invalid input: Box dimensions and count must be greater than 0");
            }
        } catch (NumberFormatException e) {
            valid = false;
            handleInvalidInput("Invalid input: Please check the values.");
        }
        catch (InvalidInputException e) {
            valid = false;
            handleInvalidInput(e.getMessage());
        }

        // Proceed with sending data to controller only if input data is valid
        if (valid) {
            String grade = (String) gradeComboBox.getSelectedItem();

            PRINTING_OPTIONS cp;
            switch ((String) colorPrintingComboBox.getSelectedItem()) {
                case "NO COLOR":
                    cp = PRINTING_OPTIONS.NO;
                    break;
                case "ONE COLOR":
                    cp = PRINTING_OPTIONS.ONE;
                    break;
                case "TWO COLORS":
                    cp = PRINTING_OPTIONS.TWO;
                    break;
                default:
                    cp = PRINTING_OPTIONS.NO;
                    break;
            }
            
            boolean st = sealableTopYesRadioButton.isSelected();

            boolean rb = reBottomYesRadioButton.isSelected();

            boolean rc = reCornerYesRadioButton.isSelected();

            sendFormDataToController(length, height, width, grade, cp, st, rb, rc, num);
        }
    }

    private void genInvoiceButtonActionPerformed(ActionEvent evt) {

        try {
            // Ask Controller to generate invoice and show the invoice window
            controller.generateInvoice();

            // Clear the form
            clearCurrentForm();
        }
        catch (InvalidInputException e) {
            handleInvalidInput(e.getMessage());
        }
    }

    private void handleInvalidInput(String message) {
        // Pop the error message up
        JOptionPane.showMessageDialog(this, message, alertTitle, JOptionPane.WARNING_MESSAGE);
    }

    private void showOrderConfirmation() {
        // Show an order added successfully popup
        String message = "Order added successfully";
        JOptionPane.showMessageDialog(this, message, alertTitle, JOptionPane.INFORMATION_MESSAGE);
    }
}