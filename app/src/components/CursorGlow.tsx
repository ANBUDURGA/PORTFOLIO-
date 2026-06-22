import { useCursorGlow } from '@/hooks/useScrollAnimation';

export function CursorGlow() {
  const position = useCursorGlow();

  return (
    <div
      className="fixed pointer-events-none z-0 hidden md:block"
      style={{
        left: position.x,
        top: position.y,
        width: '400px',
        height: '400px',
        transform: 'translate(-50%, -50%)',
        background: 'var(--cursor-glow)',
        borderRadius: '50%',
        transition: 'none',
      }}
    />
  );
}
