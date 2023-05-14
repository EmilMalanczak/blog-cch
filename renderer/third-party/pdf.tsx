import * as React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// ensure pdfjs can find its worker script regardless of how react-notion-x is bundled
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

export const Pdf: React.FC<{ file: string }> = ({ file, ...rest }) => {
    const [pages, setNumPages] = React.useState(0);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    return (
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess} {...rest}>
            {Array.from(new Array(pages), (_, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
        </Document>
    );
};
