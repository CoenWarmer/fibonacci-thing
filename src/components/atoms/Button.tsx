import { memo } from 'react';

export const Button = memo(({ value, active, onClick }: { value: number; active: boolean; onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            style={{
                margin: '0 1px 1px 0',
                padding: '0',
                width: '22px',
                height: '22px',
                minWidth: 'auto',
                fontSize: '8px',
                borderColor: '#7394ec',
                backgroundColor: active ? 'green' : '#4b69b7',
                color: '#fff',
                boxShadow: 'none',
                borderRadius: '2px',
                border: 'none',
                cursor: 'pointer'
            }}
        >
            {String(value)}
        </button>
    );
});

Button.displayName = 'MemoizedButton';
