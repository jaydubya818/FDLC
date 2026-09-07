type IconName = "api" | "control" | "dependency" | "definition" | "docs" | "economics" | "evaluation" | "factory" | "framework" | "measure" | "pipeline" | "playbook" | "quality" | "reuse" | "review" | "scale" | "shield" | "test" | "verify";

const line = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 1.5 };

export function FdeIcon({ name }: { name: IconName }) {
  return (
    <svg aria-hidden="true" className="fde-icon" viewBox="0 0 32 32">
      {name === "dependency" && <><path {...line} d="M8 7h16v6H8zM8 19h16v6H8z" /><path {...line} d="M16 13v6M5 10h3m16 0h3M5 22h3m16 0h3" /></>}
      {name === "api" && <><path {...line} d="M12 6 5 16l7 10M20 6l7 10-7 10M18 4l-4 24" /></>}
      {name === "shield" && <><path {...line} d="M16 4 26 8v7c0 6.5-4.2 10.7-10 13-5.8-2.3-10-6.5-10-13V8z" /><path {...line} d="m11 16 3 3 7-7" /></>}
      {(name === "quality" || name === "verify" || name === "evaluation") && <><circle {...line} cx="16" cy="16" r="11" /><path {...line} d="m10.5 16 3.5 3.5 7.5-8" /></>}
      {(name === "docs" || name === "playbook" || name === "definition") && <><path {...line} d="M8 4h11l5 5v19H8z" /><path {...line} d="M19 4v6h5M12 15h8M12 20h8" /></>}
      {name === "review" && <><path {...line} d="M5 7h22v15H14l-6 5v-5H5z" /><path {...line} d="m11 14 3 3 7-7" /></>}
      {name === "test" && <><path {...line} d="M11 4h10M13 4v7L7 25a2 2 0 0 0 2 3h14a2 2 0 0 0 2-3l-6-14V4" /><path {...line} d="M10 21h12" /></>}
      {name === "framework" && <><path {...line} d="M5 9h22M5 16h22M5 23h22M10 5v22M22 5v22" /></>}
      {name === "pipeline" && <><circle {...line} cx="7" cy="8" r="3" /><circle {...line} cx="25" cy="24" r="3" /><path {...line} d="M10 8h7a4 4 0 0 1 4 4v8M21 20l4 4M21 20l4-4" /></>}
      {(name === "factory" || name === "control") && <><path {...line} d="M5 27V12l8 4V9l8 4V5h6v22z" /><path {...line} d="M9 21h3m4 0h3m4 0h3" /></>}
      {(name === "measure" || name === "economics") && <><path {...line} d="M5 27h22M8 23l5-6 4 3 7-10" /><circle {...line} cx="24" cy="10" r="2" /></>}
      {name === "reuse" && <><path {...line} d="M9 11a9 9 0 0 1 15-2l3 3M23 12h4V8M23 21a9 9 0 0 1-15 2l-3-3M9 20H5v4" /></>}
      {name === "scale" && <><path {...line} d="M5 26 14 17l5 5 8-12" /><path {...line} d="M20 10h7v7" /></>}
    </svg>
  );
}
