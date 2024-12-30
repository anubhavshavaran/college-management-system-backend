import schedule from "node-schedule";
import Student from "../models/studentModel.js";
import AcademicData from "../models/academicDataModel.js";

async function promoteStudents() {
    const students = await Student.find({
        organization: "SCHOOL"
    });

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
    const academicYear = await AcademicData.findOne({
        organization: "SCHOOL"
    });
    if (academicYear && academicYear.endingDate) {
        schedule.scheduleJob(academicYear.endingDate, promoteStudents);
    }
}

export default scheduleSchoolPromotionTask;