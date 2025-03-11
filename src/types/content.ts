export type Document = Config | Page;
export type DocumentTypeNames = 'Config' | 'Page';

/** Document types */
export type Config = {
    __id: string;
    __url: null;
    type: 'Config';
    favicon?: string;
    header?: Header;
    footer?: Footer;
};

export type Page = {
    __id: string;
    __url: string;
    type: 'Page';
    title: string;
    body?: string;
};

/** Nested types */
export type Button = {
    type: 'Button';
    label: string;
    onClick: () => void;
    size?: 'small' | 'medium' | 'large';
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'inherit' | 'primary' | 'secondary';
};

export type Footer = {
    type: 'Footer';
    copyrightText?: string;
    navLinks?: Link[];
};

export type Header = {
    type: 'Header';
    title?: string;
    navLinks?: Link[];
};

export type Image = {
    type: 'Image';
    url?: string;
    altText?: string;
};

export type Link = {
    type: 'Link';
    label: string;
    url: string;
    underline?: 'always' | 'hover' | 'none';
    color?: 'inherit' | 'primary' | 'secondary';
};
