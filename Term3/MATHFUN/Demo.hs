module Demo
where

import SolLecturerRating
import TestDatabase
import Text.Printf

--
-- Demo function to test basic functionality (without peristence - i.e.
-- testDatabase doesn't change and nothing is saved/loaded to/from file.
--

demo :: Int -> IO ()
demo 1 = do
  putStrLn "Database before adding lecturer"
  putStrLn $ showAllLecturers testDatabase
  let newDatabase = addNewLecturer "100132" "Matt Anderson" 2015 testDatabase
  putStrLn "Added a new lecturer to the database"
  putStrLn $ showAllLecturers newDatabase
demo 2 = do
  putStrLn "Show all lecturers in the database"
  putStrLn $ showAllLecturers testDatabase
demo 3 = do
  putStrLn "Lecturers who joined in 2006"
  let newDatabase = selectLecturersByYear 2006 testDatabase
  putStrLn $ showAllLecturers newDatabase
demo 4 = do
  putStrLn "Lecturers with a rating of 7 or higher"
  let newDatabase = selectLecturersByRating 7.0 testDatabase
  putStrLn $ showAllLecturers newDatabase
demo 5 = do
  putStrLn "Average rating of all lecturers joined in 2007"
  putStrLn $ printf "%.2f" (showAvgRatingForAllLecturers 2007 testDatabase)
demo 6 = do
  putStrLn "Lecturers rated by student 200054"
  putStrLn $ showLecturersRatedByStudent "200054" testDatabase
demo 7 = do
  putStrLn "Update rating for lecturer 100131 by student 200098 to 8"
  let newDatabase = rateLecturer "200098" 8 "100131" testDatabase
  putStrLn $ showAllLecturers newDatabase
demo 8 = do
  putStrLn "Lecturers joined between 2003 and 2005 inclusive"
  let newDatabase = selectAndSortLecturersByYearRange 2003 2005 testDatabase
  putStrLn $ showAllLecturers newDatabase
demo _ = putStrLn "Problem statement not defined"
