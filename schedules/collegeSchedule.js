import cron from "node-cron";
import Student from "../models/studentModel.js";
import AcademicData from "../models/academicDataModel.js";

async function promoteCollegeStudents() {
    const students = await Student.find({ organization: "COLLEGE" });

    for (const student of students) {
        if (student.year === "passedOut") continue;

        const unpaidFees = student.fixedFee - student.paidFee;
        if (unpaidFees > 0) {
            student.previousFee += unpaidFees;
        }

        const currentYear = parseInt(student.year, 10);
        if (!isNaN(currentYear) && currentYear < student.durationInYear) {
            student.year = (currentYear + 1).toString();
        } else if (!isNaN(currentYear) && currentYear === student.durationInYear) {
            student.year = "passedOut";
        }

        student.paidFee = 0;
        await student.save();
    }

    console.log("College students have been promoted successfully.");
}

async function scheduleCollegePromotionTask() {
    const academicYear = await AcademicData.findOne({ organization: "COLLEGE" });
    if (academicYear && academicYear.endingDate) {
        const endDate = new Date(academicYear.endingDate);
        const currentDate = new Date();

        console.log(`College academic year end date: ${endDate}`);
        console.log(`Current system date: ${currentDate}`);

        // If the academic year's ending date has already passed, promote students immediately
        if (currentDate >= endDate) {
            console.log("College academic year has ended, running immediate promotion...");
            await promoteCollegeStudents();
        } else {
            // Schedule the task at midnight on the endDate
            const day = endDate.getDate();
            const month = endDate.getMonth() + 1; // Months are zero-based in JS
            console.log(`Scheduling college promotion task for ${day} ${month}`);

            cron.schedule(`0 0 ${day} ${month} *`, async () => {
                console.log("Running college promotion task at midnight...");
                await promoteCollegeStudents();
            });

            console.log("Scheduled college promotion task.");
        }
    } else {
        console.error("No academic end date found for the college.");
    }
}

export default scheduleCollegePromotionTask;
