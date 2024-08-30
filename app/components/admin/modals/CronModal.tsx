import React, { useState, useEffect } from "react";
import cronstrue from "cronstrue";
import { updateCron } from "@/services/cronServices";
import { addOrUpdateCron } from "@/app/app-service/cronService";
import { CronJob, CronJobData } from "@/app/types/cronType";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CronModalProps {
  onClose: () => void;
  cronJob?: CronJobData;
}



const cronTypes = ["Category", "Stores", "Offers", "Offer Status Checker"];
const frequencyOptions = [
  { text: "Select a frequency", value: "" },
  { text: "Once Every X Days", value: "Once Every X Days" },
  { text: "Once A Week", value: "Once A Week" },
  { text: "Once A Month", value: "Once A Month" },
  { text: "Specific Time", value: "Specific Time" },
  { text: "Hourly", value: "Hourly" },
  { text: "Every X Minutes", value: "Every X Minutes" },
  { text: "Custom", value: "Custom" },
];
const determineIntervalType = (pattern: string): string => {
  const parts = pattern.split(" ");

  if (parts[0] === "*" && parts[1] === "*" && parts[2] === "*" && parts[3] === "*" && parts[4] === "*") {
    return "Every Minute";
  } else if (parts[0].startsWith("*/")) {
    return "Every X Minutes";
  } else if (parts[1] === "*" && parts[2] === "*" && parts[3] === "*" && parts[4] === "*") {
    return "Hourly";
  } else if (parts[2] === "*" && parts[3] === "*" && parts[4] !== "*") {
    return "Once A Week";
  } else if (parts[2] !== "*" && parts[3] === "*" && parts[4] === "*") {
    return "Once A Month";
  } else if (parts[2].includes("/")) {
    return "Once Every X Days";
  } else if (parts[2] !== "*" && parts[3] !== "*" && parts[4] === "*") {
    return "Specific Time";
  } else {
    return "Custom";
  }
};

const CronModal: React.FC<CronModalProps> = ({ onClose, cronJob }) => {
  console.log("cronJob ",cronJob)
  const router = useRouter();
  const [type, setType] = useState("");
  const [intervalType, setIntervalType] = useState("");
  const [cronPattern, setCronPattern] = useState("* * * * *");
  const [cronDescription, setCronDescription] = useState("");
  const [isEditing, setIsEditing] = useState(!!cronJob);
  const [state, setState] = useState({
    everyXDays: "0",
    everyXDaysTime: "00:00",
    weeklyDay: "1",
    weeklyTime: "00:00",
    monthlyDay: "0",
    monthlyTime: "00:00",
    specificDateTime: "",
    hourlyMinute: "0",
    minuteInterval: "0",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (cronJob) {
      setType(cronJob.type);
      setCronPattern(cronJob.pattern);
      setCronDescription(cronJob.description);
      setIntervalType(determineIntervalType(cronJob.pattern));
      setIsEditing(true);
      initializeStateFromCronPattern(cronJob.pattern);
    }
  }, [cronJob]);

  const initializeStateFromCronPattern = (pattern: string) => {
    const parts = pattern.split(" ");
  
    const safeParseInt = (value: string) => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? "" : parsed.toString();
    };
  
    switch (determineIntervalType(pattern)) {
      case "Once Every X Days":
        setState({
          ...state,
          everyXDays: safeParseInt(parts[2].split("/")[1]),
          everyXDaysTime: `${parts[1].padStart(2, "0")}:${parts[0].padStart(2, "0")}`,
        });
        break;
      case "Once A Week":
        setState({
          ...state,
          weeklyDay: safeParseInt(parts[4]),
          weeklyTime: `${parts[1].padStart(2, "0")}:${parts[0].padStart(2, "0")}`,
        });
        break;
      case "Once A Month":
        setState({
          ...state,
          monthlyDay: safeParseInt(parts[2]),
          monthlyTime: `${parts[1].padStart(2, "0")}:${parts[0].padStart(2, "0")}`,
        });
        break;
      case "Specific Time":
        setState({
          ...state,
          specificDateTime: `2024-${parts[3].padStart(2, "0")}-${parts[2].padStart(2, "0")}T${parts[1].padStart(2, "0")}:${parts[0].padStart(2, "0")}`,
        });
        break;
      case "Hourly":
        setState({
          ...state,
          hourlyMinute: safeParseInt(parts[0]),
        });
        break;
      case "Every X Minutes":
        setState({
          ...state,
          minuteInterval: safeParseInt(parts[0].split("/")[1]),
        });
        break;
    }
  };

  const updateCronPattern = (pattern: string) => {
    setCronPattern(pattern);
    try {
      setCronDescription(cronstrue.toString(pattern));
    } catch (error) {
      setCronDescription("Invalid cron pattern");
    }
  };

  const handleIntervalTypeChange = (value: string) => {
    setIntervalType(value);
    setErrors({});
    setIsEditing(false);
    updateCronPatternBasedOnSelection(value);
  };

  const updateCronPatternBasedOnSelection = (selectedType: string) => {
  let newPattern = "* * * * *";
  const { everyXDays, everyXDaysTime, weeklyDay, weeklyTime, monthlyDay, monthlyTime, specificDateTime, hourlyMinute, minuteInterval } = state;

  switch (selectedType) {
    case "Once Every X Days":
      const [everyXDaysHours, everyXDaysMinutes] = everyXDaysTime.split(":").map(Number);
      newPattern = `${everyXDaysMinutes} ${everyXDaysHours} */${everyXDays} * *`;
      break;
    case "Once A Week":
      const [weeklyHours, weeklyMinutes] = weeklyTime.split(":").map(Number);
      newPattern = `${weeklyMinutes} ${weeklyHours} * * ${weeklyDay}`;
      break;
    case "Once A Month":
      const [monthlyHours, monthlyMinutes] = monthlyTime.split(":").map(Number);
      newPattern = `${monthlyMinutes} ${monthlyHours} ${monthlyDay} * *`;
      break;
    case "Specific Time":
      if (specificDateTime) {
        const date = new Date(specificDateTime);
        newPattern = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
      }
      break;
    case "Hourly":
      newPattern = `${hourlyMinute} * * * *`;
      break;
    case "Every X Minutes":
      newPattern = `*/${minuteInterval} * * * *`;
      break;
    case "Custom":
      // Keep the current pattern for custom input
      return;
    default:
      newPattern = "* * * * *";
  }
  updateCronPattern(newPattern);
};

  useEffect(() => {
    // console.log("the function running")
    // if (!isEditing) {
      updateCronPatternBasedOnSelection(intervalType);
    // }
  }, [intervalType, state, state.monthlyDay, state.monthlyTime, state.everyXDays, state.everyXDaysTime, state.hourlyMinute, state.minuteInterval, state.specificDateTime, state.weeklyDay, state.weeklyTime ]);
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!type) newErrors.type = "Cron Type is required";
    if (!intervalType) newErrors.intervalType = "Frequency is required";
  
    const { everyXDays, monthlyDay, specificDateTime, hourlyMinute, minuteInterval } = state;
  
    const safeParseInt = (value: string | number) => {
      const parsed = typeof value === 'string' ? parseInt(value) : value;
      return isNaN(parsed) ? 0 : parsed;
    };
  
    switch (intervalType) {
      case "Once Every X Days":
        if (everyXDays === "" || safeParseInt(everyXDays) < 1 || safeParseInt(everyXDays) > 31)
          newErrors.everyXDays = "Days must be between 1 and 31";
        break;
      case "Once A Month":
        if (monthlyDay === "" || safeParseInt(monthlyDay) < 1 || safeParseInt(monthlyDay) > 31)
          newErrors.monthlyDay = "Day must be between 1 and 31";
        break;
      case "Specific Time":
        if (!specificDateTime) {
          newErrors.specificDateTime = "Date and time are required";
        } else {
          const specificDate = new Date(specificDateTime);
          if (specificDate <= new Date()) {
            newErrors.specificDateTime = "Past date is not possible, we don't have a Time Machine";
          }
        }
        break;
      case "Hourly":
        if (hourlyMinute === "" || safeParseInt(hourlyMinute) < 0 || safeParseInt(hourlyMinute) > 59)
          newErrors.hourlyMinute = "Minute must be between 0 and 59";
        break;
      case "Every X Minutes":
        if (minuteInterval === "" || safeParseInt(minuteInterval) < 1 || safeParseInt(minuteInterval) > 59)
          newErrors.minuteInterval = "Interval must be between 1 and 59";
        break;
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = async () => {
    if (validate()) {
      const cronJobData : CronJob = {
        _id: cronJob?._id as string,
        type,
        pattern: cronPattern,
        description: cronDescription,
        status: cronJob?.status ? cronJob?.status : "Active"
      };

      try {
        const response = await addOrUpdateCron(cronJobData)

        if (response.status === 200) {
          router.refresh()
          onClose();
        } else {
          toast.error(response.message)
          console.error("Failed to save cron job:", response.message);
        }
      } catch (error) {
        console.error("Error saving cron job:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
    <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl">
      <h2 className="text-2xl mb-4">{cronJob ? "Edit Cron Job" : "Create New Cron Job"}</h2>

      <div className="mb-4">
        <label className="block mb-2">Cron Type</label>
        <select
          className="w-full p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select a type</option>
          {cronTypes.map((cronType) => (
            <option key={cronType} value={cronType}>
              {cronType}
            </option>
          ))}
        </select>
        {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Select Frequency</label>
        <select
          className="w-full p-2 border rounded"
          value={intervalType}
          onChange={(e) => handleIntervalTypeChange(e.target.value)}
        >
          {frequencyOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        {errors.intervalType && (
          <p className="text-red-500 text-sm">{errors.intervalType}</p>
        )}
      </div>

      {intervalType === "Once Every X Days" && (
        <div className="mb-4">
          <label className="block mb-2">Every how many days?</label>
          <div className="flex justify-between">
            <input
              type="number"
              min="1"
              max="31"
              value={state.everyXDays}
              onChange={(e) => setState({ ...state, everyXDays: e.target.value })}
              className="w-1/2 p-2 border rounded mr-2"
            />
            <input
              type="time"
              value={state.everyXDaysTime}
              onChange={(e) => setState({ ...state, everyXDaysTime: e.target.value })}
              className="w-1/2 p-2 border rounded"
            />
          </div>
          {errors.everyXDays && (
            <p className="text-red-500 text-sm">{errors.everyXDays}</p>
          )}
        </div>
      )}

      {intervalType === "Once A Week" && (
        <div className="mb-4">
          <label className="block mb-2">Which day of the week and time?</label>
          <div className="flex justify-between">
            <select
              value={state.weeklyDay}
              onChange={(e) => setState({ ...state, weeklyDay: e.target.value })}
              className="w-1/2 p-2 border rounded mr-2"
            >
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
              <option value="0">Sunday</option>
            </select>
            <input
              type="time"
              value={state.weeklyTime}
              onChange={(e) => setState({ ...state, weeklyTime: e.target.value })}
              className="w-1/2 p-2 border rounded"
            />
          </div>
        </div>
      )}

      {intervalType === "Once A Month" && (
        <div className="mb-4">
          <label className="block mb-2">Which day of the month and time?</label>
          <div className="flex justify-between">
            <input
              type="number"
              min="1"
              max="31"
              value={state.monthlyDay}
              onChange={(e) => setState({ ...state, monthlyDay: e.target.value })}
              className="w-1/2 p-2 border rounded mr-2"
            />
            <input
              type="time"
              value={state.monthlyTime}
              onChange={(e) => setState({ ...state, monthlyTime: e.target.value })}
              className="w-1/2 p-2 border rounded"
            />
          </div>
          {errors.monthlyDay && (
            <p className="text-red-500 text-sm">{errors.monthlyDay}</p>
          )}
        </div>
      )}

      {intervalType === "Specific Time" && (
        <div className="mb-4">
          <label className="block mb-2">Select date and time</label>
          <input
            type="datetime-local"
            value={state.specificDateTime}
            onChange={(e) => setState({ ...state, specificDateTime: e.target.value })}
            className="w-full p-2 border rounded"
          />
          {errors.specificDateTime && (
            <p className="text-red-500 text-sm">{errors.specificDateTime}</p>
          )}
        </div>
      )}

      {intervalType === "Hourly" && (
        <div className="mb-4">
          <label className="block mb-2">At which minute of every hour?</label>
          <input
            type="number"
            min="0"
            max="59"
            value={state.hourlyMinute}
            onChange={(e) => setState({ ...state, hourlyMinute: e.target.value })}
            className="w-full p-2 border rounded"
          />
          {errors.hourlyMinute && (
            <p className="text-red-500 text-sm">{errors.hourlyMinute}</p>
          )}
        </div>
      )}

      {intervalType === "Every X Minutes" && (
        <div className="mb-4">
          <label className="block mb-2">Every how many minutes?</label>
          <input
            type="number"
            min="1"
            max="59"
            value={state.minuteInterval}
            onChange={(e) => setState({ ...state, minuteInterval: e.target.value })}
            className="w-full p-2 border rounded"
          />
          {errors.minuteInterval && (
            <p className="text-red-500 text-sm">{errors.minuteInterval}</p>
          )}
        </div>
      )}

      {intervalType === "Custom" && (
        <div className="mb-4">
          <label className="block mb-2">Custom Cron Pattern</label>
          <input
            type="text"
            value={cronPattern}
            onChange={(e) => updateCronPattern(e.target.value)}
            placeholder="* * * * *"
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      <div className="mb-4 flex gap-2 items-center">
        <label className="block mb-2">Cron Pattern:</label>
        {cronPattern && (
          <p className="px-2 py-1 border rounded-md">{cronPattern}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Description</label>
        <textarea
          className="w-full p-2 border rounded"
          value={cronDescription}
          onChange={(e) => setCronDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleSave}
        >
          Save
        </button>
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  </div>
  );
};

export default CronModal;