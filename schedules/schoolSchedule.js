import cron from "node-cron";
import Student from "../models/studentModel.js";
import AcademicData from "../models/academicDataModel.js";

async function promoteStudents() {
    const students = await Student.find({ organization: "SCHOOL" });

    for (const student of students) {
        if (student.class === "passedOut") continue;

        const unpaidFees = student.fixedFee - student.paidFee;
        if (unpaidFees > 0) {
            student.previousFee += unpaidFees;
        }

        if (student.class === "10") {
            student.class = "passedOut";
        } else if (student.class === "nursery") {
            student.class = "LKG";
        } else if (student.class === "LKG") {
            student.class = "UKG";
        } else if (student.class === "UKG") {
            student.class = "1";
        } else {
            const nextClass = parseInt(student.class, 10) + 1;
            if (!isNaN(nextClass)) {
                student.class = String(nextClass);
            }
        }

        student.paidFee = 0;
        await student.save();
    }

    console.log("School students have been promoted successfully.");
}

async function scheduleSchoolPromotionTask() {
    const academicYear = await AcademicData.findOne({ organization: "SCHOOL" });
    if (academicYear && academicYear.endingDate) {
        const endDate = new Date(academicYear.endingDate);
        const currentDate = new Date();

        console.log(`Academic year end date: ${endDate}`);
        console.log(`Current system date: ${currentDate}`);

        // If the academic year's ending date has already passed, promote students immediately
        if (currentDate >= endDate) {
            console.log("Academic year has ended, running immediate promotion...");
            await promoteStudents();
        } else {
            // Schedule the task at midnight on the endDate
            const day = endDate.getDate();
            const month = endDate.getMonth() + 1; // Months are zero-based in JS
            console.log(`Scheduling task for ${day} ${month}`);

            cron.schedule(`0 0 ${day} ${month} *`, async () => {
                console.log("Running school promotion task at midnight...");
                await promoteStudents();
            });

            console.log("Scheduled school promotion task.");
        }
    } else {
        console.error("No academic end date found for the school.");
    }
}

export default scheduleSchoolPromotionTask;
