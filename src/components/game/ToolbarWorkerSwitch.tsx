import { Box, IconButton, Switch } from '@mui/joy';
import { ToolbarElementHeader } from './ToolbarElementHeader';
import { Engineering, RestartAlt } from '@mui/icons-material';

export function ToolbarWorkerSwitch({
    isWorkerEnabled,
    onToggleWorker,
    onReset,
    disabled
}: {
    isWorkerEnabled: boolean;
    onToggleWorker: (enabled: boolean) => void;
    onReset: () => void;
    disabled: boolean;
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '112px',
                padding: '12px',
                backgroundColor: 'rgb(244, 250, 254)',
                borderRadius: '8px'
            }}
        >
            <ToolbarElementHeader icon={Engineering} title="Web Worker" />
            <Switch
                checked={isWorkerEnabled}
                onChange={(event) => onToggleWorker(event.target.checked)}
                disabled={disabled}
                color={isWorkerEnabled ? 'success' : 'neutral'}
                variant={isWorkerEnabled ? 'solid' : 'outlined'}
                endDecorator={isWorkerEnabled ? 'On' : 'Off'}
                slotProps={{
                    endDecorator: {
                        sx: {
                            minWidth: 24
                        }
                    }
                }}
            />

            <IconButton
                disabled={disabled}
                color="primary"
                variant="solid"
                sx={{ padding: '8px 10px', gap: '4px' }}
                onClick={onReset}
            >
                Reset
                <RestartAlt />
            </IconButton>
        </Box>
    );
}
