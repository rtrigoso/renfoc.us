'use client';

export default function GameToggleButton({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
    return (
        <button
            className="game_wrapper_toggle"
            title="wanna play?"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-label="JS enabled? play a game by clicking on this button"
            aria-hidden="true">
            <span className="game_wrapper_toggle_label">
                <span>G</span><span>A</span>
                <span>M</span><span>E</span>
            </span>
        </button>
    );
}
