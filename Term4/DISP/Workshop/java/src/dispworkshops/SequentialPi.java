/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dispworkshops;

/**
 *
 * @author vishnu
 */
public class SequentialPi {

    int numSteps;

    SequentialPi(int numSteps) {
        this.numSteps = numSteps;
    }

    public void calculatePi() {
        long startTime = System.currentTimeMillis();
        //int numSteps = 10_000_000;
        double step = 1.0 / (double) this.numSteps;

          double sum = 0.0;

          for(int i = 0 ; i < this.numSteps ; i++){
              double x = (i + 0.5) * step ;
              sum += 4.0 / (1.0 + x * x);
          }

          double pi = step * sum ;
          long endTime = System.currentTimeMillis();

          System.out.println("Calculate value of pi sequentially");
          System.out.println("Number of steps: " + this.numSteps);
          System.out.println("Value of pi: " + pi);
          System.out.println("Total time: " + (endTime - startTime) + " milliseconds");
    }
}
