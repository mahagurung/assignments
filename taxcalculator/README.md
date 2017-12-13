#USAGE:

taxcalculator.py [-h] --file INPUT_CSV

#Testing:

To test, run test_taxcalculator.py with no arguments. It expects the following files to be present in the ./test/ directory.

sample1.csv - Valid input file
sample2.csv - Valid input file
sample3.csv - Valid input file
sample5.csv - Input file with invalid fields
sample6.csv - Inpute file with non-integer value in numeric field
output1.txt - Matching output for sample1.csv
output2.txt - Matching output for sample2.csv
output3.txt - Matching output for sample3.csv

#Requirements
-- python3.x
-- csv
-- argparse
