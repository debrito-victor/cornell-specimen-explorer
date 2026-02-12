import type { ReactNode } from "react";

export type TabItem = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: TabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onAdd: () => void;
  children: ReactNode;
};

export default function Tabs({ tabs, activeId, onSelect, onClose, onAdd, children }: TabsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <div
              key={tab.id}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-cornell-400 bg-cornell-500/30 text-white"
                  : "border-white/20 bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <button type="button" onClick={() => onSelect(tab.id)}>
                {tab.label}
              </button>
              <button
                type="button"
                className="text-white/50 hover:text-white"
                onClick={() => onClose(tab.id)}
                aria-label={`Close ${tab.label}`}
              >
                x
              </button>
            </div>
          );
        })}
        <button className="btn" type="button" onClick={onAdd}>
          + New Search
        </button>
      </div>
      {children}
    </div>
  );
}
