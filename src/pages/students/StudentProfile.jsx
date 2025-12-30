import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { ENDPOINTS } from "../../api/endpoints";
import Button from "../../components/ui/Button";
import {
  ArrowLeft,
  Edit3,
  Shield,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  Briefcase,
  GraduationCap,
} from "lucide-react";

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  // Fetches data using the getStudentProfile controller
  const { data: student, loading } = useFetch(
    ENDPOINTS.STUDENTS.PROFILE(studentId)
  );

  if (loading)
    return <div className="p-10 text-center font-bold">Loading Profile...</div>;
  if (!student)
    return <div className="p-10 text-center">Student not found.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="rounded-xl border-slate-200"
        >
          <ArrowLeft size={18} /> Back to Directory
        </Button>
        <Button
          onClick={() => navigate(`/students/edit/${student._id}`)}
          className="bg-indigo-600 rounded-xl"
        >
          <Edit3 size={18} /> Edit Profile
        </Button>
      </div>

      {/* Profile Card [cite: 2025-10-11] */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <div className="bg-indigo-600 h-32 w-full"></div>
        <div className="px-12 pb-12">
          <div className="relative -mt-16 mb-6 flex items-end gap-6">
            <div className="w-32 h-32 bg-white p-2 rounded-[2.5rem] shadow-xl">
              <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center text-4xl font-black text-indigo-600 border-2 border-indigo-50">
                {student.name[0]}
              </div>
            </div>
            <div className="pb-4">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {student.name}
              </h1>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
                ID: {student.studentId}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-50">
            {/* Academic Info */}
            <div className="space-y-6">
              <SectionTitle
                icon={<GraduationCap size={18} />}
                title="Academic"
              />
              <InfoRow label="Class" value={student.class} />
              <InfoRow label="Section" value={student.section} />
              <InfoRow label="Roll Number" value={`#${student.roll}`} />
              <InfoRow label="Campus" value={student.campus} />
            </div>

            {/* Personal Details */}
            <div className="space-y-6">
              <SectionTitle icon={<User size={18} />} title="Personal" />
              <InfoRow
                label="Date of Birth"
                value={new Date(student.dob).toLocaleDateString()}
              />
              <InfoRow label="Gender" value={student.gender} />
              <InfoRow label="Blood Group" value={student.bloodGroup} />
              <InfoRow label="Birth Reg" value={student.birthRegNumber} />
            </div>

            {/* Family & Contact */}
            <div className="space-y-6">
              <SectionTitle icon={<Briefcase size={18} />} title="Guardian" />
              <InfoRow label="Father" value={student.fatherName} />
              <InfoRow label="Mother" value={student.motherName} />
              <InfoRow label="Address" value={student.presentAddress} />
              <InfoRow label="District" value={student.homeDistrict} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-2 text-indigo-600 mb-4">
    {icon}
    <span className="text-xs font-black uppercase tracking-widest">
      {title}
    </span>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
      {label}
    </span>
    <span className="text-sm font-bold text-slate-700">
      {value || "Not Provided"}
    </span>
  </div>
);

export default StudentProfile;
