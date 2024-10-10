"use client";

import React from "react";

import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

interface Props {
  scheduleData: {
    [date: string]: string[];
  };
}

export default function Client({ scheduleData }: Props) {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // 지난주 시작일
  const startOfLastWeek = dayjs().startOf("week").subtract(1, "week");
  // 이번달 마지막일 계산
  const endOfThisMonth = dayjs().endOf("month");

  // 지난주 시작일을 기점으로 마지막일까지의 날짜
  const ThisMonthRemainderDays =
    endOfThisMonth.diff(startOfLastWeek, "day") + 1;

  // 다음달 시작일
  const startOfNextMonth = dayjs().add(1, "month").startOf("month");

  // 다음달의 요일
  const nextMonthStartDay = startOfNextMonth.day();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thisMonthDays = Array.from(
    { length: ThisMonthRemainderDays },
    (_, index) => startOfLastWeek.add(index, "day")
  );

  const nextMonthDays = Array.from(
    { length: 35 - ThisMonthRemainderDays },
    (_, index) => startOfNextMonth.add(index, "day")
  );

  const currentMonth = dayjs().month();

  const emptyDays = Array.from({ length: nextMonthStartDay }, () => null);

  const nextdays = [...emptyDays, ...nextMonthDays];

  function colorDate(day: dayjs.Dayjs | null) {
    const dayOfWeek = dayjs(day).format("ddd");
    if (dayOfWeek === "일") {
      return "text-red-500";
    } else if (dayOfWeek === "토") {
      return "text-blue-500";
    }
    return "text-black";
  }
  const tableCellStyle = "w-[14.28%] h-10 text-center";

  return (
    <>
      <p>{currentMonth + 1}월</p>
      <table className="w-full text-center">
        <thead>
          <tr>
            {weekDays.map((day) => (
              <th
                key={day}
                className={`${
                  day === "토"
                    ? "text-blue-500"
                    : day === "일"
                      ? "text-red-500"
                      : "text-black"
                }`}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from(
            { length: Math.ceil(ThisMonthRemainderDays / 7) },
            (_, weekIndex) => {
              return (
                <tr key={weekIndex} className="h-10">
                  {thisMonthDays
                    .slice(weekIndex * 7, weekIndex * 7 + 7)
                    .map((day) => {
                      return (
                        <td
                          key={day.format("YYYY-MM-DD")}
                          className={`${
                            day.month() === currentMonth ? "" : "other-month"
                          }${tableCellStyle} `}
                        >
                          <button
                            className={`w-10 h-10 ${colorDate(day)} ${day.isBefore(today) ? "cursor-default bg-secondary" : "cursor-pointer"} rounded-full `}
                          >
                            {day.date()}
                          </button>
                        </td>
                      );
                    })}
                </tr>
              );
            }
          )}
        </tbody>
      </table>

      <p>{currentMonth + 2}월</p>
      <table className="w-full text-center">
        <thead>
          <tr>
            {weekDays.map((day) => (
              <th
                key={day}
                className={`${
                  day === "토"
                    ? "text-blue-500"
                    : day === "일"
                      ? "text-red-500"
                      : "text-black"
                }`}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from(
            { length: Math.ceil(nextdays.length / 7) },
            (_, weekIndex) => (
              <tr key={weekIndex} className="h-10">
                {nextdays
                  .slice(weekIndex * 7, weekIndex * 7 + 7)
                  .map((day, index) => (
                    <td
                      key={index}
                      className={`${day ? "" : "other-month"} ${tableCellStyle}`}
                    >
                      {day && (
                        <button
                          className={`w-10 h-10 ${colorDate(day)} cursor-pointer rounded-full`}
                        >
                          {day.date()}
                        </button>
                      )}
                    </td>
                  ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
}