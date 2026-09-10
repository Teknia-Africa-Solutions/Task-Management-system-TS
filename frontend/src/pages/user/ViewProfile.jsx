import { useState } from "react";

export default function ViewProfile() {
  const [user] = useState({
    name: "Jane Doe",
    email: "jane@taskflow.io",
    role: "Member",
    phone: "+254 700 000 000",
    joined: "March 2026",
  });
  return (
    <div className="max-w-2xl">
      <div className="bg-white border border-black/5 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 pb-6 border-b border-black/5">
          
          <div>
            <h1 className="text-lg font-bold text-[#1F2937]">{user.name}</h1>
            <p className="text-sm text-[#6B7280]">{user.role}</p>
          </div>
        </div>

        <dl className="grid sm:grid-cols-2 gap-6 pt-6">
          <div>
            <dt className="text-xs font-medium text-[#6B7280] uppercase">Email</dt>
            <dd className="text-sm text-[#1F2937] mt-1">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#6B7280] uppercase">Phone</dt>
            <dd className="text-sm text-[#1F2937] mt-1">{user.phone}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#6B7280] uppercase">Role</dt>
            <dd className="text-sm text-[#1F2937] mt-1">{user.role}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#6B7280] uppercase">Member Since</dt>
            <dd className="text-sm text-[#1F2937] mt-1">{user.joined}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}