# Analysis of the problem
The goal of the exercise is to store 10 years worth of 5 min interval sensor readings in such a way that lookups can be done efficiently. One main charactersitic of the data that is to be processed is that the storage requirements are constant. ie it is given that the data is for 10 years and every year has 12 months. The number of days in every month is constant (though it changes across months) and so is the total number of readings per sensor per day (One reading per 5 mins - 288 readings per sensor per day). 

A common requirement in the problem set is the ability to get the value, given a sensor type and date (year, month and/or day). One of the questions also asks for the exact time stamp of the reading. 

Values like maximum, average and total can be calculated along with inserts to avoid redundant linear parsing of sensor readings, hence the proposed data structure should support this. The fact that the given data set may contain duplicates has to be considered while searching or sorting the readings and have to choose search and sort algorithms that can handle duplicates.  

Each input file has an year worth of data in chronoligcal order. It is assumed that that files are going to be processed line by line, while inserting various readings to it's proposed data structure.
# Proposed Data Structures
Since the keys of the input data (Year, Month, Day, Sensor Type) are pre-known and definite, one of the best options to store them is hashmaps. Hashmaps lets us do the lookups with constant time complexity, ie O(1).  

For example to get the object of class data structure for Wind Speeds on 2nd February 2014 a single lookup over the hashmaps fetches the required daily reading data structure.  

READINGS\[2014\]\[FEB\]\[2\]\[S\] -> Object of DailyReadings  

The below diagram shows a visualization of the above call with all the data structures included.
![Example data structure layout](./data_structure_layout.svg)

**Implementation details of the hashmaps and other data structures are explained below.**
## Year Hashmap
Data for a year is stored in the *yearHashmap*. Since the data set is smaller (10 entries), a simple modular hashing function with a linear collision resolution can be used on an array of 10 elements.
```
h(k) = k mod m
```
where k = year and m = 10.  
###### Example Hashmap table
| Key | Index |
|-----|:-----:|
|2007 |7
|2008 |8
|2009 |9
|2010 |0
|2011 |1
|2012 |2
|2013 |3
|2014 |4
|2015 |5
|2016 |6

**Element of yearHashmap is an object of monthHashmap.**
```
yearHashmap[2014] -> monthHashmap[]
```
## Month Hashmap
The *monthHashmap* uses a custom hashing function which accepts the 3 letter string representation of month name and output the numeric value of the month. The output of this hashing function is always unique, hence there is no need for a collision resolution function. The size of the array used by this hashmap is 13 and index 0 is pointed to NULL. So that the actual values begins from 1 and goes upto 12.
```
h(JAN) = 1
h(FEB) = 2
h(MAR) = 3
h(APR) = 4
h(MAY) = 5
h(JUN) = 6
h(JUL) = 7
h(AUG) = 8
h(SEP) = 9
h(OCT) = 10
h(NOV) = 11
h(DEC) = 12
```
###### Example Hashmap table
| Key | Index |
|-----|:-----:|
|JAN |1
|FEB |2
|MAR |3
|APR |4
|MAY |5
|JUN |6
|JUL |7
|AUG |8
|SEP |9
|OCT |10
|NOV |11
|DEC |12

**Element of monthHashmap is a daysArray.**
```
monthHashmap[FEB] -> daysArray[]
```
## Days Array
The *daysArray* is an array of *sensorHashmap* values. Use of hashmap here will be redundant and the day number can be used as the index of the array without passing it through a hashing function. The size of the array is 32, indexed (0..31), with all values initialized to NULL.
```
daysArray = [NULL, NULL,...., NULL]
```
Initializing the array elements to NULL helps in handling the varying number of days across months. For example if the daysArray[31] is pointing to NULL, it can be safely assumed that the month has only 30 days. However while looping through the daysArray, we need to keep a separate counter variable to get the actual number of days at the end.
```
SET counter = 0
FOR index IN 1 TO 31:
  IF daysArray[index] NOT NULL:
    SET counter = counter + 1
  ENDIF
ENDFOR
```
**Element of daysArray is a sensorHashmap.**
## Sensor Hashmap
The *sensorHashmap* uses a custom hashing function as well. It takes the sensor type as an input and returns the index.
```
h(QFE) = 0
h(QFF) = 1
h(QNH) = 2
h(DP) = 3
h(EV) = 4
h(RF) = 5
h(RH) = 6
h(ST1) = 7
h(ST2) = 8
h(ST3) = 9
h(ST4) = 10
h(SR) = 11
h(T) = 12
h(S) = 13
h(Dta) = 14
h(Dts) = 15
h(Sx) = 16
```
###### Example Hashmap Table
| Key | Index |
|-----|:-----:|
|QFE |0
|QFF |1
|QNH |2
|DP  |3
|EV  |4
|RF  |5
|RH  |6
|ST1 |7
|ST2 |8
|ST3 |9
|ST4 |10
|SR  |11
|T   |12
|S   |13
|Dta |14
|Dts |15
|Sx  |16

**Element of a sensorHashmap is an object of DailyReadings class**
## Daily Readings
The goal in the design of data set for daily readings is to do the following actions efficiently:  
1) Insert new item  
2) Find the max value(s) including duplicates along with the timestamp  
3) Find average value  
4) Find total

We need to use a *Class Data Structure* to fullfill all these requirements. Daily sensor readings are inserted to an array data field in this class. Max value(s), average and total can be calculated or updated along with insert operation. Average and total are also stored as data fields. However we need some special considerations for storing the max values.  

It is a requirement that we not only need the maximum values but also the time associated with the values. We know that readings are taken every 5 mins and that makes total 288 readings per day. If we get the values sorted by time and store these values in an array of size 289 (ie index 0 - 288) starting from index 1, the nth item will be the reading at (n * 5)th minute.  

In 24 hr format we usually represent time as 00:00 to 23:59. That is the 288th reading in our case should actually be the first reading of the next day. The below algorithm can be tweaked to make it more realistic and support this edge case. However, for the sake of simplicity, we are assuming that the first reading of the day is taken at 00:05 and the last reading at 24:00. Given an index n, we can find the time as below.
```
totalMinutes = n * 5  
hours = INTEGER(totalMinutes / 60)  
minutes = INTEGER(totalMinutes mod 60)  
```
For example:  
readings[15] is the reading at 75th minute or in other words, the time will be 01:15 (24 hr format).  

The calculation can be reversed to find the reading for a specific time as follows.
```
totalMinutes = (hours * 60) + minutes
n = totalMinutes / 5
value = readings[n]
```
Since we can easily find the value and time from the index of the item in the sensor readings array, the max values can be represented as an array of their indices in the sensor readings array.  

A class data structure of the following blue print can be used to store the daily readings.  
#### Data fields 
- Array of values
- Array of indices of max values
- Average
- Total
#### Methods
- Insert new reading
- Return array of readings
- Return max values array
- Return max value
- Return total
- Return average
- Return time given an index
- Return index given a time
#### Pseudo Code:  
```
CLASS DailyReadings():
  SET maxIndices = []  
  SET average = 0.0
  SET total = 0.0
  SET readings = []

  FUNCTION insertRecord(value):
    PUSH value TO readings[]
    SET lastIndex = (length of readings[]) - 1

    IF (length of maxIndices[]) > 0:
      // Get the value at current max index
      SET currentMax = readings[maxIndices[0]]

      IF readings[lastIndex] > currentMax:
        // Re-initialize the maxIndices array with lastIndex as the only member
        SET maxIndices = [lastIndex]
      ELSEIF readings[lastIndex] == currentMax:
        // Push lastIndex to maxIndices array if value is equal to the max value (duplicate)
        PUSH lastIndex TO maxIndices[]
      ENDIF

    ELSE:
      // If max indices array is empty add this one.
      PUSH lastIndex TO maxIndices
    ENDIF

    SET total = total + value
    SET average = total / (length of readings[])
  ENDFUNCTION

  FUNCTION getTimeFromIndex(index):
    //Assuming that time is the string representation of HH:MM in 24 hours format

    SET totalMinutes = index * 5
    SET hour = INTEGER(totalMinutes / 60)
    SET minutes = INTEGER(totalMinutes % 60)

    RETURN hour + ":" + minutes
  ENDFUNCTION

  FUNCTION getIndexFromTime(hours, minutes):
    SET totalMinutes = (hours * 60) + minutes
    SET index = totalMinutes / 5
    RETURN index
  ENDFUNCTION

  FUNCTION getMaxIndices():
    RETURN maxIndices
  ENDFUNCTION

  FUNCTION getMax():
    //Return the numeric max value (no duplicates)
    IF (length of maxIndices) > 0:
      RETURN readings[maxIndices[0]]
    ELSE:
      RETURN NULL
    ENDIF

  FUNCTION getAverage():
    RETURN average
  ENDFUNCTION

  FUNCTION getTotal():
    RETURN total
  ENDFUNCTION

  FUNCTION getValueAtIndex(index):
    RETURN readings[index]
  ENDFUNCTION

  FUNCTION getValueAtTime(hours, minutes):
    SET index = getIndexFromTime(hours, minutes)
    RETURN getValueAtIndex(index)
  ENDFUNCTION

  FUNCTION getReadings():
    RETURN readings[]
  ENDFUNCTION

ENDCLASS
```
# Algorithms
*Complexities are discussed in detail in the conclusion*
## 1. The maximum wind speed of a specified month and year.
Input: Integer year, String month  
Output: Integer windSpeed  
Complexity: Constant, O(1)  

Pseudo Code:
```
FUNCTION getMaxWindSpeed(year, month):
  SET max = 0

  FOR index IN 1 TO 31:
    SET day = READINGS[year][month][index]

    IF day NOT NULL:
      SET dayMax = day[S].getMax()
      IF dayMax > max:
        SET max = dayMax
      ENDIF
    ENDIF
  ENDFOR

  RETURN max

ENDFUNCTION
```
## 2. The median wind speed of a specified year.
Input: Integer year  
Output: Float median  
Complexity: O(n log(n)), where n is the total number of readings per year.  

Pseudo Code:
```
FUNCTION getMedianWindSpeed(year):
  SET windSpeedArray = []

  FOR m IN 1 TO 12:
    SET month = READINGS[year][m]

    FOR d IN 1 TO 31:
      SET day = month[d]

      IF day NOT NULL:
        // getAllReadings() returns the array of daily readings
        JOIN windSpeedArray AND day[S].getAllReadings()
      ENDIF

    ENDFOR

  ENDFOR

  // Sort the windSpeedArray using QuickSort
  SET sortedWindSpeedArray = QuickSort(windSpeedArray)

  IF length of sortedWindSpeedArray is odd:
    SET pivot = (length of sortedWindSpeedArray - 1)/2
    SET median = sortedWindSpeedArray[pivot]
  ELSE:
    SET pivot = (length of sortedWindSpeedArray)/2
    SET median = (sortedWindSpeedArray[pivot - 1] + sortedWindSpeedArray[pivot]) / 2
  ENDIF

  RETURN median

ENDFUNCTION
```
## 3. Average wind speed for each month of a specified year in the order of month
Input: Integer year  
Output: Array of Integers averageWindSpeed  
Complexity: Constant, O(1)  

Pseudo Code:
```
FUNCTION getAverageWindSpeed(year):
  SET averageWindSpeed = []

  FOR month IN (JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC):
    SET monthAverageTotal = 0
    SET numberOfDays = 0

    FOR index 1 TO 31:
      SET day = READINGS[year][month][index]

      IF day NOT NULL:
        SET numberOfDays = numberOfDays + 1
        // getAverage() returns the average value for the day
        SET monthAverageTotal = monthAverageTotal + day[S].getAverage()
      ENDIF
    ENDFOR

    // average of averages == average (since weight is same; 288 readings per day)
    SET monthAverage = monthAverageTotal / numberOfDays
    PUSH monthAverage TO averageWindSpeed[]
  ENDFOR

  RETURN averageWindSpeed
ENDFUNCTION
```

## 4. Total solar radiation for each month of a specified year in a descending order of the solar radiation.
Input: Integer year  
Output: Array of Integers totalSolarRadiation  
Complexity: Linear, O(n).  

Pseudo Code:
```
FUNCTION getTotalSolarRadiation(year):
  SET totalSolarRadiation = []

  FOR month IN (JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC):
    SET monthTotal = 0

    FOR index IN 1 TO 31:
      SET day = READINGS[year][month][index]

      IF day NOT NULL:
        // getTotal() returns the sum of readings per day
        SET monthTotal = monthTotal + day[SR].getTotal()
      ENDIF
    ENDFOR

    // Insert monthTotal into correct position in the array
    FOR index IN 0 TO 11:
      IF totalSolarRadiation[index] IS NULL:
        SET totalSolarRadiation[index] = monthTotal
        BREAKFOR
      ELSEIF monthTotal > totalSolarRadiation[index]:
        PUSH ELEMENTS FROM INDEX UPTO END ONE STEP TO THE RIGHT
        SET totalSolarRadiation[index] = monthTotal
        BREAKFOR
      ENDIF
    ENDFOR

  ENDFOR

  RETURN totalSolarRadiation
ENDFUNCTION
```
## 5. Given a date, show the times for the highest solar radiation for that date, including duplicates, displayed in reverse chronological order.
Input: Integer Year, String Month, Integer Day
Output: String representation of time as HH:MM in 24 hour format
Complexity: Linear, O(n) - where n is the number of duplicates.  

Pseudo Code:
```
FUNCTION getHighestSolarRadiationTimes(year, month, day):

  SET srDailyReadingsInstance = READINGS[year][month][day][SR]

  // getMaxIndices() returns the array of indices of max values
  SET maxReadingsIndices = srDailyReadingsInstance.getMaxIndices()

  // getMaxIndices() method returns the array of indexes sorted in chronological order by default
  FOR index IN (length of maxReadingsIndices - 1) TO 0:
    SET maxReadingIndex = maxReadingsIndices[index]

    // getTimeFromIndex() converts the index to HH:MM string representation
    SET time = srDailyReadingsInstance.getTimeFromIndex(maxReadingIndex)
    PRINT time
  ENDFOR

ENDFUNCTION
```
# Conclusion
Most of the client requirements can be done in constant time complexity because of the way *inserts* are handled and using hashmaps. The insert operation has a linear complexity O(n), where n is the number of readings. The operations like finding max, sum and average which themselves has a linear complexity are done along with the insert. Moreover, the readings are saved as a sorted array. This way, these operations are completely removed from the other algorithms which are called more frequently compared to insert. *Insert is a one time operation, how ever finding the total solar radiation for a month can be repeated multiple times*. By segragating the data across various hashmaps lookups are also done in constant time rather than looping through the entire data.
## Space and time requirement
#####1. The maximum wind speed of a specified month and year.
Though the algorithm loops through the daysArray the relative time complexity can be considered constant as n here is always between 28 and 31. Space complexity is also constant as we compare the daily max value with overall maximum and the same variables are re-used across the loop iterations.
#####2. The median wind speed of a specified year.
To find the median all the values needs to be sorted and saved in one single array. Combining all the readings to one array has a linear complexity O(n) where n is the number of individual arrays. However this is significantly smaller compared to the complexity of the sorting. Even though the quicksort complexity is O(n log(n)), n in this case can go upto 105,120 - the total readings per sensor per year. Hence the overal time complexity is O(n log(n)). This algorithm has a linear space complexity which depends on the number of readings.
#####3. Average wind speed for each month of a specified year in the order of month
The monthHashmap is visited in the order of the months and monthly averages are pushed into the output array in the same order. Hence the output array has been sorted in the required sequence. Since the DailyReadings class object has the average of readings as a data member, getting it has a contant complexity too. The space requirement is linear depending on the number of months with available readings.
#####4. Total solar radiation for each month of a specified year in a descending order of the solar radiation.
Getting the total values can be done in constant complexity, however the results are sorted in place using insertion sort. Hence the algorithm has a time complexity of O(n) and space complexity of O(n).
#####5. Given a date, show the times for the highest solar radiation for that date, including duplicates, displayed in reverse chronological order.
The algorithm loops through the maxIndices array, which is a data member of DailyReadings class. The iterations depends on the number of duplicate values and has a linear complexity, O(n). The maxIndices array is retrieved and stored before processing and the space complexity is also linear.
# References
*M. Goodrich, R. Tamassia & M. Goldwasser, 2014, Data Structures & Algorithms in Java (6th Edition)*
