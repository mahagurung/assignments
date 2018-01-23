# Analysis of the problem
The goal of the exercise is to store 10 years worth of 5 min interval sensor readings in such a way that lookups can be done efficiently. One main charactersitic of the given data is that the storage requirements are constant. ie we know that the data is for 10 years and every year has 12 months. The number of days in every month is known and so is the total number of readings per sensor per day (One reading per 5 mins - 288 readings per sensor per day).  
Looking at the questions that needs to be solved, we can see that a common requirement is the ability to get the value, given a sensor type and date (year, month and/or day). It is also needed in some scenerios that we need the exact time stamp when the reading was taken. Values like maximum, average and total can be calculated along with inserts to avoid redundant linear parsing of sensor readings hence the proposed data structure should support this. While searching or sorting the readings, we also need to consider the fact that there could be duplicates and have to choose search and sort algorithms that can handle duplicates. Some cases we might also need to come up with custom algorithms to find max values including duplicates.

# Proposed Data Structures
Since the keys of the input data (Year, Month, Day, Sensor Type) are pre-known and definite, one of the best options to store these data is hashmaps.  
For example:  
READINGS[2016][2][14][T] = (Object of class data structure for temperature readings on 14th February 2016)  

Details of various hashmaps implementation are explained below.
## Year
yearHashmap = [0,1,2.....9]  

For the yearHashmap a simple modular hashing function with a linear collision resolution can be used on an array of 10 elements. 
```
h(k) = k mod m
```
where k = year and m = 10.  
Ex: h(2016) = 2016 mod 10 = 6  

Each element in the yearHashmap is an object of monthHashmap.  
```
yearHashmap[2016] = new monthHashmap  
```
//Insert a diagram

## Month
monthHashmap = [0,1,....12]  

The monthHashmap uses an array of size 13, with a hashing function where index is equal to the  numeric value of the month. The output of this hashing function is always unique, hence there is no need for a collision resolution function. monthHashmap[0] is set to null so that the actual index begins from 1 and goes upto 12.  
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
Each element in the monthHashmap is a daysArray.  
```
monthHashmap[APR] = new day_array[]
```
//Insert a diagram

## Day  
daysArray = []
  
The daysArray is an array of sensorHashmap values. The size of the array is 32 with all values initialized to null. For ease of processing index 0 will alway be null.  
```  
daysArray[] = [NULL, sensorHashmap, sensorHashmap.............]  
```
//Insert a diagram  

## Sensor
Since we know the number of sensor types, data sets per sensor can also be stored in a hashmap. The hashing function takes the sensor type as an input and returns the index.  
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

## Daily readings
The goal in the design of data set for daily readings are to do the following actions efficiently:  
1) Insert new item
2) Find the max value(s) including duplicates along with the timestamp
3) Find average value
4) Find total

Max value(s), average and total can be calculated or updated along with insert. Average and total can be stored as integers. However we need some special considerations for storing the max values.  

It is a requirement that we not only need the maximum values but also the time associated with the values. We know that readings are taken every 5 mins and that makes total 288 readings per day. If we get the values sorted by time and store these values in an array of size 289 (ie index 0 - 288) starting from index 1, the nth item will be the reading at (n * 5)th minute.  
In short given an index n, we can find the time as below.
```
totalMinutes = n * 5  
hours = INTEGER(totalMinutes / 60)  
minutes = INTEGER(totalMinutes mod 60)  
```
For example:  
readings[15] is the reading at 75th minutes and the time will be 01:15.  

The calculation can be reversed to find the reading for a specific time as follows.  
```
totalMinutes = (hours * 60) + minutes
n = totalMinutes / 5
value = readings[n]
```

Since we can easily find the value and time from the index of the item in the sensor readings array, the max values can be represented as an array of their indices in the senso readings array.  

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
- Return total readings
- Return average reading
- Find time given an index
- Find index given a time
  
#### Pseudo Code:  
```
class DailyReadings():
  int maxIndices = []  
  float average = 0.0
  float total = 0.0
  float readings = []

  function insertRecord():
    readings.push(value)

    lastIndex = readings.length - 1 
    
    if maxIndices.length > 0:
      currentMax = readings[maxIndices[0]]  // Get the value at current max index

      if readings[lastIndex] > currentMax:
        maxIndices = [lastIndex]          // Re-initialize the max indices array with lastIndex as the only member
      else if readings[lastIndex] == currentMax:
        maxIndices.push(lastIndex)   // Push lastIndex to maxIndices array if value is equal to the max value (duplicate)
      end if
    else:
      maxIndices.push[lastIndex]         // If max indices array is empty add this one.
    end if

    total += value
    average =  total / (readings.length - 1)
  end function

  function findTimeFromIndex(index):
    //Assuming that time is the string representation of HH:MM in 24 hours format
    
    totalMinutes = index * 5
    hour = INTEGER(totalMinutes / 60)
    minutes = INTEGER(totalMinutes % 60)

    return hour + ":" + minutes
  end function

  function findIndexFromTime(hours, minutes):
    totalMinutes = (hours * 60) + minutes
    index = totalMinutes / 5
    return index
  end function

  function getMaxIndices():
    return maxIndices
  end function

  function getMax():
    //Return the numeric max value (no duplicates)
    if maxIndices.length > 0:
      return readings[maxIndices[0]]
    else:
      return NULL
    end if

  function getAverage():
    return average
  end function

  function getTotal():
    return total
  end function

  function getValueAtIndex(index):
    return readings[index]
  end function

  function getValueAtTime(hours, minutes):
    index = findIndexFromTime(hours, minutes)
    return getValueAtIndex(index)
  end function

end class
```
// Insert a class diagram  

# Algorithms
## 1. The maximum wind speed of a specified month and year.
Input: Integer year, String month  
Output: Integer windSpeed  

Pseudo Code:
```
function getMaxWindSpeed(year, month):
  max = 0

  for index 1 to 31:
    day = READINGS[year][month][index]

    if day not NULL:
      dayMax = day[S].getMax()
      if dayMax > max:
        max = dayMax
      end if
    end if
  end for

  return max

end function
```

## 2. The median wind speed of a specified year.

## 3. Average wind speed for each month of a specified year in the order of month
Input: Integer year  
Output: Array of Integers averageWindSpeed (sorted in the order of month)  

Pseudo Code:
```
function getAverageWindSpeed(year)
  averageWindSpeed = []
  for month in JAN FEB MAR APR JUN JUL AUG SEP OCT NOV DEC:
    monthAverageTotal = 0
    numberOfDays = 0

    for index 1 to 31:
      day = READINGS[year][month][index]

      if day not NULL:
        numberOfDays = numberOfDays + 1
        monthAverageTotal = monthAverageTotal + day[S].getAverage // getAverage is a method in daily readings class
      end if
    end for

    monthAverage = monthAverageTotal / numberOfDays          // sum of averages == average of sums
    averageWindSpeed.push(monthAverage)
  end for

  return averageWindSpeed
end function
```

## 4. Total solar radiation for each month of a specified year in a descending order of the solar radiation.
Input: Integer year  
Output: Array of Integers totalSolarRadiation (sorted descending order)  


## 5. Given a date, show the times for the highest solar radiation for that date, including duplicates, displayed in reverse chronological order.

# Conclusion

## Space and time requirement
