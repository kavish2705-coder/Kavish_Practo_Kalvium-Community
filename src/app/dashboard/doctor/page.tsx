import { Clock, Calendar as CalendarIcon, User, CheckCircle2, IndianRupee } from "lucide-react";
import { format } from "date-fns";

const MOCK_TODAYS_APPOINTMENTS = [
  {
    id: "apt-1",
    patientName: "John Doe",
    time: "10:00 AM",
    duration: "30 min",
    status: "CONFIRMED",
    fee: 500,
    notes: "First time visit. Complains of mild fever.",
  },
  {
    id: "apt-2",
    patientName: "Sarah Smith",
    time: "10:30 AM",
    duration: "30 min",
    status: "CONFIRMED",
    fee: 500,
    notes: "Follow up for blood report.",
  },
  {
    id: "apt-3",
    patientName: "Michael Johnson",
    time: "11:30 AM",
    duration: "30 min",
    status: "CONFIRMED",
    fee: 500,
    notes: "Routine checkup.",
  },
];

export default function DoctorDashboardPage() {
  const today = new Date();

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1.5 flex items-center gap-2 font-medium">
            <CalendarIcon className="h-4 w-4 text-primary-500" />
            {format(today, "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="bg-primary-100 text-primary-700 p-2 rounded-lg">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Today</p>
            <p className="text-xl font-extrabold text-slate-900 leading-none">
              {MOCK_TODAYS_APPOINTMENTS.length}
            </p>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">
          Today&apos;s Appointments
        </h2>
        
        {MOCK_TODAYS_APPOINTMENTS.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center">
            <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
              <CalendarIcon className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No appointments today</h3>
            <p className="text-slate-500 text-sm mt-1">Enjoy your free time or manage your schedule.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {MOCK_TODAYS_APPOINTMENTS.map((apt) => (
              <div 
                key={apt.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left: Patient Info & Time */}
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-100 text-slate-700 h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                      {apt.patientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{apt.patientName}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm font-medium text-slate-600">
                        <div className="flex items-center gap-1.5 text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md">
                          <Clock className="h-3.5 w-3.5" />
                          {apt.time}
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {apt.fee}
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {apt.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                    <button className="px-4 py-2 text-sm font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors">
                      Start Visit
                    </button>
                  </div>
                </div>

                {/* Notes */}
                {apt.notes && (
                  <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-600">
                    <span className="font-bold text-slate-800 mr-2">Patient Note:</span>
                    {apt.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
