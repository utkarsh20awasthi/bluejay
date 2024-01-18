const fs = require("fs");
const csv = require("csv-parser");

function analyzeFile(filePath) {
 
  const shifts = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      shifts.push(row);
    })
    .on("end", () => {
      const sevenConsecutiveDays = {};
      const lessThan10HoursBetweenShifts = {};
      const moreThan14HoursInSingleShift = {};

      shifts.forEach((shift) => {
        // Store shifts for each employee
        const employee = shift["Employee Name"];
        if (!sevenConsecutiveDays[employee]) sevenConsecutiveDays[employee] = 0;
        if (!lessThan10HoursBetweenShifts[employee])
          lessThan10HoursBetweenShifts[employee] = 0;
        if (!moreThan14HoursInSingleShift[employee])
          moreThan14HoursInSingleShift[employee] = 0;

        // Extract relevant information from columns
        const timecardHours = parseFloat(shift['Timecard Hours (as Time)']);

        // a) Check for 7 consecutive days
        sevenConsecutiveDays[employee]++;

        // b) Check for less than 10 hours between shifts but greater than 1 hour
        if (timecardHours > 1 && timecardHours < 10) {
          lessThan10HoursBetweenShifts[employee]++;
        }

        // c) Check for more than 14 hours in a single shift
        if (timecardHours > 14) {
          moreThan14HoursInSingleShift[employee]++;
        }
      });

      // Filter employees meeting each condition
      const employeesWithSevenConsecutiveDays = Object.keys(
        sevenConsecutiveDays
      ).filter((employee) => sevenConsecutiveDays[employee] >= 7);

      const employeesWithLessThan10HoursBetweenShifts = Object.keys(
        lessThan10HoursBetweenShifts
      ).filter((employee) => lessThan10HoursBetweenShifts[employee] > 0);

      const employeesWithMoreThan14HoursInSingleShift = Object.keys(
        moreThan14HoursInSingleShift
      ).filter((employee) => moreThan14HoursInSingleShift[employee] > 0);

      // Print the results to the console
      console.log(
        "Employees who have worked for 7 consecutive days:",
        employeesWithSevenConsecutiveDays
      );
      console.log(
        "Employees who have less than 10 hours between shifts but greater than 1 hour:",
        employeesWithLessThan10HoursBetweenShifts
      );
      console.log(
        "Employees who have worked for more than 14 hours in a single shift:",
        employeesWithMoreThan14HoursInSingleShift
      );

      // Write the results to the output.txt file
      const outputContent = `
Employees who have worked for 7 consecutive days: ${employeesWithSevenConsecutiveDays}
Employees who have less than 10 hours between shifts but greater than 1 hour: ${employeesWithLessThan10HoursBetweenShifts}
Employees who have worked for more than 14 hours in a single shift: ${employeesWithMoreThan14HoursInSingleShift}
`;
      fs.writeFileSync("output.txt", outputContent);
    });
}

const filePath = "project.csv";
analyzeFile(filePath);


