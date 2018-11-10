package dispworkshops;

/**
 *
 * @author vishnu
 */

import mpi.*;

public class MPJHelloWorld {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws Exception {
        MPI.Init(args);
        int me = MPI.COMM_WORLD.Rank();
        int size = MPI.COMM_WORLD.Size();
        System.out.println("Hi from <" + me + ">");
        MPI.Finalize();
    }
}
