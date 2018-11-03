package dispworkshops;

/**
 *
 * @author vishnu
 */
import java.io.File;
import java.awt.Color;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

public class FourThreadMandelbrot extends Thread {

    final static int N = 4096;
    final static int CUTOFF = 100; 
    static int [] [] set = new int [N] [N];
    int me;

    public static void calculateSet() throws Exception {

        // Calculate set
        long startTime = System.currentTimeMillis();

        FourThreadMandelbrot thread0 = new FourThreadMandelbrot(0);
        FourThreadMandelbrot thread1 = new FourThreadMandelbrot(1);
        FourThreadMandelbrot thread2 = new FourThreadMandelbrot(2);
        FourThreadMandelbrot thread3 = new FourThreadMandelbrot(3);

        thread0.start();
        thread1.start();
        thread2.start();
        thread3.start();

        thread0.join();
        thread1.join();
        thread2.join();
        thread3.join();

        long endTime = System.currentTimeMillis();

        System.out.println("Calculating Mandelbrot Set using four threads");
        System.out.println("Total time: " + (endTime - startTime) + " milliseconds");

        // Plot image
        BufferedImage img = new BufferedImage(N, N, BufferedImage.TYPE_INT_ARGB);

        // Draw pixels
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {

                int k = set [i] [j];

                float level;
                if(k < CUTOFF) {
                    level = (float) k / CUTOFF;
                }
                else {
                    level = 0;
                }
                Color c = new Color(level, level/2, level/2);  // Green
                img.setRGB(i, j, c.getRGB());
            }
        }


        // Print file
        ImageIO.write(img, "PNG", new File("./png/four_thread_mandelbrot.png"));
    }

    public FourThreadMandelbrot(int me) {
        this.me = me;
    }

    public void run() {

        int iBegin, iEnd, jBegin, jEnd;

        // Ugly conditional branch to get i and j's starting and ending values
        if (me == 0 || me == 1) {
            iBegin = 0;
            iEnd = N/2;

            if (me == 0) {
                jBegin = 0;
                jEnd = N/2;
            } else {
                jBegin = N/2;
                jEnd = N;
            }
        } else { // me == 2 or 3
            iBegin = N/2;
            iEnd = N;

            if (me == 2) {
                jBegin = 0;
                jEnd = N/2;
            } else {
                jBegin = N/2;
                jEnd = N;
            }

        }

        for(int i = iBegin; i < iEnd; i++) {
            for(int j = jBegin; j < jEnd; j++) {

                double cr = (4.0 * i - 2 * N) / N;
                double ci = (4.0 * j - 2 * N) / N;

                double zr = cr, zi = ci;

                int k = 0;
                while (k < CUTOFF && zr * zr + zi * zi < 4.0) {

                    // z = c + z * z

                    double newr = cr + zr * zr - zi * zi;
                    double newi = ci + 2 * zr * zi;

                    zr = newr;
                    zi = newi;

                    k++;
                }

                set [i] [j] = k;
            }
        }
    }
}
