import * as React from 'react';
import type * as types from 'types';
import { Link } from '../../atoms/Link';

import MuiBox from '@mui/joy/Box';
import MuiTypography from '@mui/joy/Typography';

export type Props = types.Header & types.StackbitObjectId;

export const Header: React.FC<Props> = (props) => {
    const { title, navLinks = [], 'data-sb-object-id': objectId } = props;

    return (
        <div>
            {title && (
                <MuiBox sx={{ mb: 1, mr: 2, flexGrow: 1 }}>
                    <MuiTypography
                        component="h1"
                        variant="plain"
                        color="primary"
                        sx={{ fontSize: '1.5rem', fontWeight: 700 }}
                        data-sb-field-path=".title"
                    >
                        {title}
                    </MuiTypography>
                </MuiBox>
            )}
            {navLinks.length > 0 && (
                <MuiBox
                    component="nav"
                    sx={{ display: 'flex', flexWrap: 'wrap' }}
                    data-sb-field-path=".navLinks"
                >
                    {navLinks.map((link, index) => (
                        <Link
                            key={index}
                            {...link}
                            sx={{
                                ...(index !== navLinks.length - 1 && { mr: 2 }),
                                mb: 1
                            }}
                            data-sb-field-path={`.${index}`}
                        />
                    ))}
                </MuiBox>
            )}
        </div>
    );
};
