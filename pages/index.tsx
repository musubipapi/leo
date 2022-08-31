import type { NextPage } from "next";
import { useState } from "react";

import {
  format,
  formatDistanceToNowStrict,
  intervalToDuration,
  isAfter,
  isBefore,
  subDays,
} from "date-fns";

function calculateFullAge(birthDate: Date) {
  const { years, months, days } = intervalToDuration({
    start: birthDate,
    end: new Date(),
  });
  return { years, months, days };
}
const Home: NextPage = () => {
  const [date, setDate] = useState<undefined | string>("");
  const [isEligible, setIsEligible] = useState<undefined | boolean>(undefined);
  const [ageMetadata, setAgeMetadata] = useState<{
    isTooYoung: boolean;
    isTooOld: boolean;
    ageObj:
      | {
          years: number;
          months: number;
        }
      | undefined;
  }>({} as any);
  const [hover, setHover] = useState(false);

  const checkDate = (date?: string) => {
    if (date) {
      const minAge = subDays(new Date(), 365 * 21);
      const maxAge = subDays(new Date(), 365 * 25);
      const age = new Date(date);

      const isTooYoung = isAfter(age, minAge);
      const isTooOld = isBefore(age, maxAge);
      if (isTooOld || isTooYoung) {
        setIsEligible(false);
        setAgeMetadata({
          isTooYoung,
          isTooOld,
        });
      } else {
        const ageObj = calculateFullAge(age);
        const ageUntilIneligible = {
          years: 24 - ageObj.years!,
          months: 12 - ageObj.months!,
        };
        setIsEligible(true);
        setAgeMetadata({
          isTooYoung,
          isTooOld,
          ageObj: ageUntilIneligible,
        });
      }
    }
  };
  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {isEligible && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          style={{
            maxWidth: "500px",
            maxHeight: "300px",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          src="/happy-leo.gif"
          alt="eligible-leo"
        />
      )}
      {isEligible !== undefined && !isEligible && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          style={{
            maxWidth: "500px",
            maxHeight: "300px",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          src="/sad-leo.gif"
          alt="ineligible-leo"
        />
      )}
      <p style={{ fontSize: "25px" }}>Can you date Leonardo DiCaprio?</p>
      {isEligible && (
        <>
          <p style={{ fontWeight: "bold" }}>Yes, you made the cut!</p>
          <p>
            You are{" "}
            {ageMetadata?.ageObj?.years !== 0
              ? `${ageMetadata?.ageObj?.years} years and `
              : ""}
            {ageMetadata?.ageObj?.months} months away from being dumped by Leo.
          </p>
        </>
      )}
      {!isEligible && (
        <>
          {ageMetadata.isTooYoung && (
            <p style={{ fontWeight: "bold" }}>{`You're too young!`}</p>
          )}
          {ageMetadata.isTooOld && (
            <p style={{ fontWeight: "bold" }}>{`You're too old!`}</p>
          )}
        </>
      )}
      <p>Enter your birth date:</p>
      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="date"
        id="start"
        name="trip-start"
      ></input>
      <button
        onClick={() => date && checkDate(date)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          marginTop: "25px",
          background: "#ED9C57",
          border: "none",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "10px",
          ...(hover && {
            transition: "0.2s all ease-in",
            boxShadow: "0 0.5em 0.5em -0.4em black",
            transform: "translateY(-0.25em)",
          }),
        }}
      >
        Check if you are eligible
      </button>
    </div>
  );
};

export default Home;
