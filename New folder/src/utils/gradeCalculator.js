/**
 * Calculates Grade and GPA based on total marks
 */
export const getGradeInfo = (total) => {
  if (total >= 80) return { grade: "A+", gpa: 5.0, color: "text-emerald-600" };
  if (total >= 70) return { grade: "A", gpa: 4.0, color: "text-emerald-500" };
  if (total >= 60) return { grade: "A-", gpa: 3.5, color: "text-blue-500" };
  if (total >= 50) return { grade: "B", gpa: 3.0, color: "text-blue-400" };
  if (total >= 40) return { grade: "C", gpa: 2.0, color: "text-amber-500" };
  if (total >= 33) return { grade: "D", gpa: 1.0, color: "text-orange-500" };
  return { grade: "F", gpa: 0.0, color: "text-rose-600" };
};

/**
 * Calculates final CGPA including 4th subject bonus points
 * @param {Array} subjects - Array of { gpa, isFourthSubject }
 */
export const calculateCGPA = (subjects) => {
  if (!subjects.length) return 0;

  let totalPoints = 0;
  let mainSubjectCount = 0;

  subjects.forEach((sub) => {
    if (sub.isFourthSubject) {
      // Rule: Points above 2.0 contribute to total
      totalPoints += Math.max(0, sub.gpa - 2.0);
    } else {
      totalPoints += sub.gpa;
      mainSubjectCount++;
    }
  });

  const cgpa = totalPoints / mainSubjectCount;
  return Math.min(5.0, cgpa).toFixed(2);
};
