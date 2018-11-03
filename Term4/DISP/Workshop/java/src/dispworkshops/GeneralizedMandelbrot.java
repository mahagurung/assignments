package dispworkshops;

/**
 *
 * @author vishnu
 */
  import java.io.File;
  import java.awt.Color;
  import javax.imageio.ImageIO;
  import java.awt.image.BufferedImage;

  public class GeneralizedMandelbrot extends Thread {

      final static int N = 4096;
      final static int CUTOFF = 100; 
      final static int P = 8;

      static int [] [] set = new int [N] [N];

      public static void calculateSet() throws Exception {

          // Calculate set
          long startTime = System.currentTimeMillis();

          GeneralizedMandelbrot [] threads = new GeneralizedMandelbrot[P];

          for (int me = 0; me < P; me++) {
              threads[me] = new GeneralizedMandelbrot(me);
              threads[me].start();
          }

          for (int me = 0; me < P; me++) {
              threads[me].join();
          }

          long endTime = System.currentTimeMillis();

          System.out.println("Calculating Mandelbrot Set using "+P+"  threads in horizontal range");
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
                  Color c = new Color(level, level, level/2);
                  img.setRGB(i, j, c.getRGB());
              }
          }


          // Print file
          ImageIO.write(img, "PNG", new File("./png/generalized_"+P+"_threads_mandelbrot.png"));
      }

      int me;

      public GeneralizedMandelbrot(int me) {
          this.me = me;
      }

      public void run() {

            int b = N/P;
            int begin = me * b;
            int end = begin + b;

            for(int i = begin; i < end; i++) {
              for(int j = 0; j < N; j++) {

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
