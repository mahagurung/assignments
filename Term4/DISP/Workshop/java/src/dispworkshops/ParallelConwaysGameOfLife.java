package dispworkshops;

/**
 *
 * @author vishnu
 */
import java.awt.*;
import javax.swing.*;

import java.util.concurrent.CyclicBarrier;

public class ParallelConwaysGameOfLife extends Thread {

    final static int P = 256; // Setting this to values higher than the number of cores might slow your computer down
    final static int N = 256;
    final static int CELL_SIZE = 4;
    final static int DELAY = 1000;
    static int [][] state = new int [N][N];
    static int [][] sums = new int [N][N];
    final static int B = N/P; // block size

    static Display display = new Display();

    static CyclicBarrier barrier = new CyclicBarrier(P);

    int me;

    public static void gameOfLife() throws Exception {

        // Define initial state of Life board
        for(int i = 0; i < N; i++) {
            for(int j = 0; j < N; j++) {
                state [i] [j] = Math.random() > 0.5 ? 1 : 0;
            }
        }

        display.repaint();
        pause();

        ParallelConwaysGameOfLife [] threads  = new ParallelConwaysGameOfLife[P];

        for (int me = 0; me < P; me++) {
            threads[me] = new ParallelConwaysGameOfLife(me);
            threads[me].start();
        }

        for (int me = 0; me < P; me++) {
            threads[me].join();
        }

    }

    public ParallelConwaysGameOfLife(int me) {
        this.me = me;
    }

    public void run() {

        int begin = me * B;
        int end = begin + B;

        // Main update loop.
        int iter = 0;

        while(true) {
            if (this.me == 0) {
                System.out.println("iter = " + iter++);
            }

            // Calculate neighbour sums.
            for(int i = begin; i < end; i++) {
                for(int j = 0; j < N; j++) {

                    // find neighbours...
                    int ip = (i + 1) % N;
                    int im = (i - 1 + N) % N;
                    int jp = (j + 1) % N;
                    int jm = (j - 1 + N) % N;

                    sums [i] [j] = state [im] [jm] +
                                    state [im] [ j] +
                                    state [im] [jp] +
                                    state [ i] [jm] +
                                    state [ i] [jp] +
                                    state [ip] [jm] +
                                    state [ip] [ j] +
                                    state [ip] [jp];
                }
            }

            // Wait for all the threads to complete calculation before writing the data
            synch();

            // Update state of board values.
            for(int i = 0; i < N; i++) {
                for(int j = 0; j < N; j++) {
                    switch (sums [i] [j]) {
                        case 2 : break;
                        case 3 : state [i] [j] = 1; break;
                        default: state [i] [j] = 0; break;
                    }
                }
            }

            // Wait for all the threads to write data before proceeding with next iteration
            synch();

            if (this.me == 0) {
                display.repaint();
                pause();
            }
        }
    }

    @SuppressWarnings("serial")
    static class Display extends JPanel {

        final static int WINDOW_SIZE = N * CELL_SIZE;

        Display() {
            setPreferredSize(new Dimension(WINDOW_SIZE, WINDOW_SIZE));
            JFrame frame = new JFrame("Life");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setContentPane(this);
            frame.pack();
            frame.setVisible(true);
        }

        public void paintComponent(Graphics g) {
            g.setColor(Color.BLACK);
            g.fillRect(0, 0, WINDOW_SIZE, WINDOW_SIZE);
            g.setColor(Color.WHITE);

            for(int i = 0; i < N; i++) {
                for(int j = 0; j < N; j++) {
                    if(state [i] [j] == 1) {
                        g.fillRect(CELL_SIZE * i, CELL_SIZE * j,
                                CELL_SIZE, CELL_SIZE);
                    }
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
