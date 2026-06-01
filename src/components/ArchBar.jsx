import { MACHINES } from "../data/machines";

const ROLE_COLOR = {
  master: "arch-master",
  shared: "arch-shared",
  node:   "arch-node",
};

export default function ArchBar({ configs }) {
  return (
    <div className="arch-bar">
      {MACHINES.map((m, i) => {
        const cfg = configs[m.id];
        return (
          <div key={m.id} className="arch-item">
            {i > 0 && <span className="arch-arrow">→</span>}
            <div className={`arch-node ${ROLE_COLOR[m.role]}`}>
              <span className="arch-dot" />
              <div>
                <div className="arch-name">{m.title}</div>
                <div className="arch-spec">
                  {cfg.cpu} vCPU · {cfg.ram} GB · {m.role}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
