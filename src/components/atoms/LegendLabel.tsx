export function LegendLabel({ label }: { label: string | number }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '22px',
                height: '22px',
                minWidth: 'auto',
                fontSize: '8px',
                margin: '0 1px 1px 0'
            }}
        >
            {label}
        </div>
    );
}
