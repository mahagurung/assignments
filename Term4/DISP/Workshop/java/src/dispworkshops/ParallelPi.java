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
public class ParallelPi {

    int numSteps;
    double step;
    int numThreads;
    int diff;

    ParallelPi(int numSteps, int numThreads) {
        this.numSteps = numSteps;
        this.numThreads = numThreads;
        this.step =  1.0 / (double) numSteps;
        this.diff = numSteps/numThreads;
    }

    private class RunParallelPi extends Thread {

        int begin, end;
        double sum;

        public void run() {
            sum = 0.0;

            for (int i = begin; i < end; i++) {
                double x = (i + 0.5) * step;
                sum += 4.0 / (1.0 + x * x);
            }
        }
    }

    public void calculatePi() throws Exception {
        long startTime = System.currentTimeMillis();
        //long startTime = System.nanoTime();
        double pi = 0.0;
        RunParallelPi[] threadList  = new RunParallelPi[numThreads];

        for (int i = 0; i < this.numThreads; i++) {
            threadList[i] = new RunParallelPi();
            threadList[i].begin = i * diff;
            threadList[i].end = (i * diff) + diff;
            threadList[i].start();
            //System.out.println("Start: "+threadList[i].begin+" End: "+threadList[i].end);
        }

        for (int i = 0; i < numThreads; i++) {
            threadList[i].join();
            pi += step * threadList[i].sum;
        }

        long endTime = System.currentTimeMillis();
        //long endTime = System.nanoTime();

        System.out.println("Calculate value of Pi using multiple threads");
        System.out.println("Number of threads: " + numThreads);
        System.out.println("Number of steps: " + numSteps);
        System.out.println("Value of pi: " + pi);
        System.out.println("Total time: " + (endTime - startTime) + " milliseconds");

    }
}
