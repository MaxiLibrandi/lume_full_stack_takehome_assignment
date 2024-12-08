// components/DataReview.tsx

import { useEffect, useState } from "react";

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';

import Cell from "./Cell";
import ErrorSummaryModal from "./ErrorSummaryModal";

export default function DataReviewTable() {

    const [records, setRecords] = useState<any>([]);
    const [errorSummary, setErrorSummary] = useState<any>([]);
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    // Function to handle error summary
    const handleErrorSummary = (errors: any) => {

        let errorList: any = [];
        for (const key in errors) {
            errorList.push(
                {
                    field: key,
                    message: errors[key].message,
                    severity: errors[key].severity
                }
            );
        }

        // Sort by severity and field name.
        errorList.sort((a: any, b: any) => {
            if (a.severity === "critical" && b.severity === "warning") return -1;
            if (a.severity === "warning" && b.severity === "critical") return 1;
            return a.field.localeCompare(b.field);
        });

        setErrorSummary(errorList);
        handleShow();
    }

    const handleExportToCSV = () => {

        let csvRows = [];
        
        const headers = [
            "ID",
            "Name",
            "Email",
            "Street",
            "City",
            "Zipcode",
            "Phone",
            "Status",
            "Errors"
        ]
        csvRows.push(headers.join(','));
        
        for (const row of records) {
            const values = [
                row.id,
                row.name,
                row.email,
                row.street,
                row.city,
                row.zipcode,
                row.phone,
                row.status,
                JSON.stringify(row.errors)
            ];
            csvRows.push(values.join(','));
        }

        const csvData = csvRows.join('\n');

        // Download the file
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }
    
    useEffect(() => {
        // Get data from API handler (pages/api/data.ts)
        fetch("/api/data")
            .then((res) => res.json())
            .then((data) => {
                setRecords(data.records);
            });
    }, []);

    return (
        <div style={{ margin: "20px" }}>
            <h1>
                Data Review
            </h1>
            {
                records.length > 0 ? (
                <>
                    <Button variant="primary" onClick={handleExportToCSV} >
                        Export to CSV
                    </Button>
                    <Table  bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Street</th>
                                <th>City</th>
                                <th>Zipcode</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((row: any, index: number) => (
                                <tr key={index}>
                                    <Cell value={row.id} error={row.errors.id} />
                                    <Cell value={row.name} error={row.errors.name} />
                                    <Cell value={row.email} error={row.errors.email} />
                                    <Cell value={row.street} error={row.errors.street} />
                                    <Cell value={row.city} error={row.errors.city} />
                                    <Cell value={row.zipcode} error={row.errors.zipcode} />
                                    <Cell value={row.phone} error={row.errors.phone} />
                                    <Cell value={row.status} error={row.errors.status} />
                                    <td>
                                        <Button 
                                            variant="outline-primary" 
                                            style={{ width: "100%" }}
                                            onClick = {() => handleErrorSummary(row.errors)}
                                        >
                                            Error Summary
                                        </Button> 
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <ErrorSummaryModal 
                        showModal={showModal} 
                        handleClose={handleClose} 
                        errorSummary={errorSummary}
                    />
                </>
                ) : (
                    <Spinner animation="grow" />
                )
            }
        </div>
    );
}
