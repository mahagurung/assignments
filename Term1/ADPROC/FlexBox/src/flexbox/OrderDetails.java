package flexbox;

public abstract class OrderDetails {

    protected double height;
    protected double width;
    protected double length;
    protected String grade;
    protected Controller.PRINTING_OPTIONS colorPrinting;
    protected Boolean reBottom;
    protected Boolean reCorners;
    protected Boolean sealableTop;
    protected Integer count;
    protected double cost;

    public OrderDetails(final double height, final double width, final double length, final String grade,
                        final Controller.PRINTING_OPTIONS printing,
                        final Boolean bottom, final Boolean corners, final Boolean top, final int num) {
       this.height = height;
       this.width = width;
       this.length = length;
       this.grade = grade;
       this.colorPrinting = printing;
       this.reBottom = bottom;
       this.reCorners = corners;
       this.sealableTop = top;
       this.count = num;
    }

    protected double surfaceArea() {
        return ((2.0*length*width) + (2.0*length*height) + (2.0*height*width));
    }

    private String generateOrderSummary() {

        StringBuilder summary = new StringBuilder();
        summary.append(String.format("Length: %.2fm\n", length));
        summary.append(String.format("Width: %.2fm\n", width));
        summary.append(String.format("Height: %.2fm\n", height));
        summary.append(String.format("Grade of Card: %s\n", grade));
        summary.append("Color print: ");
        switch (colorPrinting) {
            case NO:
                summary.append("No Color\n");
            break;
            case ONE:
                summary.append("One Color\n");
            break;
            case TWO:
                summary.append("Two Colors\n");
            break;
        }
        summary.append("Reinforced Bottom: " + (reBottom? "Yes" : "No"));
        summary.append("\n");
        summary.append("Reinforced Corners: " + (reCorners? "Yes" : "No"));
        summary.append("\n");
        summary.append("Sealable Tops: " + (sealableTop? "Yes" : "No"));
        summary.append("\n");
        summary.append(String.format("Number of Boxes: %d\n", count));
        summary.append(String.format("Cost: $%.2f\n", cost));
        return summary.toString();
    }

    @Override
    public String toString() {
        return generateOrderSummary();
    }

    // Calculate cost including extras depending on box type
    abstract void calculateCost();
}
