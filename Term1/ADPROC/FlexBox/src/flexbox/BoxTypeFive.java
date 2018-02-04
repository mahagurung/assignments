package flexbox;

import static flexbox.Controller.extraSealable;
import static flexbox.Controller.extraTwoColorPrinting;
import static flexbox.Controller.extraReBottom;
import static flexbox.Controller.extraReCorners;

public class BoxTypeFive extends OrderDetails {
    public BoxTypeFive(final double height, final double width, final double length, final String grade,
                       final Controller.PRINTING_OPTIONS printing,
                       final Boolean bottom, final Boolean corners, final Boolean top, final int num) {
        super(height, width, length, grade, printing, bottom, corners, top, num);
    }

    public void calculateCost() {
        double totalCost;
        double totalArea = this.surfaceArea();
        double baseCost = totalArea * Controller.cardCost.get(this.grade);

        // Apply sealable top pricing if applicable
        if (sealableTop) {
            totalCost = baseCost + (baseCost * extraSealable);
        } else {
            totalCost = baseCost;
        }

        // Apply extra for two color printing
        totalCost += (baseCost * extraTwoColorPrinting);

        // Apply extra for reinforced bottom
        totalCost += (baseCost * extraReBottom);

        // Apply extra for reinforced corners
        totalCost += (baseCost * extraReCorners);

        cost = totalCost * count;
    }
}