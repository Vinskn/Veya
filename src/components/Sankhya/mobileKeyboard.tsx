import { Delete } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export type MobileKeyboardProps = {
    modifyState: Dispatch<SetStateAction<string>>
    value: string
    // onSubmit: () => void
}

export const MobileKeyboard = ({ modifyState, value }: MobileKeyboardProps) => {
  const mappingKeyboard = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
    'del', 0, '-'
  ];

  const handleClick = (key: string | number) => {
    if(key == '-' && value.length > 0) return
    if (key === 'del') {
      modifyState((prev) => prev.slice(0, -1));
    } else {
      modifyState((prev) => prev + key);
    }
  }

  return (
    <div className="flex gap-2 w-full max-w-sm mx-auto p-3 bg-bg-main/80 backdrop-blur-md rounded-xl border border-space-cyan/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div className="grid grid-cols-3 gap-2 flex-1">
        {mappingKeyboard.map((key, index) => (
          <button
            key={index}
            onClick={() => handleClick(key)}
            type="button"
            className="flex items-center justify-center py-4 bg-space-cyan/5 border border-space-cyan/30 rounded-lg text-space-cyan font-mono text-2xl font-bold hover:bg-space-cyan/20 hover:border-space-cyan hover:shadow-[0_0_10px_var(--color-space-cyan)] transition-all active:scale-95"
          >
            {key == 'del' ? <Delete /> : key}
          </button>
        ))}
      </div>
      <button  type="submit" className="w-20 flex items-center justify-center bg-space-purple/10 border border-space-purple/40 rounded-lg text-space-purple font-mono text-lg font-bold hover:bg-space-purple/30 hover:border-space-purple hover:shadow-[0_0_15px_var(--color-space-purple)] transition-all active:scale-95">
        <span style={{ writingMode: 'vertical-lr' }} className="rotate-180 uppercase tracking-widest">Enter</span>
      </button>
    </div>
  );
};
