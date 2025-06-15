import React, { useRef } from "react";
import { Field } from "formik";

export function CardNumberFields() {
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (e, idx, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    setFieldValue(`card${idx + 1}`, value);
    if (value.length === 4 && idx < 3) {
      refs[idx + 1].current.focus();
    }
  };

  const handleKeyDown = (e, idx, values) => {
    if (e.key === "Backspace" && values[`card${idx + 1}`] === "" && idx > 0) {
      refs[idx - 1].current.focus();
    }
  };

  return (
    <Field name="card1">
      {({ form }) => {
        const { setFieldValue, values } = form;
        return (
          <div className="flex space-x-2">
            {[0, 1, 2, 3].map((idx) => (
              <input
                key={idx}
                name={`card${idx + 1}`}
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                maxLength={4}
                ref={refs[idx]}
                className="w-1/4 border rounded px-3 py-2 text-center"
                placeholder={["1234", "5678", "9012", "3456"][idx]}
                value={values[`card${idx + 1}`]}
                onChange={(e) => handleChange(e, idx, setFieldValue)}
                onKeyDown={(e) => handleKeyDown(e, idx, values)}
              />
            ))}
          </div>
        );
      }}
    </Field>
  );
}
