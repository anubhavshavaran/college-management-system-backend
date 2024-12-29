import schedule from "node-schedule";
import Student from "../models/studentModel.js";
import AcademicData from "../models/academicDataModel.js";

async function promoteCollegeStudents() {
    const students = await Student.find({
        organization: "COLLEGE"
    });

    for (const student of students) {
        if (student.year === "passedOut") continue;

        const currentYear = parseInt(student.year, 10);

        if (!isNaN(currentYear) && currentYear < student.durationInYear) {
            student.year = (currentYear + 1).toString();
        } else if (!isNaN(currentYear) && currentYear === student.durationInYear) {
            student.year = "passedOut";
        }

        await student.save();
    }

    console.log("College students have been promoted successfully.");
}

async function scheduleCollegePromotionTask() {
    const academicYear = await AcademicData.findOne({
        organization: "COLLEGE"
    });
    if (academicYear && academicYear.endingDate) {
        schedule.scheduleJob(academicYear.endingDate, promoteCollegeStudents);
    } else {
        console.error("No academic end date found for the college.");
    }
}

export default scheduleCollegePromotionTask;
