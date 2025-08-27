function getBelgiumDate() {
  const now = new Date();

  const belgiumTime = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Europe/Brussels",
    })
  );

  return belgiumTime;
}

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(year, month) {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month === 1 && isLeapYear(year)) {
    return 29;
  }

  return daysInMonth[month];
}

export function getStartOfDay() {
  const belgiumDate = getBelgiumDate();
  const startOfDay = new Date(belgiumDate);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

export function getEndOfDay() {
  const belgiumDate = getBelgiumDate();
  const endOfDay = new Date(belgiumDate);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
}

export function getStartOfWeek() {
  const belgiumDate = getBelgiumDate();
  const dayOfWeek = belgiumDate.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startOfWeek = new Date(belgiumDate);
  startOfWeek.setDate(belgiumDate.getDate() - daysFromMonday);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

export function getEndOfWeek() {
  const startOfWeek = getStartOfWeek();
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return endOfWeek;
}

export function getStartOfMonth() {
  const belgiumDate = getBelgiumDate();
  const startOfMonth = new Date(
    belgiumDate.getFullYear(),
    belgiumDate.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  return startOfMonth;
}

export function getEndOfMonth() {
  const belgiumDate = getBelgiumDate();
  const year = belgiumDate.getFullYear();
  const month = belgiumDate.getMonth();
  const lastDay = getDaysInMonth(year, month);

  const endOfMonth = new Date(year, month, lastDay, 23, 59, 59, 999);
  return endOfMonth;
}

export function getPeriodBoundaries(frequency) {
  switch (frequency) {
    case "daily":
      return {
        startDate: getStartOfDay(),
        endDate: getEndOfDay(),
      };
    case "weekly":
      return {
        startDate: getStartOfWeek(),
        endDate: getEndOfWeek(),
      };
    case "monthly":
      return {
        startDate: getStartOfMonth(),
        endDate: getEndOfMonth(),
      };
    case "as_needed":
      return {
        startDate: getStartOfWeek(),
        endDate: getEndOfWeek(),
      };
    default:
      throw new Error(`Unknown frequency: ${frequency}`);
  }
}

export function formatForDatabase(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

// Parse the nl-BE formatted date string from backend: "dd/mm/yy hh:mm:ss"
export function parseBackendDate(dateString, asUTC = false) {
  try {
    if (typeof dateString === "string" && dateString.includes("/")) {
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("/");
      const [hour, minute, second] = timePart.split(":");
      const fullYear = 2000 + parseInt(year);

      if (asUTC) {
        return new Date(
          Date.UTC(
            fullYear,
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hour),
            parseInt(minute),
            parseInt(second)
          )
        );
      } else {
        return new Date(
          fullYear,
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hour),
          parseInt(minute),
          parseInt(second)
        );
      }
    } else {
      return new Date(dateString);
    }
  } catch (error) {
    console.error("❌ Error parsing backend date:", dateString, error);
    return new Date();
  }
}
