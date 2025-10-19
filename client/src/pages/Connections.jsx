import { UserCheck, UserPlus, UserRoundPen, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections,
} from "../assets/assets";

const Connections = () => {
  const [currentTab, setCurrentTab] = useState("Followers");
  const navigate = useNavigate();
  const dataArray = [
    {
      label: "Followers",
      value: followers,
      icon: Users,
    },
    {
      label: "Following",
      value: following,
      icon: UserCheck,
    },
    {
      label: "Pending",
      value: pendingConnections,
      icon: UserRoundPen,
    },
    {
      label: "Connections",
      value: connections,
      icon: UserPlus,
    },
  ];
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Connections
          </h1>
          <p className="text-slate-500">
            Manage your network and discover new connections
          </p>
        </div>
        {/* Stats */}
        <div className="mb-8 flex flex-wrap gap-6">
          {dataArray.map((data, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md"
            >
              <b>{data.value.length}</b>
              <p className="text-slate-500">{data.label}</p>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div className="inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm">
          {dataArray.map((data) => (
            <button
              onClick={() => setCurrentTab(data.label)}
              key={data.label}
              className={`flex items-center px-3 py-1 text-sm rounded-md cursor-pointer transition-colors ${
                currentTab === data.label
                  ? "bg-white font-medium text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              <data.icon className="w-4 h-4" />
              <span className="ml-1">{data.label}</span>
              {data.count !== undefined && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {data.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
