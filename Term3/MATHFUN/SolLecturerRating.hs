-- MathFUN Assignment 2
-- Author: UP899753
module SolLecturerRating
where

import Data.List (delete, sortOn)
import Text.Printf

--
-- Types
--

type StaffId = String
type Name = String
type Year = Int
type StudentId = String
type Rating = (StudentId, Int)

data Lecturer = Lecturer StaffId Name Year [Rating]
                  deriving(Eq, Show, Read)

--
-- Helper Functions
--

-- Lecturer StaffId
getStaffId :: Lecturer -> StaffId
getStaffId (Lecturer staffId _ _ _) = staffId

-- Lecturer Name
getName :: Lecturer -> Name
getName (Lecturer _ name _ _) = name

-- Lecturer Year of joining
getYear :: Lecturer -> Year
getYear (Lecturer _ _ year _) = year

-- Lecturer Rating List
getRatingList :: Lecturer -> [Rating]
getRatingList (Lecturer _ _ _ ratingList) = ratingList

-- Student id from Rating tuple
getStudentId :: Rating -> StudentId
getStudentId (studentId, _) = studentId

-- Lecturer Rating from Rating tuple
getRatingFromTuple :: Rating -> Int
getRatingFromTuple (_, rating) = rating

-- Lecturer Rating sum from Rating list
getRatingTotal :: [Rating] -> Int
getRatingTotal [] = 0
getRatingTotal (x:xs) = getRatingFromTuple x + getRatingTotal xs

-- Lecturer average rating from Rating list
getAvgFromRatingList :: Fractional a => [Rating] -> a
getAvgFromRatingList ratingList
  | (length ratingList) == 0 = 0.0
  | otherwise = realToFrac (getRatingTotal ratingList) / (fromIntegral $ length ratingList)

-- Get Lecturer average rating
getLecturerAvgRating :: Lecturer -> Float
getLecturerAvgRating lecturer = getAvgFromRatingList (getRatingList lecturer)

-- Pretty printing
lecturerAsString :: Lecturer -> String
lecturerAsString lecturer@(Lecturer staffId name year ratingList) =
  printf "Staff ID: %s, Name: %s, Year of joining: %d, Average Rating: %.2f" staffId name year ((getLecturerAvgRating lecturer) :: Float)

-- Create a combined list of all lecturer ratings
helperAvgRatingForAllLecturers :: [Lecturer] -> [Int]
helperAvgRatingForAllLecturers lecturerList = [ getRatingFromTuple t | l <- lecturerList, t <- getRatingList l ]

-- Calculate average value of a list of integers
helperAvgFromList :: (Fractional a, Integral b) => [b] -> a
helperAvgFromList lst
  | (length lst) == 0 = 0.0
  | otherwise = realToFrac (sum lst) / (fromIntegral $ length lst)

-- Match Student ID in a rating list
helperMatchStudentId:: StudentId -> [Rating] -> String
helperMatchStudentId studentId [] = ""
helperMatchStudentId studentId ((s,rating):xs)
  | s == studentId = printf "%d" rating
  | otherwise = helperMatchStudentId studentId xs

-- Parse the lecturer type
helperSearchForStudentRating :: StudentId -> Lecturer -> String
helperSearchForStudentRating studentId lecturer = do
  let name = getName lecturer
  let ratingList = getRatingList lecturer
  let rating = helperMatchStudentId studentId ratingList
  if (rating) == ""
    then ""
    else printf "%s: %s" name rating

-- Find students rating if any, return ("s", 0) if not found
helperGetRatingTuple :: StudentId -> [Rating] -> Rating
helperGetRatingTuple studentId [] = ("s", 0)
helperGetRatingTuple studentId ((s,rating):xs)
  | s == studentId = (studentId,rating)
  | otherwise = helperGetRatingTuple studentId xs

-- Get lecturer matching staff id from the list
-- Returns a dummy object if no match found
-- Confirm that proper sanity checks done at calling function level
helperGetLecturer :: StaffId -> [Lecturer] -> Lecturer
helperGetLecturer staffId [] = (Lecturer "id" "name" 0 [])
helperGetLecturer staffId (l@(Lecturer id name year ratingList):xs)
  | id == staffId = l
  | otherwise = helperGetLecturer staffId xs

-- Update rating list
helperUpdateRating :: StudentId -> Int -> [Rating] -> [Rating]
helperUpdateRating studentId rating ratingList = do
  let curRatingTuple = helperGetRatingTuple studentId ratingList
  (studentId, rating):(delete curRatingTuple ratingList)

--
-- Core Functions
--

-- Add a new lecturer to the database
addNewLecturer :: StaffId -> Name -> Year -> [Lecturer] -> [Lecturer]
addNewLecturer staffId name year lecturerList = (Lecturer staffId name year []) : lecturerList

-- Show all lecturers in the database
showAllLecturers :: [Lecturer] -> String
showAllLecturers [] = ""
showAllLecturers (x:xs) = do
  (lecturerAsString x) ++ "\n" ++ showAllLecturers xs

-- Give all lecturers joining in a certain year
selectLecturersByYear :: Int -> [Lecturer] -> [Lecturer]
selectLecturersByYear year = filter ((==year) . getYear)

-- Give all lecturers that have a website rating of 7 or higher
selectLecturersByRating :: Float -> [Lecturer] -> [Lecturer]
selectLecturersByRating rating = filter((>rating) . getLecturerAvgRating)

-- Give the average website rating for the lecturers joining on a certain year
showAvgRatingForAllLecturers :: Int -> [Lecturer] -> Float
showAvgRatingForAllLecturers year lecturerList = do
  -- list of lecturers joined in the given year
  let targetLecturers = selectLecturersByYear year lecturerList
  -- list of all the ratings combined
  let ratingList = helperAvgRatingForAllLecturers targetLecturers
  -- return the average of the list
  helperAvgFromList ratingList

-- Give the names of the lecturers a given student has rated, along with that student’s ratings
showLecturersRatedByStudent :: StudentId -> [Lecturer] -> String
showLecturersRatedByStudent studentId [] = ""
showLecturersRatedByStudent studentId (x:xs) = do
  let output = helperSearchForStudentRating studentId x
  if output /= ""
    then output ++ "\n" ++ showLecturersRatedByStudent studentId xs
    else output ++ showLecturersRatedByStudent studentId xs

-- Allow a given student to rate/re-rate a lecturer (note that only the latest rating from the user should remain recorded)
rateLecturer :: StudentId -> Int -> StaffId -> [Lecturer] -> [Lecturer]
rateLecturer studentId rating staffId lecturerList = do
  let currentLecturerObject = helperGetLecturer staffId lecturerList
  let currentRatingList = getRatingList currentLecturerObject
  let newRatingList = helperUpdateRating studentId rating currentRatingList
  let updatedLecturer = (Lecturer staffId (getName currentLecturerObject) (getYear currentLecturerObject) newRatingList)
  updatedLecturer:(delete currentLecturerObject lecturerList)

-- Give all the lecturers joined between two given years (inclusive), sorted in descending order of website rating
selectLecturersByYearRange :: Int -> Int -> [Lecturer] -> [Lecturer]
selectLecturersByYearRange fromYear toYear lecturerList = do
  filter (isInRange fromYear toYear . getYear) lecturerList where
    isInRange f t y = (f <= y) && (y <= t)

selectAndSortLecturersByYearRange :: Int -> Int -> [Lecturer] -> [Lecturer]
selectAndSortLecturersByYearRange fromYear toYear lecturerList = do
  let lecturersWithinRange = selectLecturersByYearRange fromYear toYear lecturerList
  reverse $ sortOn getLecturerAvgRating lecturersWithinRange

--
-- User Interface
--

databaseFile = "lecturers.txt"

menuParser :: [Lecturer] -> IO ()
menuParser lecturerList = do
  putStrLn ""
  putStrLn "-----------------------------------------------------------------------------------------"
  putStrLn "1. Add a new lecturer to the database"
  putStrLn "2. Show all lecturers in the database"
  putStrLn "3. Show all lecturers joined in a certain year"
  putStrLn "4. Show all lecturers with website rating of 7 or higher"
  putStrLn "5. Show the average website rating for the lecturers joined in a certain year"
  putStrLn "6. Show the lecturers a given student has rated, along with that student's ratings"
  putStrLn "7. Add or update a lecturer's rating"
  putStrLn "8. Show all the lecturers joined between given years (inclusive), sorted in descending order of website rating"
  putStrLn "9. Write to the database and exit"
  putStrLn "-----------------------------------------------------------------------------------------"
  putStrLn ""
  putStr "Enter your choice: "
  choice <- getLine
  try choice lecturerList where
    try c l
      | c == "1" = do
        putStrLn "Input the below details to add new lecturer"
        putStr "Staff ID: "
        staffId <- getLine

        putStr "Name: "
        name <- getLine

        putStr "Year of joining: "
        year <- getLine
        let int_year = read year :: Int

        -- Validate if staff id is unique
        if [] == (filter ((==staffId) . getStaffId) l)
          then do
            let new_l = (addNewLecturer staffId name int_year l)
            putStrLn "New lecturer added successfully!\n"
            menuParser new_l
          else do
            putStrLn "Staff Id already exists, skipping.\n"
            menuParser l

      | c == "2" = do
        putStrLn $ showAllLecturers l
        menuParser l

      | c == "3" = do
        putStr "Enter year of joining: "
        year <- getLine
        let int_year = read year :: Int

        putStrLn $ showAllLecturers (selectLecturersByYear int_year l)
        menuParser l

      | c == "4" = do
        putStrLn "Lecturers with rating 7 or higher in current database are"
        putStrLn $ showAllLecturers (selectLecturersByRating 7.0 l)
        menuParser l

      | c == "5" = do
        putStr "Enter year of joining: "
        year <- getLine
        let int_year = read year :: Int

        putStrLn $ printf "Average rating of all lecturers joined in %s is %.2f" year (showAvgRatingForAllLecturers int_year l)
        menuParser l

      | c == "6" = do
        putStr "Enter Student Id: "
        studentId <- getLine

        putStrLn $ showLecturersRatedByStudent studentId l
        menuParser l

      | c == "7" = do
        putStr "Enter Student Id: "
        studentId <- getLine

        putStr "Enter Staff Id: "
        staffId <- getLine

        putStr "Enter new rating: "
        rating <- getLine

        -- Working around exception handling
        if rating `elem` ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
          then do
            let int_rating = read rating :: Int

            -- Check if lecturer exist in database
            if [] == (filter ((==staffId) . getStaffId) l)
              then do
                putStrLn $ printf "Lecturer with staff id %s does not exist. Please create the lecturer first." staffId
                menuParser l
              else do
                let new_l = rateLecturer studentId int_rating staffId l
                putStrLn $ printf "Lecturer %s rating by %s updated to %s" staffId studentId rating
                menuParser new_l

          -- Invalid rating
          else do
            putStrLn "Invalid rating, valid choices are [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            menuParser l

      | c == "8" = do
        putStr "Enter the starting year: "
        fromYear <- getLine
        let int_fromYear = read fromYear :: Int

        putStr "Enter the ending year: "
        toYear <- getLine
        let int_toYear = read toYear :: Int

        if int_fromYear < int_toYear
          then do
            putStrLn $ printf "Lecturers joined between %s and %s inclusive are" fromYear toYear
            putStrLn $ showAllLecturers $ selectAndSortLecturersByYearRange int_fromYear int_toYear l
          else putStrLn "Please enter a valid range"
        menuParser l

      | c == "9" = do
        writeFile databaseFile (show l)
        putStrLn $ printf "Lecturer database written to file %s" databaseFile
        putStrLn "Exiting.."

      | otherwise = do
        putStrLn "Invalid input"
        menuParser l

main :: IO ()
main = do
  d <- readFile databaseFile
  let lecturerList = read d :: [Lecturer]
  menuParser lecturerList
