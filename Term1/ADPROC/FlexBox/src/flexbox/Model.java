package flexbox;

import java.util.ArrayList;

public class Model {

    private ArrayList<OrderDetails> orders;

    public Model() {
        orders = new ArrayList<>();
    }

    // add new order to the list
    public void addOrder(OrderDetails order) {
        orders.add(order);
    }

    // return orders array
    public ArrayList getOrderArray() {
        return orders;
    }

    // remove all orders added so far
    public void resetOrderArray() {
        orders.clear();
    }
}