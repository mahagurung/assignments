package dispworkshops;

/**
 *
 * @author vishnu
 */
public class DISPWorkshops {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // Calculate pi using single thread
        try {
/* Workshop 13
            SequentialPi seqPi = new SequentialPi(10_000_000);
            seqPi.calculatePi();
            System.out.println();
            ParallelPi twoThreadPi = new ParallelPi(10_000_000, 2);
            twoThreadPi.calculatePi();
            System.out.println();
            ParallelPi fourThreadPi = new ParallelPi(10_000_000, 4);
            fourThreadPi.calculatePi();
            System.out.println();
            SequentialPi seqMoreStepsPi = new SequentialPi(100_000_000);
            seqMoreStepsPi.calculatePi();
            System.out.println();
            ParallelPi twoThreadMoreStepsPi = new ParallelPi(100_000_000, 2);
            twoThreadMoreStepsPi.calculatePi();
            System.out.println();
            ParallelPi fourThreadMoreStepsPi = new ParallelPi(100_000_000, 4);
            fourThreadMoreStepsPi.calculatePi();
            System.out.println();
            ParallelPi eightThreadMoreStepsPi = new ParallelPi(100_000_000, 8);
            eightThreadMoreStepsPi.calculatePi();
            System.out.println();
            ParallelPi sixteenThreadMoreStepsPi = new ParallelPi(100_000_000, 16);
            sixteenThreadMoreStepsPi.calculatePi();
            */

/* Workshop 14
            SequentialMandelbrot.calculateSet();
            TwoThreadMandelbrot.calculateSet();
            TwoThreadVerticalMandelbrot.calculateSet();
            FourThreadMandelbrot.calculateSet();
            */

/* Workshop 15
            GeneralizedMandelbrot.calculateSet();
            CyclicMandelbrot.calculateSet();
            SequentialConwaysGameOfLife.gameOfLife();
            BrokenParallelConwaysGameOfLife.gameOfLife();
            */

/* Workshop 16
            ParallelConwaysGameOfLife.gameOfLife();
            SequentialLaplaceEquation.calculate();
            */
            ParallelLaplaceEquation.calculate();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error!");
        }
    }
}
