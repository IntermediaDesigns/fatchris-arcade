import { useState, useEffect } from "react";

const MainPage = ({ supabase }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendance();
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchAttendance = async () => {
    const dateString = currentDate.toISOString().split("T")[0];
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("will_attend")
        .eq("date", dateString)
        .maybeSingle();

      if (error) throw error;

      if (data === null) {
        setAttendance(null);
        setError(null);
      } else {
        setAttendance(data.will_attend);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("Failed to fetch attendance data");
      setAttendance(null);
    }
  };

  const formatDate = (date) => {
    const dayOptions = { weekday: "long" };
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    return {
      day: date.toLocaleDateString("en-US", dayOptions),
      fullDate: date.toLocaleDateString("en-US", dateOptions),
    };
  };

  const { day, fullDate } = formatDate(currentDate);

  return (
    <div className="nes-container with-title h-screen flex flex-col justify-center items-center overflow-hidden">
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .bounce {
            animation: bounce 2s infinite;
          }
        `}
      </style>
      <div className="flex flex-col items-center gap-6 mt-8">
        <i className="nes-bcrikko bounce" style={{ marginBottom: "2rem" }}></i>

        <h1
          className="title text-center"
          style={{
            fontSize: "2rem",
            color: "white",
            backgroundColor: "#212529",
            marginBottom: "2rem",
          }}
        >
          Will I be at the arcade?
        </h1>
      </div>

      <div className="text-center mb-8" style={{ color: "#facc15" }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{day}</div>
        <div style={{ fontSize: "1.5rem" }}>{fullDate}</div>
      </div>

      {error ? (
        <div className="nes-text is-error mb-4" style={{ color: "red" }}>
          {error}
        </div>
      ) : (
        <div
          className="nes-text is-primary text-center"
          style={{ fontSize: "2.5rem", marginBottom: "2rem" }}
        >
          {attendance === null ? "No Answer Yet" : attendance ? "Yes" : "No"}
        </div>
      )}
    </div>
  );
};

export default MainPage;
