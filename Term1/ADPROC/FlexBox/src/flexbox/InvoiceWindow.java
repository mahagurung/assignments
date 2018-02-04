package flexbox;

import javax.swing.*;
import java.awt.event.*;

public class InvoiceWindow extends View {

    private JButton exitButton;
    private JTextArea invoiceSummaryTextArea;
    private JScrollPane invoiceScrollPane;
    private JButton newOrderButton;

    public InvoiceWindow() {
        super("Invoice");
    }

    @SuppressWarnings("unchecked")
    void initComponents() {

        /* Instantiate Components */

        // Scroll Pane
        invoiceScrollPane = new JScrollPane();

        // Text Area
        invoiceSummaryTextArea = new JTextArea(5,20);
        invoiceSummaryTextArea.setEditable(false);
        invoiceScrollPane.setViewportView(invoiceSummaryTextArea);

        // Buttons
        //
        exitButton = new JButton("Exit");
        exitButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evt) {
                exitButtonActionPerformed(evt);
            }
        });

        newOrderButton = new JButton("New Order");
        newOrderButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evt) {
                newOrderButtonActionPerformed(evt);
            }
        });

        // Create content pane and set layout
        GroupLayout layout = new GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        layout.setHorizontalGroup(
                layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                        .addGroup(layout.createSequentialGroup()
                                .addContainerGap()
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                                        .addComponent(invoiceScrollPane, GroupLayout.DEFAULT_SIZE, 487, Short.MAX_VALUE)
                                        .addGroup(GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                                                .addGap(0, 0, Short.MAX_VALUE)
                                                .addComponent(newOrderButton)
                                                .addPreferredGap(LayoutStyle.ComponentPlacement.RELATED)
                                                .addComponent(exitButton)))
                                .addContainerGap())
        );
        layout.setVerticalGroup(
                layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                        .addGroup(layout.createSequentialGroup()
                                .addContainerGap()
                                .addComponent(invoiceScrollPane, GroupLayout.PREFERRED_SIZE, 358, GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(LayoutStyle.ComponentPlacement.UNRELATED)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.BASELINE)
                                        .addComponent(exitButton)
                                        .addComponent(newOrderButton))
                                .addContainerGap(9, Short.MAX_VALUE))
        );

        pack();
    }

    private void exitButtonActionPerformed(ActionEvent evt) {
        System.exit(0);
    }

    private void newOrderButtonActionPerformed(ActionEvent evt) {
        controller.resetEverything();
    }

    public void setInvoiceTextArea(final String invoice) {
        invoiceSummaryTextArea.setText(invoice);
    }
}
