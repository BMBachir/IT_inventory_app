"use client";

import { useState, useEffect } from "react";

interface MaterialToggleProps {
  id: string;
  initial: number | boolean | string;
}

function MaterialToggle({ id, initial }: MaterialToggleProps) {
  // Normalize incoming value from API
  const normalizeActive = (val: number | boolean | string) => {
    return val === 1 || val === true || val === "1";
  };

  const [isActive, setIsActive] = useState(normalizeActive(initial));

  const [loading, setLoading] = useState(false);

  // Sync state when initial value changes (important after refresh or refetch)
  useEffect(() => {
    setIsActive(normalizeActive(initial));
  }, [initial]);

  const toggle = async () => {
    const newValue = !isActive;

    // Optimistic update
    setIsActive(newValue);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_PORT_URL}/api/users/updateStatus/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            isActive: newValue ? 1 : 0,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }
    } catch (e) {
      console.error("Toggle error:", e);

      // Rollback UI if request fails
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
