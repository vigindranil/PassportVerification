import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
const DocumentTable = ({ documents }) => {
    return (
        <Card className="mb-8">
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Application ID</TableHead>
                                <TableHead>Entry User ID</TableHead>
                                <TableHead>Document Path</TableHead>
                                <TableHead>Document Type ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents?.map((doc, index) => (
                                <TableRow key={index}>
                                    <TableCell>{doc?.ApplicationId}</TableCell>
                                    <TableCell>{doc?.EntryuserId}</TableCell>
                                    <TableCell>{doc?.DocumentPath}</TableCell>
                                    <TableCell>{doc?.DocumentTypeId}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default DocumentTable
