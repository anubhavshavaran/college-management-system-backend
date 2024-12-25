import catchAsync from "../utils/CatchAsync.js";
import Student from "../models/studentModel.js";

const getDashData = catchAsync(async (req, res) => {
    const result = await Student.aggregate([
        {
            $match: {
                "organization": req.params.organization.toUpperCase()
            }
        },
        {
            $group: {
                _id: null, totalPaidFee: {$sum: "$paidFee"}, totalFixedFee: {$sum: "$fixedFee"}
            }
        },
        {
            $project: {
                _id: 0, totalPaidFee: 1, totalFixedFee: 1
            }
        }]);
    console.log(result)
    const studentsNum = await Student.countDocuments({

        organization: req.params.organization.toUpperCase(),
    });
    const maleNum = await Student.countDocuments({
        gender: 'male',
        organization: req.params.organization.toUpperCase()
    });
    const femaleNum = await Student.countDocuments({
        gender: 'female',
        organization: req.params.organization.toUpperCase()
    });

    const male = Number((((maleNum / studentsNum) * 100)).toFixed(2));
    const female = Number((((femaleNum / studentsNum) * 100)).toFixed(2));

    res.status(200).json({
        status: "success",
        data: {
            studentsNum,
            fees: result[0],
            genderRatio: {
                male,
                female
            }
        }
    });
});

export {getDashData};