# Analysis of the problem

# Proposed Data Structures
If we split the whole data by year - month, day and sensor type counts and values are pre-known across individual year. For example, each year has 12 months and each month has 28-31 days depending on the month. Same is the case for sensor types. By making use of this fact, we can do all the select operations for a specific date and sensor type with a constant efficiency if we use hashmaps.

For example:
READINGS[2016][2][14][T] = (Object of custom data structure (class) for temperature readings on 14th February 2016)

To select the given date's data set of readings for a specific sensor, a combination of following hashmaps are used.

## Year
year_hashmap = [0,1,2.....9]

For the year_hashmap a simple modular hashing function with a linear collision resolution can be used on an array of 10 elements. Each element in the year_hashmap is an object of month_hashmap. Since we have 10 years worth of data, the array is of size 10. //Describe why modular hash and linear collision resolution//

eg: year_hashmap[2016] = new month_hashmap

//Insert a diagram

## Month
month_hashmap = [0,1,....12]

The month_hashmap uses an array of size 13, with a hashing function where index is equal to the  numeric value of the month. The output of this hashing function is always unique, hence there is no need for a collision resolution function. month_hashmap[0] is set to null so that the actual index begins from 1 and goes upto 12.

Example:
H(JAN) = 1
H(FEB) = 2
H(MAR) = 3
H(APR) = 4
H(MAY) = 5
H(JUN) = 6
H(JUL) = 7
H(AUG) = 8
H(SEP) = 9
H(OCT) = 10
H(NOV) = 11
H(DEC) = 12

Each element in the month_hashmap is an object of day_hashmap.
eg: month_hashmap[APR] = new day_hashmap

//Insert a diagram

## Day
day_hashmap = [0,1,2.......32]

The day_hashmap is an array of size 32 where index 0 always points to null. The hash function returns the day number as index. Each element is the day_hashmap is an object of sensor_hashmap.

eg: day_hashmap[27] = new sensor_hashmap
//Insert a diagram

## Sensor
Since we know the number of sensor types, data sets per sensor can also be stored in a hashmap. The hashing function takes the sensor type as an input and returns the index.

Example:
H(QFE) = 0
H(QFF) = 1
H(QNH) = 2
H(DP) = 3
H(EV) = 4
H(RF) = 5
H(RH) = 6
H(ST1) = 7
H(ST2) = 8
H(ST3) = 9
H(ST4) = 10
H(SR) = 11
H(T) = 12
H(S) = 13
H(Dta) = 14
H(Dts) = 15
H(Sx) = 16

## Daily readings
The goal in the design of data set for daily readings are to do the following actions efficiently:
1) Find the max and/or min values 
2) Find average value
3) Find the time associated with any given value
4) Find the value for a given time
5) Insert new items
6) Find the highest values including duplicates

We need a custom data structure with the following data members and methods:

#### Data members
- Set of values
- Max/min
- Average

#### Methods
- Insert new record
- Find the time of a given value
- Find the value of a given time
- Find the highest value(s) including duplicates in reverse chronological order

Object:
  float max
  float average
  float values[]

  insert_record()
  find_time_from_value()
  find_value_from_time()
  find_highest_order_by_time()

// Insert a class diagram

# Algorithms

## 1. The maximum wind speed of a specified month and year.
Input: Integer year, String month
Output: Integer wind_speed

Pseudo Code:

function get_max_wind_speed(year, month)
  max = 0
  for day in READINGS[year][month]
    current_max = day[S].get_max() // get_max is a method in daily readings class
    if current_max > max
      max = current_max
    end if
  end for
  return max
end function

## 2. The median wind speed of a specified year.

## 3. Average wind speed for each month of a specified year in the order of month
Input: Integer year
Output: Array of Integers avg_wind_speed (sorted in the order of month)

Pseudo Code:

function get_avg_wind_speed(year)
  array_of_avg_wind_speed = []
  for index 1 to 12
    month_sum = 0
    for day in READINGS[year][index]
      month_sum = month_sum + day[S].get_average // get_average is a method in daily readings class
    end for
    month_average = month_sum / READINGS[year][index].length() // sum of averages == average of sums
    array_of_avg_wind_speed.push(month_average)
  end for

  return array_of_avg_wind_speed

## 4. Total solar radiation for each month of a specified year in a descending order of the solar radiation.

## 5. Given a date, show the times for the highest solar radiation for that date, including duplicates, displayed in reverse chronological order.

# Conclusion

## Space and time requirement
