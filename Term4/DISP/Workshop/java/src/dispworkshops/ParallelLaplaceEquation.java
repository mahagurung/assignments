package dispworkshops;

/**
 *
 * @author vishnu
 */

import java.awt.*;
import javax.swing.*;
import java.util.concurrent.CyclicBarrier;

public class ParallelLaplaceEquation extends Thread {

    final static int P = 4; // Keep below number of cores
    final static int N = 256;
    final static int B = N/P;
    final static int CELL_SIZE = 2;
    final static int NITER = 1_000_000;
    final static int OUTPUT_FREQ = 1;
    final static int DELAY = 1;

    static float [][] phi = new float [N][N];
    static float [][] newPhi = new float [N][N];

    static Display display = new Display();
    static CyclicBarrier barrier = new CyclicBarrier(P);

    int me;

    public static void calculate() throws Exception {

        // Make voltage non-zero on left and right edges
        for(int j=0; j<N; j++) {
            phi[0][j] = 1.0F;
            phi[N-1][j] = 1.0F;
        }

        display.repaint();
        pause();

        ParallelLaplaceEquation [] threads = new ParallelLaplaceEquation[P];

        long startTime = System.currentTimeMillis();

        for (int me = 0; me < P; me++) {
            threads[me] = new ParallelLaplaceEquation(me);
            threads[me].start();
        }

        for (int me = 0; me < P; me++) {
            threads[me].join();
        }

        long endTime = System.currentTimeMillis();

        System.out.println("Calculation completed in " +
                            (endTime - startTime) + " milliseconds");
    }

    public ParallelLaplaceEquation(int me) {
        this.me = me;
    }

    public void run() {

        int begin = me * B;
        int end = begin + B;

        if (this.me == 0) {
            begin = 1;
        }

        if (this.me == P-1) {
            end = N - 1;
        }

        // Main update loop
        for(int iter=0; iter<NITER; iter++) {

            // Calculate new phi
            for(int i=1; i<N-1; i++) {
                for(int j=1; j<N-1; j++) {

                    newPhi[i][j] = 0.25F * (phi[i][j-1] + phi[i][j+1] +
                                            phi[i-1][j] + phi[i+1][j]);
                }
            }

            // Wait for all the threads to complete calculation
            synch();

            // Update all phi values
            for(int i=1; i<N-1; i++) {
                for(int j=1; j<N-1; j++) {
                    phi[i][j] = newPhi[i][j];
                }
            }

            // Wait for all the threads to write data
            synch();

            if (iter % OUTPUT_FREQ == 0) {
                System.out.println("iter =" + iter);
                display.repaint();
                pause();
            }
        }
    }

    @SuppressWarnings("serial")
    static class Display extends JPanel {

        final static int WINDOW_SIZE = N * CELL_SIZE;

        Display() {
            setPreferredSize(new Dimension(WINDOW_SIZE, WINDOW_SIZE)) ;

            JFrame frame = new JFrame("Laplace");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setContentPane(this);
            frame.pack();
            frame.setVisible(true);
        }

        public void paintComponent(Graphics g) {
            for(int i = 0 ; i < N ; i++) {
                for(int j = 0 ; j < N ; j++) {
                    float f = phi [i] [j] ;
                    Color c = new Color(f, 0.0F, 1.0F - f) ;
                    g.setColor(c) ;
                    g.fillRect(CELL_SIZE * i, CELL_SIZE * j,
                            CELL_SIZE, CELL_SIZE) ;
                }
            } 
        }
    }

    static void synch() {
        try {
            barrier.await();
        } catch(Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }

    static void pause() {
        try {
            Thread.sleep(DELAY);
        } catch(InterruptedException e) {
            e.printStackTrace();
            System.exit(1);
        }
    }

}
