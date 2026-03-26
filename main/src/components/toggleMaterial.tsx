"use client";
import { useState } from "react";

function MaterialToggle({ id, initial }) {
  const [isActive, setIsActive] = useState(initial === 1);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    const newValue = !isActive;
    setIsActive(newValue);
    setLoading(true);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_PORT_URL}/api/users/updateStatus/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isActive: newValue ? 1 : 0 }),
        },
      );
    } catch (e) {
      console.error(e);
      setIsActive(!newValue);
    } finally {
      setLoading(false);
    }
  };

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={isActive}
        disabled={loading}
        onChange={toggle}
      />
      <span className="slider round"></span>
    </label>
  );
}
export default MaterialToggle;
